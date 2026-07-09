import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;

export async function appendToSheet(sheetName: string, values: any[]) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });
  } catch (error) {
    console.error('Google Sheets append error:', error);
  }
}

export async function syncRegistrationToSheet(registration: any) {
  const values = [
    new Date().toISOString(),
    registration.id,
    registration.teamName,
    registration.competitionType,
    registration.captainEmail,
    registration.captainName,
    registration.institution,
    'PENDING',
  ];
  await appendToSheet('Registrations', values);
}

export async function syncSubmissionToSheet(submission: any) {
  const values = [
    new Date().toISOString(),
    submission.id,
    submission.teamName,
    submission.phase,
    submission.status,
    submission.fileUrl || '',
  ];
  await appendToSheet('Submissions', values);
}