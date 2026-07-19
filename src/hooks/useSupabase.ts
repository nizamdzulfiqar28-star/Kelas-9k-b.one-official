import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Generic hook for fetching and managing data from Supabase
export function useSupabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from a specific table
  const fetchTable = useCallback(async (tableName: string, options?: { select?: string, order?: { column: string, ascending?: boolean } }) => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase.from(tableName).select(options?.select || '*');
      
      if (options?.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      return data;
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload file to Supabase Storage
  const uploadFile = useCallback(async (bucketName: string, filePath: string, file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengunggah file.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchTable,
    uploadFile,
    supabase
  };
}
