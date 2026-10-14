// src/lib/final.ts
// Central configuration for the FINAL module (SPC/NEC finalists).
// WhatsApp group links per track and the official guidebook live here so they
// can be updated in one place.

// Official WhatsApp group links for finalists, per track.
export const FINAL_WHATSAPP_LINKS: Record<'SPC' | 'NEC', string> = {
  SPC: 'https://chat.whatsapp.com/HTJqnU7dAQK1sfPlyG6sH1?s=cl&p=i&ilr=4&iam=0',
  NEC: 'https://chat.whatsapp.com/Dq7zNMWbM1PJGjUmzYXMIY?mode=gi_t',
};

export const FINAL_WHATSAPP_LABELS: Record<'SPC' | 'NEC', string> = {
  SPC: 'WA Group Final SPC',
  NEC: 'WA Group Final NEC',
};

// Official guidebook for SPC finalists (Google Drive file).
// The embedded viewer uses the /preview endpoint; the raw view URL is kept
// as a fallback "open in new tab" link.
export const SPC_FINAL_GUIDEBOOK_FILE_ID = '1sqk9ZEtFX79vcDshc35QLlK8pIFoQP0i';
export const SPC_FINAL_GUIDEBOOK_EMBED_URL = `https://drive.google.com/file/d/${SPC_FINAL_GUIDEBOOK_FILE_ID}/preview`;
export const SPC_FINAL_GUIDEBOOK_VIEW_URL = `https://drive.google.com/file/d/${SPC_FINAL_GUIDEBOOK_FILE_ID}/view?usp=sharing`;
