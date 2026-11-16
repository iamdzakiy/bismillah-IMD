// Data statis untuk timeline, memories, sponsors, dll.

export type TimelineBranch = 'MO' | 'SPC' | 'NEC' | 'SPC & NEC' | 'All';

export interface TimelineEntry {
  id: string;
  /** First day of the milestone, ISO yyyy-mm-dd (used to mark past / upcoming). */
  start: string;
  /** Last day of the milestone, ISO yyyy-mm-dd. Same as start for one-day events. */
  end: string;
  date: string;
  title: string;
  desc: string;
  branch: TimelineBranch;
}

// Source: Guidebook Compe IMD 2026 (ENG), timeline and fee pages.
export const TIMELINE_DATA: TimelineEntry[] = [
  {
    id: 'reg-open',
    start: '2026-07-19',
    end: '2026-08-31',
    date: '19 Jul – 31 Aug 2026',
    title: 'Registration and abstracts',
    desc: 'MO early bird IDR 75k until 8 Aug, then IDR 85k. SPC and NEC abstracts are free to submit.',
    branch: 'All',
  },
  {
    id: 'semi-announce',
    start: '2026-09-08',
    end: '2026-09-09',
    date: '8 – 9 Sep 2026',
    title: 'Semifinalists announced',
    desc: 'SPC on 8 September, NEC on 9 September.',
    branch: 'SPC & NEC',
  },
  {
    id: 'semi-work',
    start: '2026-09-09',
    end: '2026-09-30',
    date: '9 – 30 Sep 2026',
    title: 'Semifinal work period',
    desc: 'Re-registration (IDR 150k). SPC writes the proposal and elevator pitch video; NEC gets paper coaching and submits the full paper.',
    branch: 'SPC & NEC',
  },
  {
    id: 'mo-trial',
    start: '2026-10-03',
    end: '2026-10-04',
    date: '3 – 4 Oct 2026',
    title: 'MO platform trial',
    desc: 'Technical meeting and exam platform check.',
    branch: 'MO',
  },
  {
    id: 'finalists',
    start: '2026-10-11',
    end: '2026-10-11',
    date: '11 Oct 2026',
    title: 'SPC and NEC finalists announced',
    desc: 'Top 10 NEC teams advance. SPC finalists start building prototypes.',
    branch: 'SPC & NEC',
  },
  {
    id: 'mo-prelim',
    start: '2026-10-17',
    end: '2026-10-17',
    date: '17 Oct 2026',
    title: 'MO elimination round',
    desc: '35 true/false questions, four statements each, 120 minutes online.',
    branch: 'MO',
  },
  {
    id: 'mo-finalists',
    start: '2026-10-25',
    end: '2026-10-31',
    date: '25 – 31 Oct 2026',
    title: 'MO finalists and re-registration',
    desc: 'SPC prototypes and NEC pitch decks and posters are due by 31 October.',
    branch: 'All',
  },
  {
    id: 'tm',
    start: '2026-11-07',
    end: '2026-11-08',
    date: '7 – 8 Nov 2026',
    title: 'Final technical meetings',
    desc: 'Online briefings for every finalist.',
    branch: 'All',
  },
  {
    id: 'finals',
    start: '2026-11-14',
    end: '2026-11-14',
    date: '14 Nov 2026',
    title: 'Finals at ITB Ganesha',
    desc: 'MO theory and lab practical, SPC final pitching, NEC pitching day.',
    branch: 'All',
  },
  {
    id: 'awarding',
    start: '2026-11-15',
    end: '2026-11-15',
    date: '15 Nov 2026',
    title: 'Exhibition and awarding',
    desc: 'SPC prototypes and NEC posters on display, then the awarding night.',
    branch: 'All',
  },
];

export const MEMORIES_DATA = [
  { title: 'PetriDish Art 2024', date: '2024', year: '2024', image: '/31.png', color: '#6e8efb' },
  { title: 'Awarding Night 2025', date: 'September 2025', year: '2025', image: '/32.png', color: '#a777e3' },
  { title: 'Petri Dish Art 2025', date: 'September 2025', year: '2025', image: '/28.jpg', color: '#f093fb' },
  { title: 'Exhibition Microverse', date: 'September 2025', year: '2025', image: '/27.jpg', color: '#4facfe' },
  { title: 'Art Collaborator', date: 'September 2025', year: '2025', image: '/33.png', color: '#6e8efb' },
  { title: 'Exhibition Microverse', date: 'September 2025', year: '2025', image: '/25.jpg', color: '#a777e3' },
  { title: 'Exhibition Microverse', date: 'September 2025', year: '2025', image: '/24.jpg', color: '#f093fb' },
  { title: 'Exhibition Microverse', date: 'September 2025', year: '2025', image: '/22.jpg', color: '#4facfe' },
  { title: 'Exhibition Microverse', date: 'September 2025', year: '2025', image: '/23.jpg', color: '#6e8efb' },
  { title: 'Petri Dish Art 2025', date: 'September 2025', year: '2025', image: '/30.jpg', color: '#a777e3' },
];

export const MEDIA_PARTNERS = [
  { name: 'info_lomba' },
  { name: 'prfmnews' },
  { name: '8ehradioitb' },
  { name: 'reporter8eh' },
  { name: 'youthizenprfm' },
];

// Organisers shown in the "Organised by" strip
export const POWERED_BY = [
  { name: 'Archaea #Eksis', image: '/logo_archaea.svg' },
  { name: 'SITH', image: '/logo-SITH.png', dark: true },
  { name: 'ITB', image: '/logo-itb.png' },
  { name: 'IMD', image: '/favicon.svg' },
];

// Mascot artwork used across the site
export const MASCOTS = [
  { id: 'mascot-1', name: 'Microbe Alpha', image: '/5.svg', color: '#6e8efb' },
  { id: 'mascot-2', name: 'Microbe Beta', image: '/2.svg', color: '#a777e3' },
  { id: 'mascot-3', name: 'Microbe Gamma', image: '/3.svg', color: '#f093fb' },
  { id: 'mascot-4', name: 'Microbe Delta', image: '/4.svg', color: '#4facfe' },
];
