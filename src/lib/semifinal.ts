// src/lib/semifinal.ts
// Central configuration for the independent post-preliminary (semifinal re-registration)
// module. Everything shown to the user (payment details, WA Group link, template link)
// lives here so it can be updated in one place.

export const SEMIFINAL_PAYMENT = {
  // Amount that must be transferred for the semifinal re-registration.
  amount: '150.001',
  amountLabel: 'IDR 150.001',
  // "Aditya Bank Jago" — the recipient account for the re-registration fee.
  bank: 'Aditya Bank Jago',
  bankShort: 'Bank Jago',
  accountNumber: '104614051845',
  accountHolder: 'Aditya Ramadhani',
  // Other useful info, mirroring the Olympiad / registration payment info.
  notes:
    'All bank transfer fees and currency exchange rates must be borne by participants. Use your team name as the transfer reference so we can match your payment.',
  procedure: [
    'Transfer IDR 150.001 to the official IMD account below.',
    'Upload a clear payment receipt / screenshot (PDF, JPG or PNG) below.',
    'Your receipt must clearly show the payer\u2019s name, the exact amount (150.001) and the transaction date.',
    'The committee reviews your payment and re-registration (1\u20133 business days).',
    'You will receive an email confirmation once your re-registration is approved.',
  ],
};

// Official invitation link to the competition "WA Group" for participant queries & updates.
export const SEMIFINAL_WHATSAPP_LINK = 'https://chat.whatsapp.com/ClwIbQfe86BILn7WBp9bEn';
export const SEMIFINAL_WHATSAPP_LABEL = 'WA Group — IMD 2026';

// Template download for the re-registration document / full paper.
export const SEMIFINAL_TEMPLATE_LINK = 'https://bit.ly/CompeIMD2026';

// How many days the committee typically takes to review a re-registration.
export const SEMIFINAL_REVIEW_WINDOW_DAYS = 3;

// Text shown at the top of the mandatory re-registration screen.
export const SEMIFINAL_HERO_COPY = {
  headline: 'Congratulations on Passing the Preliminary Phase!',
  sub: 'Your application impressed our reviewers. Complete your mandatory re-registration for the semifinal phase to unlock the full paper submission form.',
};