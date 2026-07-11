# Google Sheets Integration Setup

## Issue: "The caller does not have permission"

This error means the Google Service Account doesn't have access to the spreadsheet. Here's how to fix it:

## Step 1: Get the Service Account Email

From your `.env` file, the service account email is:
```
imd-383@imd2026101.iam.gserviceaccount.com
```

## Step 2: Share the Google Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Pm4Wxb1OblTAoajqChv1O4LMn7USqA6MwPtYpx2JGv8

2. Click the **"Share"** button (top right)

3. Add the service account email: `imd-383@imd2026101.iam.gserviceaccount.com`

4. Set permission to **"Editor"**

5. Click **"Send"**

## Step 3: Verify Sheet Tabs Exist

Make sure your Google Sheet has these tabs (sheets):
- `Registrations` - for team registration data
- `Submissions` - for competition submissions
- `Test` - for testing (optional)

## Step 4: Test the Integration

After sharing, test the integration:

```bash
# In your browser:
curl http://localhost:3000/api/test-google-sheets
```

Or visit: http://localhost:3000/api/test-google-sheets

## Expected Result

You should see:
```json
{
  "success": true,
  "message": "Google Sheets test completed. Check your sheet for new entries."
}
```

And in your Google Sheet, you should see new rows in the "Registrations" and "Test" tabs.

## Troubleshooting

### Error: "The caller does not have permission"
**Solution**: Make sure you've shared the sheet with the service account email and given it "Editor" permissions.

### Error: "Missing configuration"
**Solution**: Check that `GOOGLE_SERVICE_ACCOUNT_KEY` and `GOOGLE_SHEET_ID` are set in your `.env` file.

### Error: "Sheet not found"
**Solution**: Make sure the sheet tabs exist with the exact names: `Registrations`, `Submissions`, `Test`

## How It Works

When a team registers:
1. The registration API (`/api/competitions/register`) saves to database
2. It automatically calls `syncRegistrationToSheet()`
3. The data appears in the "Registrations" tab in Google Sheets

When a team submits work:
1. The submission API saves to database
2. It automatically calls `syncSubmissionToSheet()`
3. The data appears in the "Submissions" tab in Google Sheets

## Data Format

### Registrations Tab Columns:
- Timestamp
- Registration ID
- Team Name
- Competition Type
- Captain Name
- Captain Email
- Institution
- Member Names (semicolon-separated)
- Member Emails
- Member Institutions
- Member Phones
- Member Ages
- Member Proof URLs
- Payment Proof URL
- Status
- Approved (FALSE = pending verification)

### Submissions Tab Columns:
- Timestamp
- Submission ID
- Team Name
- Phase (PRELIMINARY/SEMIFINAL/FINAL)
- Status
- File URL