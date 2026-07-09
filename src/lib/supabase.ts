// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY.');
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  return supabaseClient;
}

export function getSupabaseBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || 'submissions';
}

export async function getPresignedUrl(fileName: string, fileType: string, userId: string) {
  const supabase = getSupabaseClient();
  const fileExt = fileName.split('.').pop()?.toLowerCase()?.replace(/[^a-z0-9]/g, '') || 'bin';
  const safePath = `${userId}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${fileExt}`;
  const bucket = getSupabaseBucket();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(safePath);

  if (error) throw error;

  const publicUrl = supabase.storage
    .from(bucket)
    .getPublicUrl(safePath).data.publicUrl;

  return {
    presignedUrl: data.signedUrl,
    token: data.token,
    publicUrl,
    path: safePath,
    contentType: fileType,
  };
}