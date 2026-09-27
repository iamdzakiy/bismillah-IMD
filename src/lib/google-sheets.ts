import { google, sheets_v4 } from 'googleapis';

type SheetValue = string | number | boolean | null | undefined;

let sheetsClient: sheets_v4.Sheets | null = null;

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!rawCredentials || !spreadsheetId) {
    console.warn('Google Sheets: Missing credentials or spreadsheet ID');
    return null;
  }

  try {
    const credentials = JSON.parse(rawCredentials);
    console.log('Google Sheets: Using service account:', credentials.client_email);
    
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheetsClient = google.sheets({ version: 'v4', auth });
    return sheetsClient;
  } catch (error) {
    console.error('Google Sheets configuration error:', error);
    return null;
  }
}

export async function appendToSheet(sheetName: string, values: SheetValue[]): Promise<number | undefined> {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheets || !spreadsheetId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Skipped Google Sheets sync for ${sheetName}: missing configuration.`);
    }
    return undefined;
  }

  try {
    console.log(`Google Sheets: Attempting to append to ${sheetName} in spreadsheet ${spreadsheetId}`);
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });
    console.log(`Google Sheets: Successfully appended to ${sheetName}`);

    // Extract row number from response (e.g., "Registrations!A19" -> 19)
    const updatedRange = response.data.updates?.updatedRange;
    if (updatedRange) {
      const match = updatedRange.match(/!A(\d+)/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return undefined;
  } catch (error) {
    console.error(`Google Sheets append error for ${sheetName}:`, error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return undefined;
  }
}

export async function updateSheetRow(sheetName: string, row: number, values: SheetValue[]) {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheets || !spreadsheetId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Skipped Google Sheets update for ${sheetName}: missing configuration.`);
    }
    return;
  }

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${row}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });
  } catch (error) {
    console.error('Google Sheets update error:', error);
  }
}

// ============================================================
// USERS SHEET — all columns from User model
// ============================================================
export async function syncUserToSheet(user: {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | string | null;
  image?: string | null;
  password?: string | null; // hashed password
  realPassword?: string | null; // actual/plaintext password
  googleId?: string | null;
  active?: boolean;
  role?: string;
  institution?: string | null;
  educationLevel?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}) {
  const values = [
    new Date().toISOString(), // sync timestamp
    user.id,
    user.name ?? '',
    user.email,
    user.emailVerified ? new Date(user.emailVerified).toISOString() : '',
    user.image ?? '',
    user.password ?? '', // hashed password
    user.realPassword ?? '', // actual/plaintext password
    user.googleId ?? '',
    user.active ? 'TRUE' : 'FALSE',
    user.role ?? 'USER',
    user.institution ?? '',
    user.educationLevel ?? '',
    user.createdAt ? new Date(user.createdAt).toISOString() : '',
    user.updatedAt ? new Date(user.updatedAt).toISOString() : '',
  ];

  await appendToSheet('Users', values);
}

// ============================================================
// REGISTRATIONS SHEET — all columns from Team + Registration models
// ============================================================
export async function syncRegistrationToSheet(registration: {
  id: string;
  teamName?: string | null;
  competitionType?: string | null;
  captainId?: string | null;
  captainEmail?: string | null;
  captainName?: string | null;
  institution?: string | null;
  status?: string | null;
  members?: Array<{
    name: string;
    email: string;
    institution: string;
    phone: string;
    age: number | null;
    studentProofUrl?: string | null;
    role: string;
  }>;
  // Registration model fields
  ktmUrl?: string | null;
  pdfMergeUrl?: string | null;
  paymentProofUrl?: string | null;
  adminNote?: string | null;
  paymentStatus?: string | null;
  currentPhase?: string | null;
  googleSheetRow?: number | null;
  // Proof URLs
  shareProofUrl?: string | null;
  twibbonProofUrl?: string | null;
  groupsProofUrl?: string | null;
  // Timestamps
  teamCreatedAt?: Date | string;
  teamUpdatedAt?: Date | string;
  registrationCreatedAt?: Date | string;
  registrationUpdatedAt?: Date | string;
}): Promise<number | undefined> {
  const date = new Date().toISOString();
  const memberNames = registration.members?.map((m) => m.name).join('; ') || '';
  const memberEmails = registration.members?.map((m) => m.email).join('; ') || '';
  const memberInstitutions = registration.members?.map((m) => m.institution).join('; ') || '';
  const memberPhones = registration.members?.map((m) => m.phone).join('; ') || '';
  const memberAges = registration.members?.map((m) => m.age?.toString() || '').join('; ') || '';
  const memberProofs = registration.members?.map((m) => m.studentProofUrl || '').join('; ') || '';
  const memberRoles = registration.members?.map((m) => m.role || '').join('; ') || '';

  const values = [
    date, // sync timestamp
    registration.id, // team id
    registration.teamName ?? '',
    registration.competitionType ?? '',
    registration.captainId ?? '',
    registration.captainName ?? '',
    registration.captainEmail ?? '',
    registration.institution ?? '',
    memberNames,
    memberEmails,
    memberInstitutions,
    memberPhones,
    memberAges,
    memberProofs,
    memberRoles,
    // Registration model fields
    registration.ktmUrl ?? '',
    registration.pdfMergeUrl ?? '',
    registration.paymentProofUrl ?? '',
    registration.status ?? 'PENDING',
    registration.adminNote ?? '',
    registration.paymentStatus ?? 'FREE',
    registration.currentPhase ?? 'PRELIMINARY',
    registration.googleSheetRow?.toString() ?? '',
    // Proof URLs
    registration.shareProofUrl ?? '',
    registration.twibbonProofUrl ?? '',
    registration.groupsProofUrl ?? '',
    // Timestamps
    registration.teamCreatedAt ? new Date(registration.teamCreatedAt).toISOString() : '',
    registration.teamUpdatedAt ? new Date(registration.teamUpdatedAt).toISOString() : '',
    registration.registrationCreatedAt ? new Date(registration.registrationCreatedAt).toISOString() : '',
    registration.registrationUpdatedAt ? new Date(registration.registrationUpdatedAt).toISOString() : '',
    'FALSE', // approved (trigger for manual verification)
  ];

  const row = await appendToSheet('Registrations', values);
  return row;
}

