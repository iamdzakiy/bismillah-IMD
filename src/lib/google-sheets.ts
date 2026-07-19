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
    studentProofUrl?: string | null;
    role: string;
  }>;
  paymentProof?: string | null;
  shareProofUrl?: string | null;
  twibbonProofUrl?: string | null;
  groupsProofUrl?: string | null;
}): Promise<number | undefined> {
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
    registration.shareProofUrl ?? '',
    registration.twibbonProofUrl ?? '',
    registration.groupsProofUrl ?? '',
    registration.status ?? 'PENDING',
    'FALSE', // approved (trigger for manual verification)
  ];

  const row = await appendToSheet('Registrations', values);
  return row;
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