# Supabase Real-time Sync & Database Setup

Untuk mengaktifkan sinkronisasi database dan fitur **Real-time** secara penuh di seluruh perangkat, silakan ikuti langkah-langkah mudah berikut di dashboard Supabase Anda:

## 1. Buat Tabel Sinkronisasi (`class_data`)

Silakan buka **SQL Editor** di dashboard Supabase Anda, tempel kode SQL berikut, lalu klik **Run**:

```sql
-- 1. Buat tabel untuk menyimpan state aplikasi
CREATE TABLE IF NOT EXISTS class_data (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan fitur Real-time (Postgres Changes) untuk tabel class_data
ALTER PUBLICATION supabase_realtime ADD TABLE class_data;
```

---

## 2. Hubungkan Kredensial Supabase ke AI Studio

Pastikan Anda telah mengisi kredensial API Supabase di file `.env` atau panel konfigurasi lingkungan AI Studio:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

## 3. Fitur Keamanan dan Sinkronisasi Pengguna

Aplikasi ini memiliki fitur **Dual-layer fallback**:
- Apabila kredensial Supabase belum diisi atau tabel di atas belum dibuat, aplikasi akan secara otomatis beralih menggunakan server backup REST lokal sehingga aplikasi Anda tidak akan pernah error / blank!
- Ketika login pertama kali dengan username biasa (contoh: `nizam.dev`), sistem akan otomatis meregistrasikan kredensial di Supabase Auth sehingga pengguna dapat langsung masuk ke dashboard dengan aman.
- Setiap kali admin melakukan perubahan data (Jadwal, Dokumentasi, Prestasi, Organisasi, dsb), perubahan tersebut akan langsung ter-sinkronisasi ke seluruh layar perangkat client lainnya secara **instan (Real-time)** tanpa reload halaman!
