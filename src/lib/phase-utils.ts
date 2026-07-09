export const COMPETITION_TIMELINE = {
  OLYMPIAD: {
    registrationStart: new Date('2026-07-01T00:00:00+07:00'),
    registrationEnd: new Date('2026-07-31T23:59:59+07:00'),
    preliminaryStart: new Date('2026-08-01T00:00:00+07:00'),
    preliminaryEnd: new Date('2026-08-16T23:59:59+07:00'),
    semifinalStart: new Date('2026-08-17T00:00:00+07:00'),
    semifinalEnd: new Date('2026-08-31T23:59:59+07:00'),
    finalStart: new Date('2026-11-14T00:00:00+07:00'),
    finalEnd: new Date('2026-11-15T23:59:59+07:00'),
  },
  SPC: {
    registrationStart: new Date('2026-07-01T00:00:00+07:00'),
    registrationEnd: new Date('2026-07-31T23:59:59+07:00'),
    preliminaryStart: new Date('2026-08-01T00:00:00+07:00'),
    preliminaryEnd: new Date('2026-08-16T23:59:59+07:00'),
    semifinalStart: new Date('2026-08-17T00:00:00+07:00'),
    semifinalEnd: new Date('2026-08-31T23:59:59+07:00'),
    finalStart: new Date('2026-11-14T00:00:00+07:00'),
    finalEnd: new Date('2026-11-15T23:59:59+07:00'),
  },
  NEC: {
    registrationStart: new Date('2026-07-01T00:00:00+07:00'),
    registrationEnd: new Date('2026-07-31T23:59:59+07:00'),
    preliminaryStart: new Date('2026-08-01T00:00:00+07:00'),
    preliminaryEnd: new Date('2026-08-16T23:59:59+07:00'),
    semifinalStart: new Date('2026-08-17T00:00:00+07:00'),
    semifinalEnd: new Date('2026-08-31T23:59:59+07:00'),
    finalStart: new Date('2026-11-14T00:00:00+07:00'),
    finalEnd: new Date('2026-11-15T23:59:59+07:00'),
  },
};

export type Phase = 'registration' | 'preliminary' | 'semifinal' | 'final';
export type CompetitionCode = 'OLYMPIAD' | 'SPC' | 'NEC';

export function getCurrentPhase(code: CompetitionCode, now: Date = new Date()): Phase | 'closed' {
  const timeline = COMPETITION_TIMELINE[code];

  if (now >= timeline.registrationStart && now <= timeline.registrationEnd) {
    return 'registration';
  }
  if (now >= timeline.preliminaryStart && now <= timeline.preliminaryEnd) {
    return 'preliminary';
  }
  if (now >= timeline.semifinalStart && now <= timeline.semifinalEnd) {
    return 'semifinal';
  }
  if (now >= timeline.finalStart && now <= timeline.finalEnd) {
    return 'final';
  }
  return 'closed';
}

export function isSubmissionOpen(
  code: CompetitionCode,
  phase: Phase,
  now: Date = new Date()
): boolean {
  const timeline = COMPETITION_TIMELINE[code];
  const start = timeline[`${phase}Start` as keyof typeof timeline];
  const end = timeline[`${phase}End` as keyof typeof timeline];

  if (!start || !end) return false;
  return now >= start && now <= end;
}