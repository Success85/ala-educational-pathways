/**
 * Education system profiles for all 54 African countries.
 * Compiled from national examination bodies, ministries and international education-system
 * profiles (see each country's sources and the About page). Systems change: check the
 * examination body for the latest rules.
 */
import type { Dim } from '@/lib/dims';

export type RegionId = 'west' | 'east' | 'southern' | 'central' | 'north';

export interface Country {
  id: string;
  name: string;
  region: RegionId;
  tradition: string;
  /** Language of instruction in secondary school. */
  instruction: string;
  otherLanguages?: string;
  structure: string;
  stages: { name: string; exam?: string }[];
  qualification: string;
  examBody: { name: string; url?: string };
  grading: string;
  entry: { early: string; late: string };
  notes: string[];
  modifiers?: { dims: Partial<Record<Dim, number>>; subjects?: string[]; reason: string }[];
  /** Upper secondary includes A Level or AS Level study, so late entrants have met advanced content. */
  advancedLevel?: boolean;
  sources?: { title: string; url: string }[];
}

const STEM = ['mathematics', 'biology', 'chemistry', 'physics', 'computer-science'];

const FRANCO_STAGES = (lower = 'BEPC', upper = 'Baccalauréat') => [
  { name: 'Primary (6 years)', exam: 'CEP / CEPE' },
  { name: 'Lower secondary, collège (4 years, 6e–3e)', exam: lower },
  { name: 'Upper secondary, lycée (3 years, Seconde–Terminale)', exam: upper },
];
const FRANCO_ENTRY = { early: 'After Seconde (Grade 10) or Première', late: 'After Terminale (Baccalauréat)' };
const WAEC = { name: 'West African Examinations Council (WAEC)', url: 'https://www.waecheadquartersgh.org' };
const WAEC_SOURCE = { title: 'West African Senior School Certificate Examination (overview)', url: 'https://en.wikipedia.org/wiki/West_African_Senior_School_Certificate_Examination' };

