export interface CompetitionTimelineItem {
  phase: string;
  date: string;
  desc: string;
  platform: string;
}

export interface CompetitionBenefit {
  icon: string;
  title: string;
  value: string;
}

export interface WhyJoinItem {
  icon: string;
  title: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface Subtheme {
  name: string;
  focus: string;
  topics: string[];
  keywords: string[];
}

export interface RegistrationInfo {
  batches: {
    name: string;
    period: string;
    fee: string;
  }[];
  link: string;
  socialMediaRequirements: string[];
  requiredDocuments: { item: string; namingFormat: string }[];
  paymentDetails: {
    bank: string;
    accountNumber: string;
    accountHolder: string;
    notes: string;
  };
  verificationProcess: string;
}

export interface EliminationPhase {
  format: string;
  duration: string;
  questions: { type: string; count: number; details: string }[];
  scoring: { correct: string; incorrect: string; unanswered: string; maxScore: string };
}

export interface FinalPhase {
  venue: string;
  components: { name: string; weight: string; details: string }[];
}

export interface Award {
  prize: string;
  reward: string;
}

export interface AssessmentCriterion {
  criteria: string;
  weight: string;
  focus: string;
}

export interface StageInfo {
  name: string;
  cost: string;
  details: string[];
  requirements?: string[];
  assessmentCriteria?: AssessmentCriterion[];
}

export interface SPCInfo {
  teamComposition: string;
  teamLeader: string;
  schoolRule: string;
  subthemes: Subtheme[];
  stages: StageInfo[];
  awards: Award[];
  rules: string[];
}

export interface NECInfo {
  teamComposition: string;
  teamLeader: string;
  universityRule: string;
  submissionLimit: string;
  vision: string;
  mission: string[];
  subthemes: Subtheme[];
  stages: StageInfo[];
  awards: Award[];
  rules: string[];
}

export interface CompetitionData {
  id: string;
  shortName: string;
  title: string;
  category: string;
  icon: string;
  glowColor: string;
  description: string;
  fullDescription: string;
  format: string;
  teamSize: string;
  eligibility: string;
  requirements: string[];
  benefits: CompetitionBenefit[];
  whyJoin: WhyJoinItem[];
  timeline: CompetitionTimelineItem[];
  faq: FAQItem[];
  // Extended fields from guidebook
  guidebookUrl?: string;
  organizer?: string;
  scale?: string;
  vision?: string;
  mission?: string[];
  eligibilityDetails?: {
    canParticipate: string[];
    cannotParticipate: string[];
    documentRequirements: string[];
    multiplePerSchool: string;
  };
  registration?: RegistrationInfo;
  syllabus?: string[];
  eliminationPhase?: EliminationPhase;
  finalPhase?: FinalPhase;
  awards?: Award[];
  keyRules?: string[];
  subthemes?: Subtheme[];
  competitionStages?: StageInfo[];
  rules?: string[];
}

export const COMPETITIONS: CompetitionData[] = [
  {
    id: 'olympiad',
    shortName: 'MO',
    title: 'Microbiology Olympiad (MO)',
    guidebookUrl: 'https://drive.google.com/file/d/1uZJqzA7bixVR7As8t2X6rrbgyvau5-cs/preview',
    category: 'SMA/Sederajat',
    icon: '🏆',
    glowColor: 'blue',
    description: 'OSN-level competition testing deep understanding of microbiology concepts, from theory to laboratory skills.',
    fullDescription: 'Challenge your microbiology knowledge and laboratory skills in Indonesia\'s most comprehensive high school microbiology competition. Test your skills with analytical questions equivalent to National Science Olympiad (OSN) standards.',
    format: 'Online preliminary exam + offline final practical exam',
    teamSize: 'Individual (1 person)',
    eligibility: 'Active SMA/MA/SMK students (all grades)',
    organizer: 'School of Life Sciences and Technology - Science Program (SITH-S), Institut Teknologi Bandung (ITB)',
    scale: 'National',
    requirements: [
      'Active SMA/MA/SMK student (all grades)',
      'Individual participation (1 person only) - NO additional members',
      'KTA (Kartu Tanda Anggota) for participant',
      'Payment proof upload required',
      'Share to 3 groups proof',
      'Twibbon proof upload',
      'Share SG (Student Gathering) proof',
    ],
    benefits: [
      { icon: '🏆', title: 'Total Prize', value: 'Rp 15.000.000+' },
      { icon: '📜', title: 'Certificates', value: 'E-Certificate for all participants' },
      { icon: '🎓', title: 'ITB Exposure', value: 'Experience world-class lab facilities' },
      { icon: '🔬', title: 'Mentorship', value: 'Direct guidance from ITB lecturers' },
    ],
    whyJoin: [
      {
        icon: '📊',
        title: 'OSN-Standard Competition',
        desc: 'Test your knowledge with analytical questions equivalent to National Science Olympiad (OSN) standards.',
      },
      {
        icon: '🧫',
        title: 'Hands-On Laboratory Experience',
        desc: 'Master essential microbiology techniques: Gram staining, optical density reading, spread plate, and streak plate methods.',
      },
      {
        icon: '🦠',
        title: 'Explore Microbial Dark Matter',
        desc: 'Dive deep into the 99% of unculturable microorganisms and discover their hidden potential.',
      },
      {
        icon: '🔭',
        title: 'Path to Research Career',
        desc: 'Identify your potential as a future microbiology researcher with guidance from ITB experts.',
      },
    ],
    timeline: [
      { phase: 'Open Registration Batch 1', date: '13 July - 8 August 2026', desc: 'Batch 1 registration', platform: 'IMD Official Website' },
      { phase: 'Open Registration Batch 2', date: '9 - 31 August 2026', desc: 'Batch 2 registration', platform: 'IMD Official Website' },
      { phase: 'Preliminary Round Technical Meeting', date: '3-4 October 2026', desc: 'Platform trial & rules briefing', platform: 'Online/Zoom' },
      { phase: 'Elimination Round', date: '17 October 2026', desc: 'Online theory exam', platform: 'Online' },
      { phase: 'Announcement of Finalists', date: '25 October 2026', desc: 'Top scorers announced', platform: 'Online' },
      { phase: 'Re-registration of Finalists', date: '25-31 October 2026', desc: 'Confirm participation', platform: 'Online' },
      { phase: 'Final Stage Technical Meeting', date: '7-8 November 2026', desc: 'Technical briefing', platform: 'Online/Zoom' },
      { phase: 'Final Round', date: '14 November 2026', desc: 'Theory + Practical exams', platform: 'In-person at ITB Ganesha' },
      { phase: 'Awarding Ceremony', date: '15 November 2026', desc: 'Winners announced', platform: 'In-person at ITB Ganesha' },
    ],
    faq: [
      { q: 'What topics are covered?', a: 'General microbiology, microbial physiology, genetics, ecology, virology, immunology, and applied microbiology.' },
      { q: 'Is there a registration fee?', a: 'Yes, Batch 1: IDR 75,000; Batch 2: IDR 85,000.' },
      { q: 'How many rounds?', a: 'Two rounds: elimination (online) and final (onsite at ITB).' },
    ],
    vision: 'Encouraging high school students to discover and explore microorganisms through a competitive, educational, and impactful scientific competition.',
    mission: [
      'Enhance literacy on microbiology\'s potential in STEM and other disciplines.',
      'Encourage understanding of microorganisms\' role in healthcare, environment, food, industry, and biotechnology.',
      'Provide a platform for competition with sportsmanship, collaboration, and integrity.',
    ],
    eligibilityDetails: {
      canParticipate: [
        'Active high school students (SMA/MA or equivalent) in Indonesia.',
        'Students from all grades are welcome to participate.',
      ],
      cannotParticipate: [
        'Current or former National Science Olympiad (OSN) Gold Medalists in Biology.',
        'Stage III International Biology Olympiad (IBO) National Training Camp (Pelatnas) participants.',
      ],
      documentRequirements: [
        'Valid student identification card or official school certificate to verify eligibility.',
      ],
      multiplePerSchool: 'Each school may register more than one participant or delegation.',
    },
    registration: {
      batches: [
        { name: 'Batch 1', period: '13 July - 8 August 2026', fee: 'IDR 75,000' },
        { name: 'Batch 2', period: '9 - 31 August 2026', fee: 'IDR 85,000' },
      ],
      link: 'https://imd2026itb.co-id.id/',
      socialMediaRequirements: [
        'Follow official Instagram accounts: @imd.itb and @archaea.itb.',
        'Post official IMD 2026 Twibbon as a regular Instagram post (account must be public).',
        'Tag @imd.itb, @archaea.itb, and 5 other Instagram accounts.',
        'Use the official caption provided by the committee.',
        'Keep the post until registration verification is complete.',
        'Include the Twibbon post URL and a screenshot in the registration form.',
      ],
      requiredDocuments: [
        { item: 'Proof of Payment', namingFormat: 'MO_FullName_SchoolName (e.g., MO_SyarifHidayatullahAzami_SMAN3Bandung)' },
        { item: 'Student ID Card', namingFormat: 'StudentID_FullName (e.g., StudentID_SyarifHidayatullahAzami)' },
        { item: 'Recent 3x4 cm Photograph', namingFormat: 'PassPhoto_FullName (e.g., PassPhoto_SyarifHidayatullahAzami)' },
      ],
      paymentDetails: {
        bank: 'Bank Jago',
        accountNumber: '104614051845',
        accountHolder: 'Aditya Ramadhani',
        notes: 'All bank transfer fees and currency exchange rates must be borne by participants.',
      },
      verificationProcess: 'Committee verifies all documents and payment. Confirmation sent via email or WhatsApp. Committee reserves the right to reject or cancel incomplete or unverified registrations.',
    },
    syllabus: [
      'Cell and Molecular Biology',
      'Microbial Morphology and Physiology',
      'Microbial Genetics and Evolution',
      'Microbial Ecology',
      'Industrial Microbiology: Food, Healthcare, Environmental, Aquaculture, and Energy Applications',
      'Fundamental Microbiology Laboratory Techniques',
    ],
    eliminationPhase: {
      format: 'Conducted online using the official examination platform. Participants must attend the platform trial on 3-4 October 2026.',
      duration: '120 minutes (2 hours)',
      questions: [
        { type: 'True/False', count: 35, details: 'Each question contains four independent statements. Participants determine if each statement is True or False.' },
      ],
      scoring: { correct: '+1 per statement', incorrect: '-0.5 per statement', unanswered: '0', maxScore: '120' },
    },
    finalPhase: {
      venue: 'ITB Ganesha Campus - 14 November 2026',
      components: [
        { name: 'Theory Examination', weight: '50%', details: '50 total questions: 35 True/False, 10 Short-Answer, 5 Essay questions.' },
        { name: 'Laboratory Practical Examination', weight: '50%', details: 'Data-based practical tasks and hands-on laboratory activities. Evaluates data interpretation, analysis skills, and fundamental wet-lab techniques. Responses may be short-answer or essay format.' },
      ],
    },
    awards: [
      { prize: 'Winner 1', reward: 'Cash Prize + Certificate + Medal' },
      { prize: 'Winner 2', reward: 'Cash Prize + Certificate + Medal' },
      { prize: 'Winner 3', reward: 'Cash Prize + Certificate + Medal' },
      { prize: 'Honorable Mention (Best Practical)', reward: 'Cash Prize + Certificate + Medal' },
    ],
    keyRules: [
      'Registration cannot be withdrawn or transferred.',
      'Fees are non-refundable if a participant withdraws, fails to submit materials, or does not attend.',
      'Finalists must attend the competition onsite at ITB.',
      'Twibbon post is mandatory and must remain until verification is complete.',
      'Registration information required: Full name, email, phone, grade/semester, school name, student ID or enrollment document, residential address, school address, recent photo, selected competition, payment proof.',
      'All decisions of the Judging Panel and Committee are final and binding.',
      'For inquiries, contact the designated Contact Person listed in the registration form.',
      'Upon successful verification, participants receive a confirmation email with a WhatsApp group invitation link.',
    ],
  },
  {
    id: 'spc',
    shortName: 'SPC',
    title: 'Science Project Competition (SPC)',
    guidebookUrl: 'https://drive.google.com/file/d/1uZJqzA7bixVR7As8t2X6rrbgyvau5-cs/preview',
    category: 'SMA/Sederajat',
    icon: '🔬',
    glowColor: 'pink',
    description: 'Creative competition for SMA students to develop innovative microbiology-based product prototypes addressing global challenges.',
    fullDescription: 'Transform your microbiology innovations into real-world prototypes and compete for the chance to change the future of sustainability. Develop prototype solutions for global challenges: renewable energy, waste management, and food security using microbiology.',
    format: 'Executive summary -> Full proposal -> Final pitching & Exhibition',
    teamSize: '3 students + 1 supervising teacher',
    eligibility: 'Active SMA/MA/SMK students (all grades)',
    organizer: 'School of Life Sciences and Technology - Science Program (SITH-S), Institut Teknologi Bandung (ITB)',
    scale: 'National',
    requirements: [
      'Team of 3 members from the same school + 1 supervising teacher',
      'Active SMA/MA/SMK students',
      'KTA (Kartu Tanda Anggota) for each participant',
      'Payment proof upload required',
      'Share to 3 groups proof',
      'Twibbon proof upload',
      'Share SG (Student Gathering) proof',
    ],
    benefits: [
      { icon: '💰', title: 'Total Prize', value: 'Rp 20.000.000+' },
      { icon: '🏅', title: 'Certificates', value: 'E-Certificate + Trophy' },
      { icon: '🚀', title: 'Prototype Development', value: 'Funding support' },
      { icon: '🤝', title: 'Industry Connection', value: 'Networking with experts' },
    ],
    whyJoin: [
      {
        icon: '🌍',
        title: 'Real-World Impact',
        desc: 'Develop prototype solutions for global challenges: renewable energy, waste management, and food security using microbiology.',
      },
      {
        icon: '💡',
        title: 'Innovation Platform',
        desc: 'Transform your creative ideas into tangible products with guidance from ITB researchers and industry professionals.',
      },
      {
        icon: '🔬',
        title: 'Decode Microbial Dark Matter',
        desc: 'Explore the 99% of unculturable microorganisms and unlock their biotechnological potential.',
      },
      {
        icon: '📈',
        title: 'Entrepreneurial Skills',
        desc: 'Learn to pitch your innovation, develop business models, and connect with potential investors.',
      },
    ],
    timeline: [
      { phase: 'Registration Opening & Stage 1 (Preliminary)', date: '19 July - 15 August 2026', desc: 'Abstract submission', platform: 'IMD Official Website' },
      { phase: 'Semifinalist Announcement', date: '1 September 2026', desc: 'Stage 1 results', platform: 'IMD Official Website' },
      { phase: 'Re-registration Stage 2 (Semi-Finals)', date: '2-7 September 2026', desc: 'Confirm semi-final participation', platform: 'IMD Official Website' },
      { phase: 'Stage 2 Work Period: Semifinals', date: '2-30 September 2026', desc: 'Full paper & elevator pitch video', platform: 'Asynchronous' },
      { phase: 'Finalist Announcement', date: '11 October 2026', desc: 'Stage 2 results', platform: 'IMD Official Website' },
      { phase: 'Prototype Development Period', date: '12-31 October 2026', desc: 'Build prototypes', platform: 'Asynchronous' },
      { phase: 'Finalist Technical Meeting', date: '7 November 2026', desc: 'Technical briefing', platform: 'Online Meeting' },
      { phase: 'Stage 3: Finals (Final Pitching)', date: '14 November 2026', desc: 'Final pitch presentation', platform: 'Offline at ITB Ganesha' },
      { phase: 'Prototype and Infographic Exhibition', date: '15 November 2026', desc: 'Exhibition day', platform: 'Offline at ITB Ganesha' },
    ],
    faq: [
      { q: 'What is the grand theme?', a: '"The Great Microbial Odyssey: Decoding the Earth\'s Dark Matter to Orchestrate a Sustainable Future".' },
      { q: 'Can we have a supervising teacher?', a: 'Yes, each team must have 1 supervising teacher from the same school.' },
      { q: 'Is there a registration fee?', a: 'Stage 1 (Preliminary) is free. Stage 2 (Semi-Finals) fee not specified.' },
    ],
    vision: 'A platform empowering youth to harness microbiology and biotechnology for sustainable, real-world solutions.',
    mission: [
      'Encouraging product-based innovation.',
      'Encouraging cross-disciplinary collaboration for applicable, sustainable solutions.',
      'Delivering real impact in industrial, food, energy, environmental, health, and pharmaceutical sectors.',
    ],
    subthemes: [
      {
        name: 'Industrial & Food Microbiology',
        focus: 'Eco-friendly and sustainable industrial and food sectors.',
        topics: [
          'Fermented food products',
          'Functional foods',
          'Industrial enzymes',
          'Bioplastics',
          'Alternative proteins',
          'Bio-based products supporting food security and reducing environmental impact',
        ],
        keywords: ['Functional foods', 'Fermented foods', 'Enzymes', 'Bioplastics', 'Alternative proteins', 'Bio-based products'],
      },
      {
        name: 'Energy & Environmental Microbiology',
        focus: 'Addressing environmental and energy issues.',
        topics: [
          'Waste treatment',
          'Pollution bioremediation',
          'Improving water and soil quality',
          'Renewable energy production (biogas, biofuel)',
        ],
        keywords: ['Waste', 'Bioremediation', 'Renewable energy', 'Water or soil quality'],
      },
      {
        name: 'Health & Pharmaceutical Microbiology',
        focus: 'Utilizing and controlling microorganisms to support human, animal, plant, and biological system health.',
        topics: [
          'Health products',
          'Microbiomes',
          'Disease prevention',
          'Cosmetics',
          'Exploration of natural compounds with antimicrobial or biological benefits',
        ],
        keywords: ['Health products', 'Microbiome', 'Cosmetics', 'Antimicrobial'],
      },
    ],
    competitionStages: [
      {
        name: 'Stage 1: Preliminary Stage',
        cost: 'Free of charge',
        details: [
          'Conducted online.',
          'Submit abstract via IMD ITB 2026 website.',
          'Abstract deadline: 15 August 2026.',
          'Template available at bit.ly/AbstrakSPCIMD.',
          'File name: Abstrak_NamaTim_ScientificProjectCompetition.pdf',
        ],
        requirements: [
          'Social Media Requirements:',
          '  • Follow @archaea_itb and @imd.itb',
          '  • Upload official competition twibbon on Instagram (public account), tag @imd.itb, mention at least 3 friends',
          '  • Repost IMD 2026 SPC Instagram post on personal Instagram Story',
          '  • Share IMD 2026 SPC Instagram post to 3 WhatsApp groups',
          'Required Upload Documents (PDF) via bit.ly/BuktiSPCIMD:',
          '  • Student ID for each group member',
          '  • Identity of supervising teacher',
          '  • Screenshot proof of following @imd.itb and @archaea_itb',
          '  • Screenshot proof of uploading the twibbon',
          '  • Screenshot proof of sharing to Instagram Story and 3 WhatsApp groups',
          'Abstract Writing:',
          '  • Brief summary describing overall concept',
          '  • Written entirely in Indonesian',
          '  • Maximum length: 1 page',
          '  • Word count: 250-300 words',
          '  • Components: Title, Problem Background, Proposed Idea/Solution, Benefits and Potential Application, Concept and Brief Prototype Overview',
          '  • Formatting: A4 paper; margins: left 4cm, top 4cm, right 3cm, bottom 3cm; Times New Roman, 12pt; spacing 1.15; justified',
          '  • Title: Times New Roman, 14pt, bold, centered',
          '  • Below title: Team leader and members\' names, educational institution, team leader\'s email',
          '  • Keywords: 3-5 words',
          'Originality: No plagiarism; AI allowed only as supporting tool; project titles that have won other competitions are prohibited.',
        ],
      },
      {
        name: 'Stage 2: Semi-Finals',
        cost: 'Not specified in guidebook',
        details: [
          'Full Paper submission required.',
          'Elevator Pitch Video: Maximum 2.5 minutes, uploaded to Instagram (public), tag @imd.itb.',
        ],
        requirements: [
          'Full Paper Structure:',
          '  1. Title',
          '  2. Statement sheet of originality and confirmation it has never been entered into other competitions',
          '  3. Abstract',
          '  4. Table of Contents',
          '  5. Chapter 1: Introduction',
          '  6. Chapter 2: Basic Theory',
          '  7. Chapter 3: Methodology',
          '  8. Chapter 4: Results and Discussion (including future trends of the prototype)',
          '  9. Chapter 5: Conclusion and Suggestions',
          '  10. References',
          '  11. Appendices (Plagiarism/Turnitin check results, maximum 20% limit)',
        ],
        assessmentCriteria: [
          { criteria: 'Introduction & Basic Theory', weight: '20%', focus: 'Alignment with theme; clarity of problem identification; urgency; supported by valid data, facts, literature.' },
          { criteria: 'Methodology', weight: '20%', focus: 'Clarity of workflow; accuracy in selecting materials, instruments, methods.' },
          { criteria: 'Results and Discussion', weight: '35%', focus: 'Quality of data presentation (tables, graphs); depth of analysis; alignment with theory; evaluation of constraints; explanation of working mechanism.' },
          { criteria: 'Conclusion and Suggestions', weight: '15%', focus: 'Accuracy of conclusions; quality of realistic suggestions for development.' },
          { criteria: 'Writing Format', weight: '10%', focus: 'Compliance with guidelines; proper Indonesian; neat layout; consistent numbering; correct citations.' },
        ],
      },
      {
        name: 'Stage 3: Final Stage',
        cost: 'Not specified',
        details: [
          'Conducted offline at ITB Ganesha.',
          'All accommodation expenses (lodging and transportation) are NOT covered by the committee.',
        ],
        requirements: [
          'Create a prototype based on the submitted proposal.',
          'Meet the prototype limitations set by the committee.',
          'Create an infographic summarizing research results.',
          'Create a logbook documenting prototype progress and documentation (must include participant\'s face).',
          'Conduct a final pitch at ITB Ganesha.',
        ],
        assessmentCriteria: [
          { criteria: 'Poster and Prototype - Presentation', weight: '40%', focus: 'Ability to deliver core project clearly; visual quality of poster; solid teamwork.' },
          { criteria: 'Poster and Prototype - Prototype', weight: '40%', focus: 'Readiness, functionality, and performance; alignment with designs/theoretical claims; physical aesthetic neatness.' },
          { criteria: 'Poster and Prototype - Exhibition', weight: '20%', focus: 'Creativity of booth; active engagement with visitors; availability of interactive supporting media (brochures, videos, samples).' },
          { criteria: 'Final Pitch - Presentation', weight: '50%', focus: 'Sequential, logical flow; time management; completeness of crucial points; quality of presentation slides with data visualizations.' },
          { criteria: 'Final Pitch - Q&A', weight: '50%', focus: 'Depth of understanding; accuracy and effectiveness in answering; professional attitude and ability to defend arguments.' },
        ],
      },
    ],
    awards: [
      { prize: 'Winner 1', reward: 'Cash Prize + Certificate + Plakat' },
      { prize: 'Winner 2', reward: 'Cash Prize + Certificate + Plakat' },
      { prize: 'Winner 3', reward: 'Cash Prize + Certificate + Plakat' },
    ],
    rules: [
      'Team composition: 3 students + 1 supervising teacher from the same school.',
      'One member must be designated as team leader.',
      'Each school may submit more than one team.',
      'Each participant can only be registered under one project title.',
      'Submissions must not contain SARA (ethnicity, religion, race, intergroup), pornography, or any material violating Indonesian law.',
      'Any participant caught cheating or engaging in dishonest behavior will face immediate disqualification.',
      'Maximum Turnitin similarity: 20%.',
      'Prototype development required for finalists.',
    ],
  },
  {
    id: 'nec',
    shortName: 'NEC',
    title: 'National Essay Competition (NEC)',
    guidebookUrl: 'https://drive.google.com/file/d/1uZJqzA7bixVR7As8t2X6rrbgyvau5-cs/preview',
    category: 'S1/Diploma Universitas',
    icon: '📝',
    glowColor: 'green',
    description: 'Platform for university students to develop critical thinking and scientific writing on global microbiology issues.',
    fullDescription: 'Showcase your critical thinking and scientific writing skills. Propose innovative microbiological solutions to global sustainability challenges. Open to all S1 and Diploma students from any major.',
    format: 'Abstract -> Full paper -> Pitch deck presentation & Exhibition',
    teamSize: '2-3 students per team',
    eligibility: 'Active S1/Diploma university students (all majors)',
    organizer: 'School of Life Sciences and Technology - Science Program (SITH-S), Institut Teknologi Bandung (ITB)',
    scale: 'National',
    requirements: [
      'Active S1/Diploma student from any major',
      'Team of 2-3 members from the same university',
      'KTM (Kartu Tanda Mahasiswa) for each participant',
      'No payment required for preliminary stage (free)',
      'Share to 3 groups proof',
      'Twibbon proof upload',
      'Share SG (Student Gathering) proof',
    ],
    benefits: [
      { icon: '💵', title: 'Total Prize', value: 'Rp 18.000.000+' },
      { icon: '📜', title: 'Certificates', value: 'E-Certificate + Trophy' },
      { icon: '📰', title: 'Publication', value: 'Opportunity for journal publication' },
      { icon: '🎓', title: 'Research Network', value: 'Connect with academics' },
    ],
    whyJoin: [
      {
        icon: '🌐',
        title: 'Interdisciplinary Approach',
        desc: 'Open to all S1 students from any major - science, engineering, social sciences, or humanities. Your unique perspective matters!',
      },
      {
        icon: '🧠',
        title: 'Critical Thinking Development',
        desc: 'Hone your ability to analyze complex global issues and propose evidence-based microbiological solutions.',
      },
      {
        icon: '✍️',
        title: 'Scientific Writing Excellence',
        desc: 'Master the art of scientific communication and learn to present complex ideas clearly and persuasively.',
      },
      {
        icon: '🏛️',
        title: 'Policy Impact',
        desc: 'Your essay could influence real policy recommendations and contribute to Indonesia\'s sustainable development goals.',
      },
    ],
    timeline: [
      { phase: 'Preliminary Stage: Registration & Abstract Submission', date: '19 July - 15 August 2026', desc: 'Abstract submission & registration', platform: 'IMD Official Website' },
      { phase: 'Semifinalist Announcement', date: '1 September 2026', desc: 'Stage 1 results', platform: 'IMD Official Website' },
      { phase: 'Semifinal Stage: Re-registration', date: '2-7 September 2026', desc: 'Confirm semi-final participation', platform: 'IMD Official Website' },
      { phase: 'Paper Coaching Session', date: 'September 2026', desc: 'Online coaching for semifinalists', platform: 'Zoom Meeting' },
      { phase: 'Full Paper Submission', date: '2-30 September 2026', desc: 'Submit full paper', platform: 'IMD Official Website' },
      { phase: 'Finalist Announcement', date: '11 October 2026', desc: 'Top 10 teams announced', platform: 'IMD Official Website' },
      { phase: 'Pitch Deck & Poster Submission', date: '12-31 October 2026', desc: 'Submit presentation materials', platform: 'IMD Official Website' },
      { phase: 'Technical Meeting', date: '7 November 2026', desc: 'Technical briefing', platform: 'Zoom Meeting' },
      { phase: 'Pitching Day', date: '14 November 2026', desc: 'Oral presentations', platform: 'Offline at ITB Ganesha' },
      { phase: 'Poster Exhibition & Awarding Ceremony', date: '15 November 2026', desc: 'Exhibition & awards', platform: 'Offline at ITB Ganesha' },
    ],
    faq: [
      { q: 'What is the word limit?', a: 'Full paper: maximum 10 pages, excluding cover and appendices.' },
      { q: 'Can I submit in Indonesian?', a: 'Yes, essays must be written in Indonesian.' },
      { q: 'Is there a registration fee?', a: 'Preliminary stage is free. Semi-final stage fee: Rp150,000 (includes paper coaching).' },
    ],
    vision: 'To become a leading national platform that empowers young innovators to harness microbial science and biotechnology in creating impactful solutions for a sustainable future.',
    mission: [
      'Encourage innovation through microbial science and biotechnology.',
      'Promote interdisciplinary collaboration for sustainable solutions.',
      'Drive impactful innovations for environmental and public health challenges.',
    ],
    subthemes: [
      {
        name: 'Next-Generation Biofuels and Sustainable Energy Systems through Applied Synthetic Biology',
        focus: 'Application of synthetic biology and microbial engineering for next-generation biofuels and sustainable energy systems.',
        topics: [
          'Bioethanol, biodiesel, biogas, biohydrogen, sustainable aviation fuels from biomass, organic waste, renewable resources',
          'Metabolic pathway engineering',
          'Fermentation optimization',
          'Integration of AI and Industry 4.0',
          'Waste-to-energy systems',
          'Low-carbon economy transition',
        ],
        keywords: ['Biofuels', 'Synthetic biology', 'Sustainable energy', 'Metabolic engineering', 'Waste-to-energy', 'Low-carbon economy'],
      },
      {
        name: 'Microbial Technologies for Green Mining and Resource Recovery',
        focus: 'Utilizing microorganisms for sustainable and environmentally responsible mining.',
        topics: [
          'Bioleaching, biomining, microbial enhanced oil recovery (MEOR)',
          'Biocorrosion control',
          'Acid mine drainage treatment',
          'Critical metal recovery',
          'Mining site reclamation',
          'Digital technologies, sensors, data-driven systems for improved efficiency and reduced environmental impact',
        ],
        keywords: ['Bioleaching', 'Biomining', 'Green mining', 'Resource recovery', 'MEOR', 'Bioremediation'],
      },
      {
        name: 'Microbial Innovation for Drug Discovery and Untreated Diseases',
        focus: 'Utilizing microorganisms and their derivatives for novel drug candidates and solutions for diseases lacking effective treatment.',
        topics: [
          'Antibiotic discovery, bioactive metabolites, microbiome-based therapies',
          'Bacteriophages, biosynthesis of therapeutic compounds, diagnostics',
          'Strategies for chronic diseases, drug-resistant infections, neglected tropical diseases',
          'Biotechnology, public health, treatment accessibility, community-based approaches',
        ],
        keywords: ['Drug discovery', 'Antibiotic resistance', 'Bacteriophages', 'Microbiome therapy', 'Bioactive metabolites', 'Neglected diseases'],
      },
    ],
    competitionStages: [
      {
        name: 'Preliminary Stage',
        cost: 'Free of charge',
        details: [
          'Conducted online.',
          'Registration document submission via provided template link.',
          'Abstract submission via official IMD 2026 website.',
          'Verify documents and wait for announcement on official IMD website.',
        ],
        requirements: [
          'Social Media Requirements:',
          '  • Follow @imd.itb and @archaea_itb',
          '  • Upload official NEC IMD 2026 twibbon on Instagram, tag @imd.itb, mention at least 3 friends',
          '  • Share official NEC IMD 2026 promotional post on Instagram Story',
          '  • Share promotional post to 3 WhatsApp group chats',
          'Registration Documents (template available at provided link):',
          '  a. Student ID Card (KTM) of all team members',
          '  b. Proof of following @imd.itb and @archaea_itb',
          '  c. Screenshot of uploaded competition twibbon',
          '  d. Proof of sharing promotional post on Instagram Story',
          '  e. Proof of sharing promotional post to 3 WhatsApp groups',
          'File Naming: DokumenRegistrasi_TeamName_NEC (If team name >3 words, use only first 3 words. E.g., DokumenRegistrasi_PastiJuarasaSatu_NEC)',
          'Abstract Submission:',
          '  • Written entirely in Indonesian',
          '  • Maximum length: 1 page',
          '  • Word count: 250-300 words',
          '  • Structure: Problem statement and proposed idea; Description of proposed idea; Conclusion',
          '  • Formatting: A4 paper; margins: left 4cm, top 3cm, bottom 3cm, right 3cm; Times New Roman, 12pt; line spacing 1.0; justified',
          '  • Title: Maximum 20 words, Times New Roman 14pt, bold, centered',
          '  • Below title: Full names of all team members; Team name; Team leader\'s email',
          '  • Keywords: 3-5 words, alphabetical order (A-Z)',
          '  • File format: PDF; file name: Abstrak_TeamName_NEC.pdf',
          'Originality: Must be original, plagiarism-free; not submitted to other competitions; AI only as supporting tool.',
        ],
      },
      {
        name: 'Semi-Final Stage',
        cost: 'Rp150,000 (includes paper coaching facility)',
        details: [
          'Conducted online.',
          'Each team submits a Full Paper written in Indonesian.',
          'Maximum 10 pages (excluding cover and appendices).',
        ],
        requirements: [
          'Full Paper Structure:',
          '  • Cover: Title (max 20 words), NEC IMD 2026 logo, team member names',
          '  • Introduction: Background overview explaining problem urgency',
          '  • Content: Main ideas, detailed arguments, relevant data, in-depth analysis',
          '  • Conclusion: Summary of arguments clearly answering the main objective',
          '  • Bibliography: Harvard Style formatting',
          '  • Appendices:',
          '    - Appendix A: Statement of Originality',
          '    - Appendix B: Biodata of team members and supervising lecturer',
          '    - Appendix C: Turnitin similarity check screenshot',
          '    - Appendix D: Supporting documentation, data, tables, or relevant materials',
        ],
        assessmentCriteria: [
          { criteria: 'Idea and Innovation', weight: '25%', focus: 'Authenticity and novelty; creativity; unique solution-oriented ideas.' },
          { criteria: 'Analysis and Argumentation', weight: '30%', focus: 'Depth of analysis; logic and coherence; relevance, applicability, feasibility of solution.' },
          { criteria: 'Relevance and Contextualization', weight: '20%', focus: 'Consistency with grand theme and sub-theme; actuality and urgency of the issue.' },
          { criteria: 'Systematics and Structure', weight: '10%', focus: 'Logical flow; appropriateness of title in representing content.' },
          { criteria: 'Format and Grammar', weight: '10%', focus: 'Compliance with technical writing guidelines; use of standard academic language.' },
          { criteria: 'Data Quality and References', weight: '5%', focus: 'Validity of data; credibility and reliability of references.' },
        ],
      },
      {
        name: 'Final Stage',
        cost: 'Not specified',
        details: [
          'Top 10 teams advance to the Final Stage.',
          'Conducted offline at ITB Ganesha.',
          'All accommodation expenses (lodging and transportation) are NOT covered by the committee.',
        ],
        requirements: [
          'Submit pitch deck/PPT and digital poster design prior to the event.',
          'Teams are responsible for printing and bringing their own physical posters.',
          'Committee provides booth setup and standing panels.',
          'All participants must wear formal attire with their respective university\'s almamater jacket during the event.',
          'Pitching Day (14 November 2026): Systematically structured oral presentation followed by comprehensive Q&A session with judges.',
          'Exhibition (15 November 2026): Posters displayed at dedicated booths. Interactive public voting mechanism – visitors vote for the most outstanding and favorite booth.',
        ],
        assessmentCriteria: [
          { criteria: 'Presentation - Content Delivery', weight: '25%', focus: 'Clear presentation of material; ability to convey ideas, problem, data, conclusions.' },
          { criteria: 'Presentation - Systematics', weight: '15%', focus: 'Systematic and well-organized delivery; time management.' },
          { criteria: 'Presentation - Visual Aids & Media', weight: '40%', focus: 'Supporting presentation media (slides) that enhance understanding.' },
          { criteria: 'Presentation - Argumentation', weight: '25%', focus: 'Strength and logic of arguments; reinforced by factual evidence and data.' },
          { criteria: 'Q&A Performance', weight: '20%', focus: 'Fluency, confidence, accuracy, relevance of responses to judges\' questions.' },
          { criteria: 'Poster - Visual Design and Aesthetics', weight: '35%', focus: 'Readability (font size, contrast); composition and layout; design creativity.' },
          { criteria: 'Poster - Content Quality and Message Relevance', weight: '35%', focus: 'Essay essence summarized effectively; theme relevance; informational strength (factual, accurate, understandable).' },
          { criteria: 'Poster - Audience Engagement and Public Appreciation', weight: '30%', focus: 'Number of Instagram likes; audience interaction; direct booth appreciation/voting.' },
        ],
      },
    ],
    awards: [
      { prize: 'Winner 1', reward: 'Cash Prize + Certificate + Plakat' },
      { prize: 'Winner 2', reward: 'Cash Prize + Certificate + Plakat' },
      { prize: 'Winner 3', reward: 'Cash Prize + Certificate + Plakat' },
      { prize: 'Best Poster', reward: 'Cash Prize + Certificate + Plakat' },
    ],
    rules: [
      'Team composition: 2-3 students per team. One member must be designated as team leader.',
      'All team members must be enrolled at the same university but may come from different majors/faculties.',
      'Each team is allowed to submit only one essay.',
      'Submissions must not contain SARA (ethnicity, religion, race, intergroup), pornography, or any material violating Indonesian law.',
      'Any participant caught cheating or engaging in dishonest behavior will face immediate disqualification.',
      'All submitted manuscripts become the property of the organizing committee and will be utilized exclusively for competition purposes.',
      'Maximum Turnitin similarity: 20%.',
      'All judging results are final and binding.',
    ],
  },
];

export const GRAND_THEME = {
  title: 'The Great Microbial Odyssey: Decoding the Earth\'s Dark Matter to Orchestrate a Sustainable Future',
  description: 'International Microorganism Day (IMD) 2026',
};

export const PAYMENT_INFO = {
  bank: 'Bank Jago',
  accountNumber: '104614051845',
  accountHolder: 'Aditya Ramadhani',
  notes: 'All bank transfer fees and currency exchange rates must be borne by participants.',
  procedures: [
    'Transfer fees to official IMD accounts based on participant category.',
    'Submit payment receipt via official IMD portal.',
    'Receipt/screenshot must clearly display payer\'s name, exact transfer amount, and transaction date.',
    'Committee reviews form completeness, document authenticity, and payment validity (1-3 business days).',
    'Email confirmation sent upon successful approval.',
  ],
  terms: [
    'Incomplete or incorrect submissions will require document revisions.',
    'Transactions without uploaded proof of payment will not be processed.',
    'Registration fees are strictly non-refundable unless a special exception is granted by the Organizing Committee.',
    'All registrations must be completed exclusively through the official website following provided guidelines.',
    'Participants hold full responsibility for the accuracy and correctness of all submitted data.',
  ],
};

export const SOCIAL_MEDIA = {
  instagram: {
    main: '@imd.itb',
    archaea: '@archaea_itb',
  },
  contactPersons: [
    { name: 'Internal Affairs Manager', contact: 'Sitha (sisithaaa)' },
    { name: 'Internal Affairs Staff', contact: 'Cahya (cahyaarunii)' },
  ],
};