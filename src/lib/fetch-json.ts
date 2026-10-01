// src/lib/fetch-json.ts — safe JSON parsing to avoid
// "Unexpected token 'R', Request Entity..." crashes when the server/CDN
// returns plain text (e.g. Vercel 413 Request Entity Too Large).
export async function parseJsonSafe<T = Record<string, any>>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    // Non-JSON body (HTML / plain text from Vercel, proxy, Supabase, ...).
    // Surface the real message instead of "Unexpected token 'R' ... is not valid JSON".
    const snippet = text.trim().replace(/\s+/g, ' ').slice(0, 300);
    throw new Error(snippet || `Request failed (${res.status})`);
  }
}
