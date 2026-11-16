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
    title: 'Exhibition, symposium and awarding',
    desc: 'Exhibition at CADL Design Centre, the gut microbiome symposium at SBM Freeport, then the gala dinner and awarding night.',
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

// ---------------------------------------------------------------------------
// Main events. Venues and times follow the IMD 2026 KIT and Town Hall deck.
// ---------------------------------------------------------------------------

export type EventKind = 'workshop' | 'ceremony' | 'finals' | 'exhibition' | 'symposium' | 'gala';

export interface ImdEvent {
  id: string;
  kind: EventKind;
  name: string;
  /** ISO date, used to mark past and upcoming events */
  iso: string;
  day: string;
  time: string;
  venue: string;
  desc: string;
  open: string;
}

export const EVENTS: ImdEvent[] = [
  {
    id: 'pda',
    kind: 'workshop',
    name: 'Petri Dish Art Workshop',
    iso: '2026-11-07',
    day: 'Sat, 7 Nov 2026',
    time: 'Session 1: 10.00–12.00 · Session 2: 13.00–15.00 WIB',
    venue: 'Lab Instruksional Timur, SITH ITB',
    desc: 'Paint with living cultures. Participants streak pigmented bacteria and yeast onto agar with sterile loops, then watch the design appear as the colonies grow.',
    open: 'Public, limited seats per session',
  },
  {
    id: 'opening',
    kind: 'ceremony',
    name: 'Opening Ceremony',
    iso: '2026-11-14',
    day: 'Sat, 14 Nov 2026',
    time: '07.30–09.30 WIB',
    venue: 'West Hall (Aula Barat), ITB Ganesha',
    desc: 'The official start of IMD 2026 with remarks from SITH ITB leadership and a symbolic opening for all finalists.',
    open: 'Finalists and invited guests',
  },
  {
    id: 'finals',
    kind: 'finals',
    name: 'Grand Finals: MO, SPC & NEC',
    iso: '2026-11-14',
    day: 'Sat, 14 Nov 2026',
    time: '10.00–15.45 WIB',
    venue: 'SITH ITB: Lab Instruksional Barat, R. Seminar, R. Sidang',
    desc: 'MO finalists sit a theory paper and a two-hour wet-lab practical. SPC and NEC finalists pitch to the jury.',
    open: 'Finalists',
  },
  {
    id: 'exhibition',
    kind: 'exhibition',
    name: 'Exhibition',
    iso: '2026-11-15',
    day: 'Sun, 15 Nov 2026',
    time: '10.00–12.10 WIB',
    venue: 'CADL Design Centre, ITB Ganesha',
    desc: 'SPC prototypes and NEC posters on show. Jury booth judging plus visitor voting decide the Best Booth award.',
    open: 'Open to the public',
  },
  {
    id: 'symposium',
    kind: 'symposium',
    name: 'Symposium: Microbes, Gut, & Our Health',
    iso: '2026-11-15',
    day: 'Sun, 15 Nov 2026',
    time: '13.00–15.00 WIB · in English',
    venue: 'Auditorium SBM Freeport, 6th Floor, ITB Ganesha',
    desc: 'Three experts on how the trillions of microbes in our gut shape digestion, immunity and disease, followed by an open Q&A.',
    open: 'Open to the public',
  },
  {
    id: 'gala',
    kind: 'gala',
    name: 'Gala Dinner & Awarding Night',
    iso: '2026-11-15',
    day: 'Sun, 15 Nov 2026',
    time: '18.30–22.00 WIB',
    venue: 'Auditorium SBM Freeport, 6th Floor, ITB Ganesha',
    desc: 'The closing ceremony: dinner, performances, and the awards for MO, SPC, NEC and Best Booth.',
    open: 'Finalists and invited guests',
  },
];

export interface Speaker {
  name: string;
  role: 'Speaker' | 'Moderator';
  initials: string;
}

export const SYMPOSIUM_SPEAKERS: Speaker[] = [
  { name: 'Dr. Eng. Kamarisima', role: 'Speaker', initials: 'K' },
  { name: 'Prof. Dr. Ir. Endang Sutriswati Rahayu', role: 'Speaker', initials: 'ESR' },
  { name: 'Prof. Dr. Ida Parwati, dr., Sp.PK(K), PhD', role: 'Speaker', initials: 'IP' },
  { name: 'Jayen Aris Kriswantoro, S.Si., M.Si., Ph.D.', role: 'Moderator', initials: 'JAK' },
];
