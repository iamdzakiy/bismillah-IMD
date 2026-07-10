export type CompetitionType = 'OLYMPIAD' | 'SPC' | 'NEC';
export type SubmissionPhase = 'PRELIMINARY' | 'SEMIFINAL' | 'FINAL';
export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RegistrationStatus =
  | 'PENDING_DOCS'
  | 'DOCUMENT_SUBMITTED'
  | 'DOCUMENT_APPROVED'
  | 'DOCUMENT_REJECTED'
  | 'REGISTERED';

export type DashboardMember = {
  id: string;
  userId: string;
  user: {
    id: string;
    name?: string | null;
    email: string;
    institution?: string | null;
    phone?: string | null;
    age?: number | null;
    studentProofUrl?: string | null;
    role?: string | null;
  };
};

export type DashboardSubmission = {
  id: string;
  phase: SubmissionPhase;
  status: SubmissionStatus;
  notes?: string | null;
  proposalUrl?: string | null;
  videoPitchUrl?: string | null;
  fullPaperUrl?: string | null;
  posterUrl?: string | null;
  pitchDeckUrl?: string | null;
};

export type DashboardTeam = {
  id: string;
  teamName: string;
  competitionType: CompetitionType;
  captainId: string;
  captain: {
    id: string;
    name?: string | null;
    email: string;
  };
  members: DashboardMember[];
  registration?: {
    id: string;
    status: RegistrationStatus;
    currentPhase: SubmissionPhase;
    adminNote?: string | null;
    paymentProofUrl?: string | null;
  } | null;
  submissions?: DashboardSubmission[];
};