/**
 * Education traditions: groups of systems that share a language of instruction, an examination
 * model and a teaching style. Baselines are indicative ratings (1 Low – 6 Very High) for a typical
 * student completing the national qualification, before subject, country and entry-point adjustments.
 */
import type { Dim } from '@/lib/dims';

export interface Tradition {
  id: string;
  name: string;
  short: string;
  language: string;
  summary: string;
  features: string[];
  strengths: string[];
  challenges: string[];
  baseline: Record<Dim, number>;
  /** Subject-specific adjustments for this tradition. */
  subjects: Record<string, { dims: Partial<Record<Dim, number>>; reason: string }>;
  /** Language-specific support added to recommendations. */
  languageSupport?: string;
}

export const TRADITIONS: Tradition[] = [
  {
    id: 'anglo-west',
    name: 'West African WAEC systems',
    short: 'WAEC systems',
    language: 'English',
    summary: 'English-medium systems in which students sit the West African Senior School Certificate Examination (WASSCE), run by the West African Examinations Council, after three years of senior secondary school.',
    features: [
      'English is the language of instruction throughout secondary school',
      'Junior secondary ends with the BECE (or national equivalent); senior secondary ends with WASSCE (in Nigeria also NECO\'s SSCE)',
      'Broad syllabuses covering many subjects, assessed mostly by final written exams',
      'Science papers include practical or alternative-to-practical papers, but laboratory access varies widely between schools',
      'Large classes in many public schools; strong private and mission school sectors',
    ],
    strengths: ['Fluent English and confident speaking', 'Broad content knowledge across many subjects', 'Exam stamina and discipline', 'Strong motivation and work ethic'],
    challenges: ['Independent inquiry and open-ended tasks', 'Hands-on laboratory investigation', 'Evaluative rather than descriptive writing', 'Applying knowledge to unfamiliar Cambridge-style questions'],
    baseline: { content: 4, practical: 2, inquiry: 2, writing: 3, quant: 3, english: 5, assessment: 3 },
    subjects: {
      'entrepreneurial-leadership': { dims: { content: 1, practical: 1 }, reason: 'Entrepreneurship and trade subjects feature in senior secondary curricula in the region' },
      english: { dims: { content: 1 }, reason: 'English Language and Literature are core subjects' },
    },
  },
  {
    id: 'anglo-east',
    name: 'East African and Horn systems',
    short: 'East African systems',
    language: 'English (secondary)',
    summary: 'Systems in which secondary education is taught in English, often after primary school in a national language. Examinations are run by national bodies such as KNEC (Kenya), UNEB (Uganda), NECTA (Tanzania) and NESA (Rwanda). Several countries are moving to competency-based curricula.',
    features: [
      'English becomes the language of instruction in secondary school, sometimes after a different language in primary',
      'National certificates at the end of lower secondary (O Level or equivalent) and upper secondary',
      'Science exams usually include practical papers',
      'Kenya, Uganda, Rwanda and Tanzania are phasing in competency-based curricula with continuous assessment and projects',
      'Conflict has disrupted schooling in South Sudan, Somalia and parts of Ethiopia',
    ],
    strengths: ['Solid science content, often with practical exam experience', 'Good English in most urban and boarding schools', 'Structured study habits', 'Growing exposure to project work under new curricula'],
    challenges: ['Independent research and inquiry', 'Extended evaluative writing', 'Academic English for students who switched language at secondary level', 'Cambridge-style application questions'],
    baseline: { content: 4, practical: 3, inquiry: 2, writing: 3, quant: 3, english: 4, assessment: 3 },
    subjects: {
      english: { dims: { content: 0 }, reason: 'English is a core subject' },
    },
  },
  {
    id: 'anglo-south',
    name: 'Southern African O-Level and IGCSE-style systems',
    short: 'O-Level/IGCSE-style systems',
    language: 'English',
    summary: 'English-medium systems with O-Level, IGCSE-style or Cambridge-derived examinations, such as ZIMSEC (Zimbabwe), BGCSE (Botswana), EGCSE (Eswatini), LGCSE (Lesotho), NSSCO/NSSCAS (Namibia) and the Cambridge School and Higher School Certificates (Mauritius).',
    features: [
      'English-medium secondary education',
      'Syllabuses and question styles derived from Cambridge O Level and IGCSE',
      'Some countries offer A Level or AS Level locally (Zimbabwe, Mauritius, Seychelles, Namibia)',
      'Science exams include practical papers',
      'Zimbabwe is phasing in a Heritage-Based Curriculum (2024–2030) with school-based projects',
    ],
    strengths: ['Familiarity with Cambridge-style questions and mark schemes', 'Good English and written expression', 'Solid foundations in mathematics and sciences', 'Experience of structured coursework'],
    challenges: ['Independent research beyond the syllabus', 'Open-ended practical investigation', 'Depth expected at A Level', 'Applying knowledge to African and global case studies beyond the home country'],
    baseline: { content: 4, practical: 3, inquiry: 3, writing: 4, quant: 4, english: 5, assessment: 5 },
    subjects: {
      'computer-science': { dims: { content: 1 }, reason: 'Computer Science is available at O Level or IGCSE level in several of these systems' },
    },
  },
  {
    id: 'sa-caps',
    name: 'South African CAPS / NSC',
    short: 'South African NSC',
    language: 'English or Afrikaans (most schools)',
    summary: 'South Africa\'s Curriculum and Assessment Policy Statement (CAPS), ending with the National Senior Certificate (NSC) in Grade 12. Some independent schools write the IEB version of the NSC.',
    features: [
      'Grade 12 National Senior Certificate with results reported as achievement levels 1 to 7',
      'Learners take either Mathematics or Mathematical Literacy; Mathematical Literacy is not preparation for A Level Mathematics',
      'Physical Sciences combines physics and chemistry; Life Sciences covers biology',
      'School-based assessment counts towards the final result',
      'Very large differences in resources between schools',
    ],
    strengths: ['Experience of school-based assessment and projects', 'Good English in English-medium schools', 'Broad general knowledge', 'Exposure to research tasks in some subjects'],
    challenges: ['Mathematics depth, especially for Mathematical Literacy learners', 'Cambridge question styles', 'Extended practical investigation', 'Separate physics and chemistry depth'],
    baseline: { content: 4, practical: 3, inquiry: 3, writing: 4, quant: 3, english: 4, assessment: 3 },
    subjects: {
      chemistry: { dims: { content: -1 }, reason: 'Chemistry is studied within the combined Physical Sciences subject' },
      physics: { dims: { content: -1 }, reason: 'Physics is studied within the combined Physical Sciences subject' },
    },
  },
  {
    id: 'franco',
    name: 'Francophone Baccalauréat systems',
    short: 'Francophone systems',
    language: 'French',
    summary: 'French-medium systems modelled on the French Baccalauréat. Students take the BEPC (or national equivalent) at the end of lower secondary and the Baccalauréat, in a chosen series, at the end of upper secondary.',
    features: [
      'French is the language of instruction; English is taught as a foreign language',
      'Lower secondary ends with the BEPC (Brevet), upper secondary with the Baccalauréat',
      'Students specialise by series (for example C/D for sciences, A for literature)',
      'Strong tradition of theory, mathematics and structured argument (dissertation)',
      'Limited laboratory equipment and project work in many schools',
      'Marks are on a scale out of 20',
    ],
    strengths: ['Strong mathematics and theory, especially in science series', 'Structured argument and essay writing in French', 'Discipline and perseverance', 'Multilingual backgrounds'],
    challenges: ['Academic English: the single biggest transition challenge', 'Laboratory and practical skills', 'Independent research', 'Classroom participation and presentations in English', 'Cambridge assessment style'],
    baseline: { content: 4, practical: 2, inquiry: 2, writing: 4, quant: 4, english: 1, assessment: 2 },
    subjects: {
      mathematics: { dims: { content: 1, quant: 1 }, reason: 'Mathematics is a strength of the Baccalauréat tradition, especially in science series' },
      physics: { dims: { quant: 1 }, reason: 'Physics is taught with heavy mathematical emphasis' },
      history: { dims: { content: 1 }, reason: 'History and geography are taught together in depth (histoire-géographie)' },
      geography: { dims: { content: 1 }, reason: 'History and geography are taught together in depth (histoire-géographie)' },
      english: { dims: { content: -2 }, reason: 'English is a foreign-language subject, not a medium of study' },
      'computer-science': { dims: { content: -1 }, reason: 'Computing is rarely a full examined subject' },
    },
    languageSupport: 'Provide French–English subject glossaries and allow early drafts to be planned in French',
  },
  {
    id: 'luso',
    name: 'Lusophone systems',
    short: 'Lusophone systems',
    language: 'Portuguese',
    summary: 'Portuguese-medium systems in Angola, Mozambique, Cabo Verde, Guinea-Bissau and São Tomé and Príncipe, ending with 12th grade (12.ª classe or 12.º ano). Marks are on a scale out of 20.',
    features: [
      'Portuguese is the language of instruction; English is a foreign-language subject',
      'Secondary schooling ends in 12th grade, with national exams at key grades',
      'Teaching is often content- and exam-focused',
      'Laboratory resources are limited in many public schools',
      'Marks out of 20, with 10 as the pass mark',
    ],
    strengths: ['Good foundations in core subjects', 'Experience learning in more than one language', 'Resilience and adaptability', 'Strong community and social awareness'],
    challenges: ['Academic English', 'Practical and laboratory work', 'Independent research', 'Cambridge-style evaluative questions'],
    baseline: { content: 3, practical: 2, inquiry: 2, writing: 3, quant: 3, english: 2, assessment: 2 },
    subjects: {
      english: { dims: { content: -1 }, reason: 'English is a foreign-language subject' },
    },
    languageSupport: 'Provide Portuguese–English subject glossaries and pair students with peers who share Portuguese',
  },
  {
    id: 'arabo',
    name: 'Arabophone systems',
    short: 'Arabophone systems',
    language: 'Arabic',
    summary: 'Arabic-medium systems in North Africa and Sudan, ending with a national secondary certificate such as Egypt\'s Thanaweya Amma, the Baccalauréat in Algeria and Mauritania, the Sudan Secondary School Certificate or Libya\'s Secondary Education Certificate.',
    features: [
      'Arabic is the main language of instruction; English (and often French) are taught as subjects',
      'A single high-stakes national exam decides university entry',
      'Strong emphasis on memorisation and exam preparation',
      'Strong mathematics in science streams',
      'Some private and "language" schools teach sciences in English or French',
    ],
    strengths: ['Strong mathematics and science theory', 'Exam discipline', 'Memory and content retention', 'Multilingual backgrounds'],
    challenges: ['Academic English', 'Practical investigation', 'Independent research and inquiry', 'Evaluative writing in English'],
    baseline: { content: 4, practical: 2, inquiry: 2, writing: 3, quant: 4, english: 2, assessment: 2 },
    subjects: {
      mathematics: { dims: { content: 1 }, reason: 'Mathematics is studied in depth in science streams' },
      english: { dims: { content: -1 }, reason: 'English is a foreign-language subject' },
    },
    languageSupport: 'Provide Arabic–English subject glossaries and support right-to-left to left-to-right writing habits early',
  },
  {
    id: 'hispano',
    name: 'Hispanophone system',
    short: 'Spanish-medium system',
    language: 'Spanish',
    summary: 'Equatorial Guinea\'s Spanish-medium system, ending with the Bachillerato. French and Portuguese are also official languages.',
    features: [
      'Spanish is the language of instruction',
      'Secondary schooling ends with the Bachillerato',
      'English is taught as a foreign language',
      'Limited laboratory resources in many schools',
    ],
    strengths: ['Multilingual environment', 'Good foundations in core subjects', 'Adaptability'],
    challenges: ['Academic English', 'Practical work', 'Independent research', 'Cambridge assessment style'],
    baseline: { content: 3, practical: 2, inquiry: 2, writing: 3, quant: 3, english: 2, assessment: 2 },
    subjects: {
      english: { dims: { content: -1 }, reason: 'English is a foreign-language subject' },
    },
    languageSupport: 'Provide Spanish–English subject glossaries',
  },
];

export const traditionById = (id: string) => TRADITIONS.find((t) => t.id === id)!;

// Writing & Rhetoric is taught in English, so it follows each tradition's English adjustment.
for (const t of TRADITIONS) if (t.subjects.english && !t.subjects['writing-rhetoric']) t.subjects['writing-rhetoric'] = t.subjects.english;
