'use client';

import { useSyncExternalStore } from 'react';

// The landing page is prerendered, so "today" must be read on the client.
// useSyncExternalStore gives null during SSR/hydration and the real date after,
// without a setState-in-effect round trip.
const subscribe = () => () => {};
const getSnapshot = () => new Date().toISOString().slice(0, 10);
const getServerSnapshot = () => null;

/** Today's date as yyyy-mm-dd on the client, or null while server rendering. */
export function useToday(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export type EventPhase = 'registration' | 'running' | 'finals-week' | 'finished';

/** Where IMD 2026 is, based on the guidebook dates. */
export function getEventPhase(today: string): EventPhase {
  if (today <= '2026-08-31') return 'registration';
  if (today < '2026-11-07') return 'running';
  if (today <= '2026-11-15') return 'finals-week';
  return 'finished';
}
