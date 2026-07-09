export type CompetitionType = 'OLYMPIAD' | 'SPC' | 'NEC';
export type SubmissionPhase = 'PRELIMINARY' | 'SEMIFINAL' | 'FINAL';
export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RegistrationStatus =
  | 'PENDING_DOCS'
  | 'DOCUMENT_SUBMITTED'
  | 'DOCUMENT_APPROVED'
  | 'DOCUMENT_REJECTED'
  | 'REGISTERED';

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
  members: {
    id: string;
    userId: string;
    user: {
      id: string;
      name?: string | null;
      email: string;
    };
  }[];
  registration?: {
    id: string;
    status: RegistrationStatus;
    currentPhase: SubmissionPhase;
    adminNote?: string | null;
  } | null;
  submissions?: DashboardSubmission[];
};