export const COUNTRIES: Country[] = [
  /* ---------------- West Africa ---------------- */
  {
    id: 'benin', name: 'Benin', region: 'west', tradition: 'franco', instruction: 'French', otherLanguages: 'Fon, Yoruba and other national languages',
    structure: '6-4-3', stages: FRANCO_STAGES(), qualification: 'Baccalauréat', examBody: { name: 'Office du Baccalauréat / Direction des Examens et Concours' },
    grading: 'fr-20', entry: FRANCO_ENTRY,
    notes: ['English is taught as a foreign language from the start of secondary school.'],
  },
  {
    id: 'burkina-faso', name: 'Burkina Faso', region: 'west', tradition: 'franco', instruction: 'French', otherLanguages: 'Mooré, Dioula, Fulfulde and other national languages',
    structure: '6-4-3', stages: FRANCO_STAGES(), qualification: 'Baccalauréat', examBody: { name: 'Office du Baccalauréat (Université Joseph Ki-Zerbo)' },
    grading: 'fr-20', entry: { early: 'After Grade 10 equivalent', late: 'After Baccalauréat completion' },
    notes: [
      'The ALA research team has completed Business Studies and Language Transition sheets for Burkina Faso, and compared it with Tunisia in eight subjects.',
      'Research finding: language transition, not academic ability, is the single biggest barrier for Burkina Faso students at ALA.',
      'Insecurity has closed many schools in the north and east of the country since 2019.',
    ],
  },
  {
    id: 'cabo-verde', name: 'Cabo Verde', region: 'west', tradition: 'luso', instruction: 'Portuguese', otherLanguages: 'Cabo Verdean Creole',
    structure: '8-4 (basic education to 8th grade, secondary to 12th)', stages: [{ name: 'Basic education (8 years)' }, { name: 'Secondary education (9.º–12.º ano)', exam: 'Secondary completion (12.º ano)' }],
    qualification: 'Secondary school certificate (12.º ano)', examBody: { name: 'Ministry of Education' }, grading: 'pt-20',
    entry: { early: 'After 10.º ano', late: 'After 12.º ano' },
    notes: ['Included in the ALA research team\'s Lusophone comparison with Angola and Mozambique.'],
  },
  {
    id: 'cote-d-ivoire', name: 'Côte d\'Ivoire', region: 'west', tradition: 'franco', instruction: 'French',
    structure: '6-4-3', stages: FRANCO_STAGES(), qualification: 'Baccalauréat', examBody: { name: 'Direction des Examens et Concours (DECO)' },
    grading: 'fr-20', entry: FRANCO_ENTRY, notes: ['Scientific series (C and D) give the strongest preparation for Cambridge sciences.'],
  },
  {
    id: 'the-gambia', name: 'The Gambia', region: 'west', tradition: 'anglo-west', instruction: 'English',
    structure: '6-3-3', stages: [{ name: 'Lower basic (Grades 1–6)' }, { name: 'Upper basic (Grades 7–9)', exam: 'GABECE' }, { name: 'Senior secondary (Grades 10–12)', exam: 'WASSCE' }],
    qualification: 'WASSCE', examBody: WAEC, grading: 'wassce', entry: { early: 'After Grade 10 or 11', late: 'After Grade 12 (WASSCE)' },
    notes: [], sources: [WAEC_SOURCE],
  },
  {
    id: 'ghana', name: 'Ghana', region: 'west', tradition: 'anglo-west', instruction: 'English',
    structure: '6-3-3', stages: [{ name: 'Primary (6 years)' }, { name: 'Junior High School (3 years)', exam: 'BECE' }, { name: 'Senior High School (3 years)', exam: 'WASSCE' }],
    qualification: 'WASSCE', examBody: WAEC, grading: 'wassce', entry: { early: 'After SHS 1 or SHS 2', late: 'After SHS 3 (WASSCE)' },
    notes: [
      'A new Senior High School curriculum was rolled out from the 2024/25 academic year, with flexible pathways and a shift from exam-only assessment towards critical thinking and problem solving.',
      'Free Senior High School has expanded access since 2017.',
    ],
    sources: [WAEC_SOURCE, { title: 'Ghana ready to roll out new SHS curriculum (GNA, Nov 2024)', url: 'https://gna.org.gh/2024/11/ghana-ready-to-roll-out-new-shs-curriculum/' }],
  },
  {
    id: 'guinea', name: 'Guinea', region: 'west', tradition: 'franco', instruction: 'French',
    structure: '6-4-3', stages: FRANCO_STAGES('BEPC', 'Baccalauréat unique'), qualification: 'Baccalauréat unique', examBody: { name: 'Ministry of Pre-University Education' },
    grading: 'fr-20', entry: FRANCO_ENTRY, notes: [],
  },
  {
    id: 'guinea-bissau', name: 'Guinea-Bissau', region: 'west', tradition: 'luso', instruction: 'Portuguese', otherLanguages: 'Guinea-Bissau Creole',
    structure: '6-3-3', stages: [{ name: 'Basic education' }, { name: 'Secondary education to 12th grade' }],
    qualification: 'Secondary completion (12.º ano)', examBody: { name: 'Ministry of Education' }, grading: 'pt-20',
    entry: { early: 'After 10th grade', late: 'After 12th grade' },
    notes: ['Many pupils speak Creole at home and learn in Portuguese, so English is a third or fourth language.'],
    modifiers: [{ dims: { english: -1 }, reason: 'English is often a third or fourth language' }],
  },
  {
    id: 'liberia', name: 'Liberia', region: 'west', tradition: 'anglo-west', instruction: 'English',
    structure: '6-3-3', stages: [{ name: 'Primary (Grades 1–6)' }, { name: 'Junior high (Grades 7–9)', exam: 'WAEC junior high exam' }, { name: 'Senior high (Grades 10–12)', exam: 'WASSCE' }],
    qualification: 'WASSCE', examBody: WAEC, grading: 'wassce', entry: { early: 'After Grade 10 or 11', late: 'After Grade 12 (WASSCE)' },
    notes: ['Schooling was interrupted by civil war and by the 2014–15 Ebola outbreak; preparation varies widely between schools.'],
    sources: [WAEC_SOURCE],
  },
  {
    id: 'mali', name: 'Mali', region: 'west', tradition: 'franco', instruction: 'French', otherLanguages: 'Bambara and other national languages',
    structure: '9-3', stages: [{ name: 'Basic education, enseignement fondamental (9 years)', exam: 'DEF' }, { name: 'Secondary, lycée (3 years)', exam: 'Baccalauréat' }],
    qualification: 'Baccalauréat', examBody: { name: 'Centre National des Examens et Concours de l\'Éducation' }, grading: 'fr-20', entry: FRANCO_ENTRY,
    notes: ['Insecurity has closed many schools in the north and centre of the country.'],
  },
  {
    id: 'niger', name: 'Niger', region: 'west', tradition: 'franco', instruction: 'French', otherLanguages: 'Hausa, Zarma and other national languages',
    structure: '6-4-3', stages: FRANCO_STAGES(), qualification: 'Baccalauréat', examBody: { name: 'Office du Baccalauréat (Université Abdou Moumouni)' },
    grading: 'fr-20', entry: FRANCO_ENTRY, notes: ['Secondary enrolment is low and insecurity affects schooling in several regions.'],
  },
  {
    id: 'nigeria', name: 'Nigeria', region: 'west', tradition: 'anglo-west', instruction: 'English',
    structure: '6-3-3-4', stages: [{ name: 'Primary (6 years)' }, { name: 'Junior Secondary School (JSS 1–3)', exam: 'BECE' }, { name: 'Senior Secondary School (SS 1–3)', exam: 'WASSCE (WAEC) or SSCE (NECO)' }],
    qualification: 'WASSCE or NECO SSCE', examBody: { name: 'WAEC and the National Examinations Council (NECO)', url: 'https://www.waecnigeria.org' }, grading: 'wassce',
    entry: { early: 'After SS 1 or SS 2', late: 'After SS 3 (WASSCE / NECO)' },
    notes: [
      'In 2025 the federal government consulted on a 12-year basic education model that would keep the 6-3-3-4 structure but remove the exam between junior and senior secondary. Check the current status before relying on it.',
      'Laboratory access varies widely between federal, state and private schools.',
    ],
    sources: [WAEC_SOURCE, { title: 'FG to decide on proposed 12-year basic education (TheCable, Feb 2025)', url: 'https://thecable.ng/fg-to-decide-on-proposed-adoption-of-12-year-basic-education-in-oct-2025' }],
  },
  {
    id: 'senegal', name: 'Senegal', region: 'west', tradition: 'franco', instruction: 'French', otherLanguages: 'Wolof and other national languages',
    structure: '6-4-3', stages: FRANCO_STAGES('BFEM', 'Baccalauréat'), qualification: 'Baccalauréat', examBody: { name: 'Office du Baccalauréat (UCAD)', url: 'https://officedubac.sn' },
    grading: 'fr-20', entry: FRANCO_ENTRY, notes: ['Lower secondary ends with the BFEM (Brevet de Fin d\'Études Moyennes).'],
  },
  {
    id: 'sierra-leone', name: 'Sierra Leone', region: 'west', tradition: 'anglo-west', instruction: 'English',
    structure: '6-3-3-4', stages: [{ name: 'Primary (6 years)', exam: 'NPSE' }, { name: 'Junior Secondary (3 years)', exam: 'BECE' }, { name: 'Senior Secondary (3 years)', exam: 'WASSCE' }],
    qualification: 'WASSCE', examBody: WAEC, grading: 'wassce', entry: { early: 'After SSS 1 or SSS 2', late: 'After SSS 3 (WASSCE)' },
    notes: ['The Free Quality School Education programme (from 2018) has expanded access.', 'Schooling was disrupted by the 2014–15 Ebola outbreak.'],
    sources: [WAEC_SOURCE],
  },
  {
    id: 'togo', name: 'Togo', region: 'west', tradition: 'franco', instruction: 'French', otherLanguages: 'Ewe, Kabiyé',
    structure: '6-4-3', stages: [{ name: 'Primary (6 years)', exam: 'CEPD' }, { name: 'Lower secondary (4 years)', exam: 'BEPC' }, { name: 'Upper secondary (3 years)', exam: 'BAC I (end of Première) and BAC II (end of Terminale)' }],
    qualification: 'Baccalauréat II', examBody: { name: 'Direction des Examens et Concours' }, grading: 'fr-20',
    entry: { early: 'After Seconde, or after BAC I (Première)', late: 'After BAC II (Terminale)' },
    notes: ['Togo examines the Baccalauréat in two parts: BAC I at the end of Première and BAC II at the end of Terminale.'],
  },

  /* ---------------- East Africa and the Horn ---------------- */
  {
    id: 'comoros', name: 'Comoros', region: 'east', tradition: 'franco', instruction: 'French', otherLanguages: 'Comorian (Shikomori), Arabic',
    structure: '6-4-3', stages: FRANCO_STAGES(), qualification: 'Baccalauréat', examBody: { name: 'Ministry of National Education' }, grading: 'fr-20', entry: FRANCO_ENTRY, notes: [],
  },
  {
    id: 'djibouti', name: 'Djibouti', region: 'east', tradition: 'franco', instruction: 'French', otherLanguages: 'Arabic, Somali, Afar',
    structure: '5-4-3', stages: [{ name: 'Primary (5 years)' }, { name: 'Middle school (4 years)', exam: 'BEF' }, { name: 'Secondary (3 years)', exam: 'Baccalauréat' }],
    qualification: 'Baccalauréat', examBody: { name: 'Ministry of National Education' }, grading: 'fr-20', entry: FRANCO_ENTRY, notes: [],
  },
  {
    id: 'eritrea', name: 'Eritrea', region: 'east', tradition: 'anglo-east', instruction: 'English (from middle school)', otherLanguages: 'Tigrinya, Arabic and other mother tongues in primary',
    structure: '5-3-4', stages: [{ name: 'Elementary (5 years, mother tongue)' }, { name: 'Middle school (3 years)' }, { name: 'Secondary (4 years)', exam: 'Eritrean Secondary Education Certificate Examination (ESECE)' }],
    qualification: 'ESECE', examBody: { name: 'Ministry of Education' }, grading: 'percent',
    entry: { early: 'After Grade 10 or 11', late: 'After Grade 12' },
    notes: ['The final year of secondary school is completed at the Sawa training centre alongside national service.', 'Computer and internet access is very limited: about one in five people used the internet at the end of 2025 (DataReportal).'],
    sources: [{ title: 'Digital 2026: Eritrea (DataReportal)', url: 'https://datareportal.com/reports/digital-2026-eritrea' }],
  },
  {
    id: 'ethiopia', name: 'Ethiopia', region: 'east', tradition: 'anglo-east', instruction: 'English (secondary)', otherLanguages: 'Amharic, Afaan Oromo and other regional languages in primary',
    structure: '6-2-4', stages: [{ name: 'Primary (Grades 1–6)' }, { name: 'Middle (Grades 7–8)' }, { name: 'Secondary (Grades 9–12), natural or social science stream', exam: 'Ethiopian Secondary School Leaving Certificate Examination (Grade 12)' }],
    qualification: 'Ethiopian Secondary School Leaving Certificate (ESSLCE)', examBody: { name: 'Educational Assessment and Examinations Service (EAES)' }, grading: 'esslce',
    entry: { early: 'After Grade 10', late: 'After Grade 12 (ESSLCE)' },
    notes: [
      'Since 2024 the Grade 12 exam covers six subjects (English, mathematics, general aptitude and three stream subjects). An average of 50% is needed for direct university admission.',
      'In 2024/25 only about 8% of candidates reached 50%, so ALA applicants are a highly selected group.',
      'Since 2022 the exam has been sat at universities to reduce cheating. Conflict has disrupted schooling in Tigray, Amhara and Oromia.',
    ],
    modifiers: [{ dims: { english: -1 }, reason: 'Students switch to English-medium learning in secondary school after mother-tongue primary' }],
    sources: [
      { title: 'Education system Ethiopia (Nuffic)', url: 'https://www.nuffic.nl/en/node/217' },
      { title: 'The Ethiopian University Entrance Exam Explained (uni2study)', url: 'https://www.uni2study.com/articles/ethiopian-university-entrance-exam-explained' },
    ],
  },
  {
    id: 'kenya', name: 'Kenya', region: 'east', tradition: 'anglo-east', instruction: 'English', otherLanguages: 'Kiswahili',
    structure: '8-4-4, being replaced by CBC (2-6-3-3)', stages: [
      { name: 'Primary (8-4-4: Standard 1–8; CBC: Grades 1–6)' },
      { name: 'Junior school (CBC Grades 7–9)', exam: 'KJSEA (60% of senior school placement, with 40% school-based assessment)' },
      { name: 'Secondary (8-4-4: Form 1–4) or senior school (CBC: Grades 10–12)', exam: 'KCSE (8-4-4)' },
    ],
    qualification: 'KCSE (8-4-4); senior school certificate under CBC', examBody: { name: 'Kenya National Examinations Council (KNEC)', url: 'https://www.knec.ac.ke' }, grading: 'kcse',
    entry: { early: 'After Form 3, or Grade 10 under CBC', late: 'After Form 4 (KCSE)' },
    notes: [
      'The first CBC cohort entered Grade 10 in January 2026, choosing STEM, Social Sciences or Arts and Sports Science pathways. The last 8-4-4 cohorts are still sitting KCSE.',
      'KCSE science papers include practical exams, so many students have some laboratory experience.',
    ],
    sources: [
      { title: 'Explainer: What awaits Kenya\'s first Grade 10 learners in 2026 (People Daily)', url: 'https://peopledaily.digital/news/explainer-what-awaits-kenyas-first-grade-10-learners-in-2026/amp' },
      { title: 'Second-last KCSE as old model is phased out (People Daily)', url: 'https://peopledaily.digital/news/second-last-kcse-as-old-model-is-phased-out' },
    ],
  },
  {
    id: 'madagascar', name: 'Madagascar', region: 'east', tradition: 'franco', instruction: 'French', otherLanguages: 'Malagasy',
    structure: '5-4-3', stages: [{ name: 'Primary (5 years)', exam: 'CEPE' }, { name: 'Lower secondary (4 years)', exam: 'BEPC' }, { name: 'Upper secondary (3 years)', exam: 'Baccalauréat' }],
    qualification: 'Baccalauréat', examBody: { name: 'Office du Baccalauréat' }, grading: 'fr-20', entry: FRANCO_ENTRY,
    notes: ['Many pupils learn in Malagasy in primary school and switch to French in secondary.'],
  },
  {
    id: 'mauritius', advancedLevel: true, name: 'Mauritius', region: 'east', tradition: 'anglo-south', instruction: 'English (written); French and Kreol widely spoken',
    structure: 'Nine-Year Continuous Basic Education, then upper secondary', stages: [
      { name: 'Primary (Grades 1–6)', exam: 'Primary School Achievement Certificate (PSAC)' },
      { name: 'Lower secondary (Grades 7–9)', exam: 'National Certificate of Education (NCE)' },
      { name: 'Upper secondary (Grades 10–13)', exam: 'Cambridge School Certificate (Grade 11) and Higher School Certificate (Grade 13)' },
    ],
    qualification: 'Cambridge Higher School Certificate', examBody: { name: 'Mauritius Examinations Syndicate, with Cambridge International', url: 'https://mes.intnet.mu' }, grading: 'cambridge',
    entry: { early: 'After Grade 11 (School Certificate)', late: 'After Grade 13 (Higher School Certificate)' },
    notes: ['Students take Cambridge examinations locally, so the transition to ALA\'s Cambridge programme is usually smooth.'],
    modifiers: [{ dims: { assessment: 1, writing: 1 }, reason: 'Cambridge examinations are taken locally' }],
  },
  {
    id: 'rwanda', advancedLevel: true, name: 'Rwanda', region: 'east', tradition: 'anglo-east', instruction: 'English', otherLanguages: 'Kinyarwanda, French',
    structure: '6-3-3', stages: [{ name: 'Primary (P1–P6)', exam: 'Primary leaving exam' }, { name: 'Ordinary level (S1–S3)', exam: 'O Level national exam' }, { name: 'Advanced level (S4–S6), subject combinations', exam: 'A Level national exam' }],
    qualification: 'Advanced Certificate of Secondary Education', examBody: { name: 'National Examination and School Inspection Authority (NESA)', url: 'https://www.nesa.gov.rw' }, grading: 'rwanda',
    entry: { early: 'After S3 (O Level) or S4', late: 'After S6 (A Level)' },
    notes: [
      'English replaced French as the language of instruction in 2008–09, so many families and some teachers are stronger in Kinyarwanda or French.',
      'A competence-based curriculum has been in place since 2015.',
    ],
    modifiers: [{ dims: { english: -1 }, reason: 'English became the medium of instruction relatively recently (2008–09)' }],
    sources: [{ title: 'Rwanda national examination body introduces new grading system (KT Press, 2022)', url: 'https://www.ktpress.rw/2022/08/rwanda-national-examination-body-introduces-new-grading-system/' }],
  },
  {
    id: 'seychelles', advancedLevel: true, name: 'Seychelles', region: 'east', tradition: 'anglo-south', instruction: 'English', otherLanguages: 'Seychellois Creole, French',
    structure: '6-5 + post-secondary', stages: [{ name: 'Primary (P1–P6)' }, { name: 'Secondary (S1–S5)', exam: 'IGCSE' }, { name: 'Post-secondary', exam: 'A Levels (School of Advanced Level Studies)' }],
    qualification: 'IGCSE; Cambridge A Levels', examBody: { name: 'Cambridge International, with the Ministry of Education' }, grading: 'cambridge',
    entry: { early: 'After S5 (IGCSE)', late: 'After A Levels' },
    notes: ['Students sit Cambridge IGCSE examinations, so the question styles are familiar.'],
    modifiers: [{ dims: { assessment: 1 }, reason: 'Students already sit Cambridge IGCSE examinations' }],
  },
  {
    id: 'somalia', name: 'Somalia', region: 'east', tradition: 'anglo-east', instruction: 'Somali, Arabic or English (varies by school and region)',
    structure: '8-4', stages: [{ name: 'Primary (8 years)' }, { name: 'Secondary (4 years)', exam: 'National secondary school examination' }],
    qualification: 'Secondary school certificate', examBody: { name: 'Federal Ministry of Education (Somaliland and Puntland run separate exams)' }, grading: 'percent',
    entry: { early: 'After Form 3', late: 'After Form 4' },
    notes: ['Decades of conflict mean schooling varies greatly; many secondary schools are private and use English or Arabic.'],
  },
  {
    id: 'south-sudan', name: 'South Sudan', region: 'east', tradition: 'anglo-east', instruction: 'English',
    structure: '8-4', stages: [{ name: 'Primary (8 years)', exam: 'Certificate of Primary Education' }, { name: 'Secondary (Senior 1–4)', exam: 'South Sudan Certificate of Secondary Education' }],
    qualification: 'South Sudan Certificate of Secondary Education', examBody: { name: 'Ministry of General Education and Instruction' }, grading: 'percent',
    entry: { early: 'After Senior 3', late: 'After Senior 4' },
    notes: ['Conflict and displacement have interrupted many students\' schooling; some complete secondary education in Uganda or Kenya.'],
  },
  {
    id: 'sudan', name: 'Sudan', region: 'east', tradition: 'arabo', instruction: 'Arabic', otherLanguages: 'English taught as a subject',
    structure: '6-3-3', stages: [{ name: 'Primary' }, { name: 'Intermediate' }, { name: 'Secondary', exam: 'Sudan Secondary School Certificate' }],
    qualification: 'Sudan Secondary School Certificate', examBody: { name: 'Ministry of Education' }, grading: 'percent',
    entry: { early: 'After the second year of secondary school', late: 'After the Sudan Secondary School Certificate' },
    notes: [
      'Schools across Sudan have been closed or disrupted since war began in April 2023. UNICEF estimated in March 2025 that around 17 million children were out of school.',
      'Some students have sat the Sudanese certificate as refugees in Egypt and Chad.',
    ],
    sources: [{ title: 'Sudan: War disruption to education (allAfrica, 2025)', url: 'https://allafrica.com/stories/202507080009.html' }],
  },
  {
    id: 'tanzania', advancedLevel: true, name: 'Tanzania', region: 'east', tradition: 'anglo-east', instruction: 'English (secondary); Kiswahili (primary)',
    structure: '7-4-2', stages: [{ name: 'Primary (Standard 1–7, Kiswahili)', exam: 'PSLE' }, { name: 'Ordinary level (Form 1–4)', exam: 'Certificate of Secondary Education Examination (CSEE)' }, { name: 'Advanced level (Form 5–6)', exam: 'ACSEE' }],
    qualification: 'CSEE / ACSEE', examBody: { name: 'National Examinations Council of Tanzania (NECTA)', url: 'https://www.necta.go.tz' }, grading: 'csee',
    entry: { early: 'After Form 4 (CSEE)', late: 'After Form 6 (ACSEE)' },
    notes: ['Pupils learn in Kiswahili for seven years of primary school and switch to English at secondary level.', 'A new education policy and curriculum reform are being phased in.'],
    modifiers: [{ dims: { english: -1 }, reason: 'Primary school is taught in Kiswahili; English begins as the medium in secondary' }],
  },
  {
    id: 'uganda', advancedLevel: true, name: 'Uganda', region: 'east', tradition: 'anglo-east', instruction: 'English',
    structure: '7-4-2', stages: [{ name: 'Primary (P1–P7)', exam: 'PLE' }, { name: 'Lower secondary (S1–S4)', exam: 'Uganda Certificate of Education (UCE)' }, { name: 'Upper secondary (S5–S6)', exam: 'Uganda Advanced Certificate of Education (UACE)' }],
    qualification: 'UCE / UACE', examBody: { name: 'Uganda National Examinations Board (UNEB)', url: 'https://www.uneb.ac.ug' }, grading: 'uce',
    entry: { early: 'After S4 (UCE)', late: 'After S6 (UACE)' },
    notes: [
      'A competency-based lower secondary curriculum began in 2020. The 2024 UCE was the first under it: grades A to E combine continuous assessment, project work and the end-of-cycle exam.',
    ],
    sources: [{ title: 'UNEB explains new grading system under revised curriculum (Daily Monitor, 2025)', url: 'https://www.monitor.co.ug/uganda/news/national/uneb-explains-new-grading-system-under-revised-curriculum-4921732' }],
  },

  /* ---------------- Southern Africa ---------------- */
  {
    id: 'angola', name: 'Angola', region: 'southern', tradition: 'luso', instruction: 'Portuguese',
    structure: '6-3-3', stages: [{ name: 'Primary (1.ª–6.ª classe)' }, { name: 'Lower secondary (7.ª–9.ª classe)' }, { name: 'Upper secondary (10.ª–12.ª classe; 13.ª in technical and teacher training)' }],
    qualification: 'Certificate of secondary education (12.ª classe)', examBody: { name: 'Ministry of Education' }, grading: 'pt-20',
    entry: { early: 'After 10.ª classe', late: 'After 12.ª classe' },
    notes: ['Included in the ALA research team\'s Lusophone comparison with Cabo Verde and Mozambique.'],
  },
  {
    id: 'botswana', name: 'Botswana', region: 'southern', tradition: 'anglo-south', instruction: 'English', otherLanguages: 'Setswana',
    structure: '7-3-2', stages: [{ name: 'Primary (Standard 1–7)', exam: 'PSLE' }, { name: 'Junior secondary (Form 1–3)', exam: 'Junior Certificate (JCE)' }, { name: 'Senior secondary (Form 4–5)', exam: 'BGCSE' }],
    qualification: 'Botswana General Certificate of Secondary Education (BGCSE)', examBody: { name: 'Botswana Examinations Council (BEC)', url: 'https://www.bec.co.bw' }, grading: 'gcse',
    entry: { early: 'After Form 4', late: 'After Form 5 (BGCSE)' }, notes: ['BGCSE is modelled on Cambridge IGCSE.'],
  },
  {
    id: 'eswatini', name: 'Eswatini', region: 'southern', tradition: 'anglo-south', instruction: 'English', otherLanguages: 'siSwati',
    structure: '7-3-2', stages: [{ name: 'Primary (Grades 1–7)' }, { name: 'Junior secondary (Form 1–3)', exam: 'Junior Certificate' }, { name: 'Senior secondary (Form 4–5)', exam: 'EGCSE' }],
    qualification: 'Eswatini General Certificate of Secondary Education (EGCSE)', examBody: { name: 'Examinations Council of Eswatini' }, grading: 'gcse',
    entry: { early: 'After Form 4', late: 'After Form 5 (EGCSE)' }, notes: ['EGCSE is modelled on Cambridge IGCSE.'],
  },
  {
    id: 'lesotho', name: 'Lesotho', region: 'southern', tradition: 'anglo-south', instruction: 'English', otherLanguages: 'Sesotho',
    structure: '7-5', stages: [{ name: 'Primary (Grades 1–7)' }, { name: 'Secondary (Grades 8–12 / Forms A–E)', exam: 'LGCSE' }],
    qualification: 'Lesotho General Certificate of Secondary Education (LGCSE)', examBody: { name: 'Examinations Council of Lesotho' }, grading: 'gcse',
    entry: { early: 'After Grade 11', late: 'After Grade 12 (LGCSE)' }, notes: ['LGCSE replaced the Cambridge Overseas School Certificate and follows IGCSE-style syllabuses.'],
  },
  {
    id: 'malawi', name: 'Malawi', region: 'southern', tradition: 'anglo-south', instruction: 'English', otherLanguages: 'Chichewa',
    structure: '8-4', stages: [{ name: 'Primary (Standard 1–8)', exam: 'PSLCE' }, { name: 'Secondary (Form 1–4)', exam: 'Malawi School Certificate of Education (MSCE)' }],
    qualification: 'MSCE', examBody: { name: 'Malawi National Examinations Board (MANEB)', url: 'https://www.maneb.edu.mw' }, grading: 'msce',
    entry: { early: 'After Form 3', late: 'After Form 4 (MSCE)' },
    notes: ['Laboratory access is limited in many community day secondary schools.'],
    modifiers: [{ dims: { assessment: -1 }, reason: 'MSCE question styles are less close to Cambridge than IGCSE-based systems' }],
  },
  {
    id: 'mozambique', name: 'Mozambique', region: 'southern', tradition: 'luso', instruction: 'Portuguese', otherLanguages: 'Emakhuwa, Xichangana and other national languages',
    structure: '6-3-3', stages: [{ name: 'Primary (1.ª–6.ª classe)' }, { name: 'General secondary, first cycle (7.ª–9.ª classe)' }, { name: 'General secondary, second cycle (10.ª–12.ª classe)', exam: '12th grade national exams' }],
    qualification: 'Secondary school certificate (12.ª classe)', examBody: { name: 'National Council of Examinations, Certification and Equivalence (CNECE)' }, grading: 'pt-20',
    entry: { early: 'After 10.ª classe', late: 'After 12.ª classe' },
    notes: ['Included in the ALA research team\'s Lusophone comparison with Angola and Cabo Verde.', 'Conflict in Cabo Delgado has disrupted schooling in the north.'],
  },
  {
    id: 'namibia', advancedLevel: true, name: 'Namibia', region: 'southern', tradition: 'anglo-south', instruction: 'English',
    structure: '7-5', stages: [{ name: 'Primary (Grades 1–7)' }, { name: 'Secondary (Grades 8–12)', exam: 'NSSCO (Grade 11) and NSSCAS (Grade 12)' }],
    qualification: 'NSSCO / NSSCAS', examBody: { name: 'Directorate of National Examinations and Assessment (DNEA)' }, grading: 'gcse',
    entry: { early: 'After Grade 11 (NSSCO)', late: 'After Grade 12 (NSSCAS)' },
    notes: ['Syllabuses are based on Cambridge IGCSE (NSSCO) and AS Level (NSSCAS).'],
    sources: [{ title: 'Education in Namibia', url: 'https://en.wikipedia.org/wiki/Education_in_Namibia' }],
  },
  {
    id: 'south-africa', name: 'South Africa', region: 'southern', tradition: 'sa-caps', instruction: 'English or Afrikaans (most schools)', otherLanguages: 'Eleven other official languages, including isiZulu and isiXhosa',
    structure: 'Grade R + 12', stages: [{ name: 'Foundation to Senior phases (Grades R–9)' }, { name: 'Further Education and Training (Grades 10–12)', exam: 'National Senior Certificate (NSC)' }],
    qualification: 'National Senior Certificate (NSC)', examBody: { name: 'Department of Basic Education (DBE); IEB for many independent schools', url: 'https://www.education.gov.za' }, grading: 'nsc',
    entry: { early: 'After Grade 10 or 11', late: 'After Grade 12 (NSC)' },
    notes: ['Check whether the student took Mathematics or Mathematical Literacy; Mathematical Literacy does not prepare students for AS Mathematics.'],
  },
  {
    id: 'zambia', name: 'Zambia', region: 'southern', tradition: 'anglo-south', instruction: 'English', otherLanguages: 'Bemba, Nyanja, Tonga and others in early grades',
    structure: '7-2-3', stages: [{ name: 'Primary (Grades 1–7)' }, { name: 'Junior secondary (Grades 8–9)', exam: 'Junior Secondary School Leaving Examination' }, { name: 'Senior secondary (Grades 10–12)', exam: 'School Certificate (Grade 12)' }],
    qualification: 'School Certificate', examBody: { name: 'Examinations Council of Zambia (ECZ)', url: 'https://www.exams-council.org.zm' }, grading: 'ecz',
    entry: { early: 'After Grade 10 or 11', late: 'After Grade 12 (School Certificate)' }, notes: [],
    modifiers: [{ dims: { assessment: -1 }, reason: 'School Certificate question styles are less close to Cambridge than IGCSE-based systems' }],
  },
  {
    id: 'zimbabwe', advancedLevel: true, name: 'Zimbabwe', region: 'southern', tradition: 'anglo-south', instruction: 'English', otherLanguages: 'Shona, Ndebele',
    structure: '7-4-2', stages: [{ name: 'Primary (Grades 1–7)', exam: 'Grade 7 exam' }, { name: 'Ordinary Level (Form 1–4)', exam: 'ZIMSEC O Level' }, { name: 'Advanced Level (Form 5–6)', exam: 'ZIMSEC A Level' }],
    qualification: 'ZIMSEC O Level / A Level', examBody: { name: 'Zimbabwe School Examinations Council (ZIMSEC)', url: 'https://www.zimsec.co.zw' }, grading: 'zimsec',
    entry: { early: 'After Form 4 (O Level)', late: 'After Form 6 (A Level)' },
    notes: [
      'The Heritage-Based Curriculum (2024–2030) makes Mathematics, Combined Science and Heritage Studies compulsory at secondary level and replaces continuous assessment tasks with School-Based Projects.',
      'O and A Level structures are close to Cambridge, so many students adapt quickly.',
    ],
    sources: [{ title: 'Understanding the new heritage-based curriculum (The Herald)', url: 'https://www.heraldonline.co.zw/understanding-the-new-heritage-based-curriculum-2/' }],
  },

  /* ---------------- Central Africa ---------------- */
  {
    id: 'burundi', name: 'Burundi', region: 'central', tradition: 'franco', instruction: 'French', otherLanguages: 'Kirundi; English taught from primary',
    structure: '9-3', stages: [{ name: 'Basic education, école fondamentale (9 years)', exam: 'National test at the end of basic education' }, { name: 'Post-basic secondary (3 years)', exam: 'Examen d\'État' }],
    qualification: 'Diplôme d\'État', examBody: { name: 'Ministry of National Education' }, grading: 'fr-20',
    entry: { early: 'After the first year of post-basic secondary', late: 'After the Examen d\'État' }, notes: [],
  },
  {
    id: 'cameroon', name: 'Cameroon', region: 'central', tradition: 'franco', instruction: 'French or English (two separate sub-systems)',
    structure: '6-4-3 (Francophone) / 6-5-2 (Anglophone)', stages: [
      { name: 'Francophone: collège (4 years) then lycée (3 years)', exam: 'BEPC, Probatoire, Baccalauréat' },
      { name: 'Anglophone: secondary (5 years) then high school (2 years)', exam: 'GCE Ordinary Level, GCE Advanced Level' },
    ],
    qualification: 'Baccalauréat or GCE A Level', examBody: { name: 'Office du Baccalauréat du Cameroun; Cameroon GCE Board' }, grading: 'fr-20',
    entry: { early: 'After Seconde, or after GCE O Level', late: 'After the Baccalauréat, or after GCE A Level' },
    notes: [
      'Cameroon runs two systems. Students from the Anglophone sub-system (GCE O and A Level) learn in English and are much closer to Cambridge; use the student profile tool with "English" as the language of instruction for them.',
      'The crisis in the North-West and South-West regions since 2016 has disrupted Anglophone schooling.',
    ],
  },
  {
    id: 'central-african-republic', name: 'Central African Republic', region: 'central', tradition: 'franco', instruction: 'French', otherLanguages: 'Sango',
    structure: '6-4-3', stages: FRANCO_STAGES(), qualification: 'Baccalauréat', examBody: { name: 'Office du Baccalauréat' }, grading: 'fr-20', entry: FRANCO_ENTRY,
    notes: ['Conflict has disrupted schooling in much of the country.'],
    modifiers: [{ dims: { content: -1, practical: -1 }, reason: 'Conflict and limited resources have disrupted schooling' }],
  },
  {
    id: 'chad', name: 'Chad', region: 'central', tradition: 'franco', instruction: 'French or Arabic (bilingual system)',
    structure: '6-4-3', stages: FRANCO_STAGES('BEF', 'Baccalauréat'), qualification: 'Baccalauréat', examBody: { name: 'Office National des Examens et Concours du Supérieur (ONECS)' }, grading: 'fr-20', entry: FRANCO_ENTRY,
    notes: ['Schools teach in French or Arabic; Arabic-medium students have had even less exposure to English and French academic writing.'],
  },
  {
    id: 'republic-of-the-congo', name: 'Republic of the Congo', region: 'central', tradition: 'franco', instruction: 'French', otherLanguages: 'Lingala, Kituba',
    structure: '6-4-3', stages: FRANCO_STAGES(), qualification: 'Baccalauréat', examBody: { name: 'Direction des Examens et Concours' }, grading: 'fr-20', entry: FRANCO_ENTRY, notes: [],
  },
  {
    id: 'dr-congo', name: 'DR Congo', region: 'central', tradition: 'franco', instruction: 'French', otherLanguages: 'Lingala, Swahili, Kikongo, Tshiluba',
    structure: '6-2-4', stages: [{ name: 'Primary (6 years)', exam: 'TENAFEP' }, { name: 'Basic secondary (2 years)' }, { name: 'Humanités (4 years, by option)', exam: 'Examen d\'État' }],
    qualification: 'Diplôme d\'État', examBody: { name: 'Inspection Générale / Examen d\'État' }, grading: 'percent',
    entry: { early: 'After the second year of humanités', late: 'After the Examen d\'État' },
    notes: ['Examen d\'État results are reported as percentages. Conflict in the east has disrupted schooling for many students.'],
  },
  {
    id: 'equatorial-guinea', name: 'Equatorial Guinea', region: 'central', tradition: 'hispano', instruction: 'Spanish', otherLanguages: 'French, Portuguese, Fang, Bubi',
    structure: '6-4-2', stages: [{ name: 'Primary (6 years)' }, { name: 'Basic secondary (ESBA, 4 years)' }, { name: 'Bachillerato (2 years)' }],
    qualification: 'Bachillerato', examBody: { name: 'Ministry of Education' }, grading: 'es-10',
    entry: { early: 'After ESBA (basic secondary)', late: 'After the Bachillerato' }, notes: [],
  },
  {
    id: 'gabon', name: 'Gabon', region: 'central', tradition: 'franco', instruction: 'French',
    structure: '5-4-3', stages: FRANCO_STAGES(), qualification: 'Baccalauréat', examBody: { name: 'Office du Baccalauréat' }, grading: 'fr-20', entry: FRANCO_ENTRY, notes: [],
  },
  {
    id: 'sao-tome-and-principe', name: 'São Tomé and Príncipe', region: 'central', tradition: 'luso', instruction: 'Portuguese', otherLanguages: 'Forro, Angolar',
    structure: '6-3-3', stages: [{ name: 'Basic education' }, { name: 'Secondary to 12th grade' }],
    qualification: 'Secondary completion (12.ª classe)', examBody: { name: 'Ministry of Education' }, grading: 'pt-20',
    entry: { early: 'After 10th grade', late: 'After 12th grade' }, notes: [],
  },

  /* ---------------- North Africa ---------------- */
  {
    id: 'algeria', name: 'Algeria', region: 'north', tradition: 'arabo', instruction: 'Arabic', otherLanguages: 'Tamazight; French and English taught as subjects',
    structure: '5-4-3', stages: [{ name: 'Primary (5 years)' }, { name: 'Middle school (4 years)', exam: 'BEM' }, { name: 'Secondary (3 years)', exam: 'Baccalauréat' }],
    qualification: 'Baccalauréat', examBody: { name: 'Office National des Examens et Concours (ONEC)' }, grading: 'fr-20',
    entry: { early: 'After the second year of secondary', late: 'After the Baccalauréat' },
    notes: ['Sciences are taught in Arabic in public secondary schools; universities often teach sciences in French, and English is being expanded.'],
  },
  {
    id: 'egypt', name: 'Egypt', region: 'north', tradition: 'arabo', instruction: 'Arabic (English or French in "language schools")',
    structure: '6-3-3', stages: [{ name: 'Primary (6 years)' }, { name: 'Preparatory (3 years)', exam: 'Basic Education Certificate' }, { name: 'General secondary (3 years)', exam: 'Thanaweya Amma, or the optional Egyptian Baccalaureate' }],
    qualification: 'Thanaweya Amma (General Secondary Certificate)', examBody: { name: 'Ministry of Education and Technical Education' }, grading: 'percent',
    entry: { early: 'After the first year of secondary', late: 'After Thanaweya Amma' },
    notes: [
      'In 2025 Parliament approved an optional three-year Egyptian Baccalaureate alongside Thanaweya Amma, with specialisation tracks and paid exam resits. Thanaweya Amma remains in place.',
      'Students from language schools study sciences in English and adapt faster.',
    ],
    sources: [
      { title: 'Thanaweya Amma to remain, baccalaureate optional (Ahram Online, Jul 2025)', url: 'https://english.ahram.org.eg/NewsContent/1/2/549292/Egypt/Society/Thanaweya-Amma-to-remain-in-place%2C-baccalaureate-s.aspx' },
    ],
  },
  {
    id: 'libya', name: 'Libya', region: 'north', tradition: 'arabo', instruction: 'Arabic',
    structure: '6-3-3', stages: [{ name: 'Primary (6 years)' }, { name: 'Preparatory (3 years)', exam: 'Basic Education Certificate' }, { name: 'Secondary (3 years)', exam: 'Secondary Education Certificate' }],
    qualification: 'Secondary Education Certificate', examBody: { name: 'Ministry of Education' }, grading: 'percent',
    entry: { early: 'After the second year of secondary', late: 'After the Secondary Education Certificate' },
    notes: ['Political instability since 2011 has affected school quality and continuity.'],
  },
  {
    id: 'mauritania', name: 'Mauritania', region: 'north', tradition: 'arabo', instruction: 'Arabic, with French for some subjects', otherLanguages: 'Pulaar, Soninke, Wolof',
    structure: '6-4-3', stages: [{ name: 'Primary (6 years)' }, { name: 'Lower secondary (4 years)', exam: 'BEPC' }, { name: 'Upper secondary (3 years)', exam: 'Baccalauréat' }],
    qualification: 'Baccalauréat', examBody: { name: 'Ministry of National Education' }, grading: 'fr-20',
    entry: { early: 'After the first year of upper secondary', late: 'After the Baccalauréat' },
    notes: ['Mauritania is an Islamic republic, and Islamic education is a core part of schooling.', 'Recent reforms strengthen Arabic and national languages; French remains important for sciences.'],
  },
  {
    id: 'morocco', name: 'Morocco', region: 'north', tradition: 'franco', instruction: 'Arabic and French (sciences increasingly in French)', otherLanguages: 'Amazigh, Darija',
    structure: '6-3-3', stages: [{ name: 'Primary (6 years)' }, { name: 'Collège (3 years)' }, { name: 'Lycée (3 years: tronc commun, then 2 baccalauréat years)', exam: 'Baccalauréat (regional exam in year 1, national exam in year 2)' }],
    qualification: 'Baccalauréat', examBody: { name: 'Ministry of National Education' }, grading: 'fr-20',
    entry: { early: 'After the tronc commun (Grade 10)', late: 'After the Baccalauréat' },
    notes: ['Since the 2019 framework law, scientific subjects are increasingly taught in French; Arabic remains the main language of other subjects.'],
  },
  {
    id: 'tunisia', name: 'Tunisia', region: 'north', tradition: 'franco', instruction: 'Arabic and French (sciences and mathematics in French)',
    structure: '6-3-4', stages: [{ name: 'Basic education: primary (6 years) and preparatory (3 years)' }, { name: 'Secondary (4 years, by section)', exam: 'Baccalauréat' }],
    qualification: 'Baccalauréat', examBody: { name: 'Ministry of Education' }, grading: 'fr-20',
    entry: { early: 'After the second year of secondary (Grade 10 equivalent)', late: 'After the Baccalauréat' },
    notes: [
      'Research finding: Tunisia is STEM-dominant, with very strong mathematics, physics and chemistry preparation. Students enter ALA better prepared for Cambridge sciences than most Francophone peers.',
      'Compared with Burkina Faso in the ALA research team\'s Francophone analysis.',
    ],
    modifiers: [{ dims: { content: 1, quant: 1 }, subjects: STEM, reason: 'Research team finding: Tunisia\'s system is STEM-dominant' }],
  },
];

export const countryById = (id: string) => COUNTRIES.find((c) => c.id === id);
export const REGIONS: { id: RegionId; name: string }[] = [
  { id: 'west', name: 'West Africa' }, { id: 'east', name: 'East Africa and the Horn' }, { id: 'southern', name: 'Southern Africa' },
  { id: 'central', name: 'Central Africa' }, { id: 'north', name: 'North Africa' },
];
export const regionName = (id: string) => REGIONS.find((r) => r.id === id)?.name ?? id;
