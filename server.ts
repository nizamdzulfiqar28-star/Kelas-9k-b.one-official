import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const CLOUD_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/acbefed';
const BACKUP_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'class_data_backup.json');

async function startServer() {
  const app = express();

  // Support large payloads up to 15MB
  app.use(express.json({ limit: '15mb' }));

  // Helper to ensure directory exists
  const ensureDirectoryExists = async (filePath: string) => {
    try {
      const dirname = path.dirname(filePath);
      await fs.mkdir(dirname, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }
  };

  // API Routes
  app.get('/api/sync', async (req, res) => {
    // Disable HTTP caching for this route
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    try {
      console.log('Fetching state from extendsclass...');
      // Cache-busting query parameter to bypass extendsclass's 2-hour cache
      const response = await fetch(`${CLOUD_BIN_URL}?nocache=${Date.now()}`);
      if (response.ok) {
        const cloudData = await response.json();
        if (cloudData) {
          await ensureDirectoryExists(BACKUP_FILE_PATH);
          await fs.writeFile(BACKUP_FILE_PATH, JSON.stringify(cloudData, null, 2), 'utf-8');
          console.log('Successfully synced state from cloud and backed up locally.');
          return res.json(cloudData);
        }
      }
      throw new Error(`Cloud returned status ${response.status}`);
    } catch (err: any) {
      console.error('Failed to fetch from cloud. Reading from local backup...', err);
      try {
        await ensureDirectoryExists(BACKUP_FILE_PATH);
        const localContent = await fs.readFile(BACKUP_FILE_PATH, 'utf-8');
        const localData = JSON.parse(localContent);
        return res.json(localData);
      } catch (localErr) {
        console.error('No local backup file found or failed to read:', localErr);
        return res.status(200).json({ _fallback: true });
      }
    }
  });

  app.put('/api/sync', async (req, res) => {
    try {
      console.log('Saving state to local backup...');
      const payload = req.body;
      
      // Save locally first so we always have a local copy immediately
      await ensureDirectoryExists(BACKUP_FILE_PATH);
      await fs.writeFile(BACKUP_FILE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
      
      try {
        const response = await fetch(CLOUD_BIN_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          console.warn(`[Server] Cloud PUT returned status ${response.status}. State safely persisted in local backup.`);
          return res.json({ success: true, warning: `Saved to local backup (Cloud status ${response.status})` });
        }
        
        console.log('Successfully synced state to cloud.');
        return res.json({ success: true });
      } catch (cloudErr: any) {
        console.warn('[Server] Cloud sync notice:', cloudErr.message || cloudErr);
        return res.json({ success: true, warning: 'Saved to local backup' });
      }
    } catch (err: any) {
      console.error('[Server] Failed to write local backup:', err);
      return res.status(500).json({ error: 'Failed to write local backup' });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
