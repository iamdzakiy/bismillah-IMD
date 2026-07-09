import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getPresignedUrl(fileName: string, fileType: string) {
  const fileExt = fileName.split('.').pop();
  const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET || 'submissions')
    .createSignedUploadUrl(filePath);

  if (error) throw error;

  const publicUrl = supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET || 'submissions')
    .getPublicUrl(filePath).data.publicUrl;

  return {
    presignedUrl: data.signedUrl,
    publicUrl,
    path: filePath,
  };
}