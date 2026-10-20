/**
 * Learning contexts: conditions that shape what students actually learned, beyond what the
 * official curriculum says. Indicators come from the ALA research team's observations
 * (shared October 2026) and, where available, documented sources.
 */

export interface Indicator {
  id: string;
  title: string;
  detail: string;
  forTeachers: string;
  source: 'research' | 'documented';
  link?: { title: string; url: string };
}

/** Indicators that apply to students from every country. */
export const ALL_COUNTRY_INDICATORS: Indicator[] = [
  {
    id: 'vocabulary', title: 'Subject vocabulary and command words',
    detail: 'Most students learn English but not the precise language of each subject, or what command words such as "state", "explain", "critically analyse" and "evaluate" ask them to do.',
    forTeachers: 'Teach command words and key terms explicitly in every subject, using the subject vocabulary sheets.', source: 'research',
  },
  {
    id: 'learning-to-learn', title: 'Learning how to learn',
    detail: 'Teaching at ALA is very different from what most students knew before. Students must handle large volumes of content, make it their own, analyse it and apply it.',
    forTeachers: 'Make study skills a priority in the first term: note-making in their own words, planning time, and moving from memorising to analysing and applying.', source: 'research',
  },
  {
    id: 'home-language', title: 'Do not assume the language from the label',
    detail: 'A student from a "Francophone", "Lusophone" or "Anglophone" country may have learned mainly in a home language, such as Shona or isiZulu, and may not be fully comfortable in French, Portuguese or English.',
    forTeachers: 'Ask each student which languages they learned in and are most comfortable with. Do not rely on French or Portuguese subtitles or translations to help.', source: 'research',
  },
  {
    id: 'remote', title: 'Remote and rural schools',
    detail: 'Students from remote areas usually had much less access to laboratories and computers than the curriculum assumes, because of funding.',
    forTeachers: 'Check practical and computer experience individually in the first weeks rather than assuming it from the country.', source: 'research',
  },
  {
    id: 'belief', title: 'Religion and beliefs',
    detail: 'Religious and cultural values shape schooling in many countries. In Mauritania, an Islamic republic, Islamic education is a core part of schooling.',
    forTeachers: 'Be aware that some topics, texts and ways of discussing them may be new or sensitive for some students; set clear, respectful norms for discussion.', source: 'research',
  },
];

/** Indicators for conflict-affected and fragile contexts. */
export const CONFLICT_INDICATORS: Indicator[] = [
  {
    id: 'mcq', title: 'Multiple-choice exam backgrounds',
    detail: 'Many students sat mostly objective, multiple-choice exams (choose A, B, C or D). Essay-based assessment is often new to them at ALA.',
    forTeachers: 'Teach essay structure from the start: paragraphs, building an argument, and what each command word asks for.', source: 'research',
  },
  {
    id: 'labs', title: 'Little or no laboratory and computer access',
    detail: 'Governments in conflict-affected areas often cannot equip schools, so Chemistry, Biology, Physics and Computer Science may have been taught with little or no practical work.',
    forTeachers: 'Run guided introductions to laboratory equipment and computers before any assessed practical work.', source: 'research',
  },
  {
    id: 'gap', title: 'Curriculum on paper is not what was taught',
    detail: 'What the curriculum says, for example that students do experiments, may not happen in practice because of displacement, funding and teacher shortages.',
    forTeachers: 'Use a short diagnostic in each subject instead of assuming coverage from the syllabus.', source: 'research',
  },
  {
    id: 'asylum', title: 'Schooled in a country of asylum',
    detail: 'Many refugee students are taught in the national system of the country where they found refuge. UNHCR\'s Refugee Education 2030 strategy promotes including refugees in host-country national education systems.',
    forTeachers: 'Ask where the student actually studied. In the student profile tool, choose that country under "Studied in" to read them through its system.', source: 'documented',
    link: { title: 'Refugee Education 2030: A Strategy for Refugee Inclusion (UNHCR, via INEE)', url: 'https://inee.org/resources/refugee-education-2030-strategy-refugee-inclusion' },
  },
  {
    id: 'mixed', title: 'Mixed teaching and assessment styles',
    detail: 'Where schools depend on rotating volunteer teachers, students may have met several models, for example British-style assessment one year and French Baccalauréat-style the next.',
    forTeachers: 'Explain Cambridge expectations explicitly; do not assume a single prior model.', source: 'research',
  },
  {
    id: 'wellbeing', title: 'Displacement, violence and wellbeing',
    detail: 'UN reporting documents the recruitment and use of children, mostly boys, by armed groups in several of these countries. Some students may have experienced displacement, violence or loss.',
    forTeachers: 'Plan trauma-aware, wellbeing-centred support with pastoral care. Keep expectations high: students who reach ALA from these contexts are high achievers.', source: 'documented',
    link: { title: 'UN Office of the Special Representative for Children and Armed Conflict', url: 'https://childrenandarmedconflict.un.org/' },
  },
  {
    id: 'digital', title: 'Limited digital access',
    detail: 'Access to computers and the internet is very limited in some of these countries. In Eritrea, about one in five people used the internet at the end of 2025.',
    forTeachers: 'Teach basic computer, keyboard and online research skills early; do not assume familiarity with learning platforms.', source: 'documented',
    link: { title: 'Digital 2026: Eritrea (DataReportal)', url: 'https://datareportal.com/reports/digital-2026-eritrea' },
  },
];

/** Countries treated as conflict-affected or fragile contexts (from the research team's list). */
export const CONFLICT_COUNTRIES: { id: string; area?: string; note: string }[] = [
  { id: 'somalia', note: 'Decades of conflict; schooling varies greatly by region, with Somaliland and Puntland running separate systems.' },
  { id: 'eritrea', note: 'Very limited computer and internet access; the final year of secondary school is completed alongside national service at Sawa.' },
  { id: 'sudan', note: 'Schools across the country have been closed or disrupted since war began in April 2023; many students are displaced or refugees.' },
  { id: 'south-sudan', note: 'Conflict and displacement have interrupted schooling; many students study in Uganda or Kenya.' },
  { id: 'chad', note: 'Insecurity and the arrival of large numbers of Sudanese refugees in the east strain schools and resources.' },
  { id: 'dr-congo', area: 'eastern DRC (for example Goma, North and South Kivu)', note: 'Ongoing conflict in the east means what the curriculum states does not necessarily translate into what students are taught, with heavy limits on resources.' },
];

export const conflictFor = (countryId: string) => CONFLICT_COUNTRIES.find((c) => c.id === countryId);