// ============================================================
// SUBMISSIONS SHEET — all columns from Submission model
// Header tab "Submissions" (urutan kolom — JANGAN ubah urutan lama):
// A SyncTimestamp | B SubmissionID | C TeamID | D TeamName | E CompetitionType(Kategori)
// | F CaptainEmail | G Phase | H Status | I ProposalURL | J VideoPitchURL(ElevatorPitch)
// | K FullPaperURL | L PosterURL | M PitchDeckURL | N Notes
// | O ReviewedByID | P ReviewedAt | Q CreatedAt(Timestamp Submission) | R UpdatedAt
// | S CaptainID(baru) | T CaptainName/Ketua(baru) | U Institution(baru)
// Kolom S–U di-APPEND di akhir agar baris lama tetap sejajar (backward-compatible).
// Untuk alur SPC Semifinal, kolom yang dipetakan: C TeamID, D Nama Tim, T Ketua,
// F Email, E Kategori("SPC"), J Elevator Pitch, K Full Paper, Q Timestamp Submission.
// ============================================================
export async function syncSubmissionToSheet(submission: {
  id: string;
  teamId?: string | null;
  teamName?: string | null;
  competitionType?: string | null;
  captainId?: string | null;
  captainName?: string | null;
  captainEmail?: string | null;
  institution?: string | null;
  phase?: string | null;
  status?: string | null;
  proposalUrl?: string | null;
  videoPitchUrl?: string | null;
  fullPaperUrl?: string | null;
  posterUrl?: string | null;
  pitchDeckUrl?: string | null;
  notes?: string | null;
  reviewedById?: string | null;
  reviewedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}) {
  const values = [
    new Date().toISOString(), // A sync timestamp
    submission.id, // B
    submission.teamId ?? '', // C TeamID
    submission.teamName ?? '', // D Nama Tim
    submission.competitionType ?? '', // E Kategori
    submission.captainEmail ?? '', // F Email
    submission.phase ?? '', // G
    submission.status ?? '', // H
    submission.proposalUrl ?? '', // I
    submission.videoPitchUrl ?? '', // J Elevator Pitch
    submission.fullPaperUrl ?? '', // K Full Paper
    submission.posterUrl ?? '', // L
    submission.pitchDeckUrl ?? '', // M
    submission.notes ?? '', // N
    submission.reviewedById ?? '', // O
    submission.reviewedAt ? new Date(submission.reviewedAt).toISOString() : '', // P
    submission.createdAt ? new Date(submission.createdAt).toISOString() : '', // Q Timestamp Submission
    submission.updatedAt ? new Date(submission.updatedAt).toISOString() : '', // R
    // --- kolom baru (append di akhir, backward-compatible) ---
    submission.captainId ?? '', // S CaptainID
    submission.captainName ?? '', // T Ketua
    submission.institution ?? '', // U Institution
  ];

  // Non-blocking di sisi pemanggil: appendToSheet sudah try-catch internal
  // (return undefined saat gagal) sehingga tidak melempar ke API route.
  await appendToSheet('Submissions', values);
}