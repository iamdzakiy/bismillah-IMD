import { google, sheets_v4 } from 'googleapis';

type SheetValue = string | number | boolean | null | undefined;

let sheetsClient: sheets_v4.Sheets | null = null;

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!rawCredentials || !spreadsheetId) {
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(rawCredentials),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheetsClient = google.sheets({ version: 'v4', auth });
    return sheetsClient;
  } catch (error) {
    console.error('Google Sheets configuration error:', error);
    return null;
  }
}

export async function appendToSheet(sheetName: string, values: SheetValue[]) {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheets || !spreadsheetId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Skipped Google Sheets sync for ${sheetName}: missing configuration.`);
    }
    return;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });
  } catch (error) {
    console.error('Google Sheets append error:', error);
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

export async function syncRegistrationToSheet(registration: {
  id: string;
  teamName?: string | null;
  competitionType?: string | null;
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
    studentProofUrl: string | null;
    role: string;
  }>;
  paymentProof?: string | null;
}) {
  const date = new Date().toISOString();
  const memberNames = registration.members?.map((m) => m.name).join('; ') || '';
  const memberEmails = registration.members?.map((m) => m.email).join('; ') || '';
  const memberInstitutions = registration.members?.map((m) => m.institution).join('; ') || '';
  const memberPhones = registration.members?.map((m) => m.phone).join('; ') || '';
  const memberAges = registration.members?.map((m) => m.age?.toString() || '').join('; ') || '';
  const memberProofs = registration.members?.map((m) => m.studentProofUrl || '').join('; ') || '';

  const values = [
    date,
    registration.id,
    registration.teamName ?? '',
    registration.competitionType ?? '',
    registration.captainName ?? '',
    registration.captainEmail ?? '',
    registration.institution ?? '',
    memberNames,
    memberEmails,
    memberInstitutions,
    memberPhones,
    memberAges,
    memberProofs,
    registration.paymentProof ?? '',
    registration.status ?? 'PENDING',
    'FALSE', // approved (trigger for manual verification)
  ];

  await appendToSheet('Registrations', values);
}

export async function syncSubmissionToSheet(submission: {
  id: string;
  teamName?: string | null;
  phase?: string | null;
  status?: string | null;
  fileUrl?: string | null;
}) {
  const values = [
    new Date().toISOString(),
    submission.id,
    submission.teamName ?? '',
    submission.phase ?? '',
    submission.status ?? '',
    submission.fileUrl ?? '',
  ];

  await appendToSheet('Submissions', values);
}