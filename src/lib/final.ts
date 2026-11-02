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

// ---------------------------------------------------------------------------
// FINALIST ALLOWLIST — single source of truth for who may access the FINAL
// module and submit final materials. Enforced server-side in
// /api/submissions/final and in the dashboard server component, so the UI and
// the API can never disagree again (the old checks used two different signals:
// the UI accepted "semifinal submission APPROVED" while the API required
// registration.currentPhase === 'FINAL', which produced
// "Your team is not in the final phase." for real finalists).
//
// Names are matched after normalization (case, spaces, punctuation ignored),
// so "IWAK TEAM", "Iwak Team" and "iwak-team" all match.
// To add/remove a finalist, edit this list and redeploy.
// ---------------------------------------------------------------------------
export const FINALIST_TEAMS: Record<'SPC' | 'NEC', readonly string[]> = {
  SPC: ['B-OILOGY', 'EDISAL', 'BIO_HL', 'IWAK TEAM', 'Wowokdetok'],
  NEC: [
    'MGPG',
    'Kurang Lebih Begitu',
    'Tim mi Time',
    'Reza Traktir Makan',
    'Ochim',
    'RAKIT KARYA',
    'Antek-Antek Asing',
    'WeLoveBuGiyo',
    'Genova',
    '2MatchCulture',
  ],
};

/** Lowercase and strip everything that is not a letter or digit. */
export function normalizeTeamName(name: string | null | undefined): string {
  return (name ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

const FINALIST_KEYS: Record<'SPC' | 'NEC', Set<string>> = {
  SPC: new Set(FINALIST_TEAMS.SPC.map(normalizeTeamName)),
  NEC: new Set(FINALIST_TEAMS.NEC.map(normalizeTeamName)),
};

/**
 * True only when the team is on the finalist list for ITS OWN track.
 * An NEC team that happens to share a name with an SPC finalist is rejected.
 */
export function isFinalistTeam(
  teamName: string | null | undefined,
  competitionType: string | null | undefined
): boolean {
  if (competitionType !== 'SPC' && competitionType !== 'NEC') return false;
  const key = normalizeTeamName(teamName);
  return key.length > 0 && FINALIST_KEYS[competitionType].has(key);
}
