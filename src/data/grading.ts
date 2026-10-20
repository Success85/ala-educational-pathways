/**
 * National grading scales, kept in their original form and interpreted into four bands.
 * The band is a rough reading aid for faculty, not an equivalence or admissions conversion.
 */
export type Band = 'excellent' | 'good' | 'satisfactory' | 'weak';

export interface Grade { grade: string; range?: string; meaning: string; band: Band }
export interface Scale { id: string; name: string; usedIn: string; note?: string; grades: Grade[]; source?: { title: string; url: string } }

export const BAND_LABEL: Record<Band, string> = {
  excellent: 'Excellent', good: 'Good', satisfactory: 'Satisfactory', weak: 'Weak',
};
export const BAND_EFFECT: Record<Band, number> = { excellent: 1, good: 0, satisfactory: 0, weak: -1 };

const twenty = (french: boolean): Grade[] => [
  { grade: '16–20', meaning: french ? 'Very good (Très bien)' : 'Very good', band: 'excellent' },
  { grade: '14–15.9', meaning: french ? 'Good (Bien)' : 'Good', band: 'good' },
  { grade: '12–13.9', meaning: french ? 'Fairly good (Assez bien)' : 'Fairly good', band: 'satisfactory' },
  { grade: '10–11.9', meaning: french ? 'Pass (Passable)' : 'Pass', band: 'satisfactory' },
  { grade: 'Below 10', meaning: 'Below the pass mark', band: 'weak' },
];

export const SCALES: Scale[] = [
  {
    id: 'wassce', name: 'WASSCE (WAEC)', usedIn: 'Nigeria, Ghana, Sierra Leone, Liberia, The Gambia',
    note: 'C6 is the lowest credit; most universities ask for credits in five subjects including English and Mathematics.',
    grades: [
      { grade: 'A1', range: '75–100', meaning: 'Excellent', band: 'excellent' },
      { grade: 'B2', range: '70–74', meaning: 'Very good', band: 'excellent' },
      { grade: 'B3', range: '65–69', meaning: 'Good', band: 'good' },
      { grade: 'C4', range: '60–64', meaning: 'Credit', band: 'good' },
      { grade: 'C5', range: '55–59', meaning: 'Credit', band: 'satisfactory' },
      { grade: 'C6', range: '50–54', meaning: 'Credit', band: 'satisfactory' },
      { grade: 'D7', range: '45–49', meaning: 'Pass', band: 'weak' },
      { grade: 'E8', range: '40–44', meaning: 'Pass', band: 'weak' },
      { grade: 'F9', range: '0–39', meaning: 'Fail', band: 'weak' },
    ],
    source: { title: 'West African Senior School Certificate Examination', url: 'https://en.wikipedia.org/wiki/West_African_Senior_School_Certificate_Examination' },
  },
  {
    id: 'kcse', name: 'KCSE (Kenya)', usedIn: 'Kenya (8-4-4)',
    note: 'Twelve-point scale. Mark boundaries are set by KNEC for each subject and year.',
    grades: [
      { grade: 'A', meaning: '12 points', band: 'excellent' },
      { grade: 'A-', meaning: '11 points', band: 'excellent' },
      { grade: 'B+', meaning: '10 points', band: 'good' },
      { grade: 'B', meaning: '9 points', band: 'good' },
      { grade: 'B-', meaning: '8 points', band: 'good' },
      { grade: 'C+', meaning: '7 points', band: 'satisfactory' },
      { grade: 'C', meaning: '6 points', band: 'satisfactory' },
      { grade: 'C-', meaning: '5 points', band: 'satisfactory' },
      { grade: 'D+', meaning: '4 points', band: 'weak' },
      { grade: 'D', meaning: '3 points', band: 'weak' },
      { grade: 'D-', meaning: '2 points', band: 'weak' },
      { grade: 'E', meaning: '1 point', band: 'weak' },
    ],
  },
  {
    id: 'uce', name: 'UCE (Uganda, new curriculum)', usedIn: 'Uganda, from the 2024 UCE',
    note: 'Grades combine continuous assessment, project work and the end-of-cycle exam. Older certificates use distinctions (D1–D2), credits (C3–C6), passes (P7–P8) and fail (F9).',
    grades: [
      { grade: 'A', meaning: 'Exceptional', band: 'excellent' },
      { grade: 'B', meaning: 'Outstanding', band: 'good' },
      { grade: 'C', meaning: 'Satisfactory', band: 'satisfactory' },
      { grade: 'D', meaning: 'Basic', band: 'weak' },
      { grade: 'E', meaning: 'Elementary', band: 'weak' },
    ],
    source: { title: 'UNEB explains new grading system (Daily Monitor)', url: 'https://www.monitor.co.ug/uganda/news/national/uneb-explains-new-grading-system-under-revised-curriculum-4921732' },
  },
  {
    id: 'csee', name: 'CSEE (Tanzania)', usedIn: 'Tanzania',
    note: 'Overall results are reported in Divisions I (best) to IV, or 0.',
    grades: [
      { grade: 'A', range: '75–100', meaning: 'Excellent', band: 'excellent' },
      { grade: 'B', range: '65–74', meaning: 'Very good', band: 'good' },
      { grade: 'C', range: '45–64', meaning: 'Good', band: 'satisfactory' },
      { grade: 'D', range: '30–44', meaning: 'Satisfactory', band: 'weak' },
      { grade: 'F', range: '0–29', meaning: 'Fail', band: 'weak' },
    ],
  },
  {
    id: 'rwanda', name: 'Rwanda O Level (NESA)', usedIn: 'Rwanda',
    note: 'A Level principal subjects use a similar A–F scale; subsidiary subjects are graded S (pass) or F.',
    grades: [
      { grade: 'A', range: '70–100', meaning: 'Excellent', band: 'excellent' },
      { grade: 'B', range: '65–69', meaning: 'Very good', band: 'good' },
      { grade: 'C', range: '60–64', meaning: 'Good', band: 'good' },
      { grade: 'D', range: '50–59', meaning: 'Satisfactory', band: 'satisfactory' },
      { grade: 'E', range: '40–49', meaning: 'Adequate', band: 'weak' },
      { grade: 'S', range: '20–39', meaning: 'Fair', band: 'weak' },
      { grade: 'F', range: '0–19', meaning: 'Fail', band: 'weak' },
    ],
    source: { title: 'NESA grading system (KT Press, 2022)', url: 'https://www.ktpress.rw/2022/08/rwanda-national-examination-body-introduces-new-grading-system/' },
  },
  {
    id: 'zimsec', name: 'ZIMSEC O Level', usedIn: 'Zimbabwe',
    note: 'A Level uses A–E passes, O (subsidiary pass) and F.',
    grades: [
      { grade: 'A', meaning: 'Pass, highest', band: 'excellent' },
      { grade: 'B', meaning: 'Pass', band: 'good' },
      { grade: 'C', meaning: 'Pass', band: 'satisfactory' },
      { grade: 'D', meaning: 'Below pass', band: 'weak' },
      { grade: 'E', meaning: 'Below pass', band: 'weak' },
      { grade: 'U', meaning: 'Ungraded', band: 'weak' },
    ],
  },
  {
    id: 'gcse', name: 'IGCSE-style certificates', usedIn: 'Botswana (BGCSE), Eswatini (EGCSE), Lesotho (LGCSE), Namibia (NSSCO)',
    note: 'Letter grades follow the Cambridge IGCSE pattern. Namibia\'s NSSCAS uses A–E.',
    grades: [
      { grade: 'A* / A', meaning: 'Excellent', band: 'excellent' },
      { grade: 'B', meaning: 'Very good', band: 'good' },
      { grade: 'C', meaning: 'Good', band: 'satisfactory' },
      { grade: 'D', meaning: 'Satisfactory', band: 'weak' },
      { grade: 'E–G', meaning: 'Below satisfactory', band: 'weak' },
    ],
  },
  {
    id: 'ecz', name: 'School Certificate (Zambia, ECZ)', usedIn: 'Zambia',
    grades: [
      { grade: '1–2', meaning: 'Distinction', band: 'excellent' },
      { grade: '3–4', meaning: 'Merit', band: 'good' },
      { grade: '5–6', meaning: 'Credit', band: 'satisfactory' },
      { grade: '7–8', meaning: 'Satisfactory / pass', band: 'weak' },
      { grade: '9', meaning: 'Unsatisfactory', band: 'weak' },
    ],
  },
  {
    id: 'msce', name: 'MSCE (Malawi, MANEB)', usedIn: 'Malawi',
    grades: [
      { grade: '1–2', meaning: 'Distinction', band: 'excellent' },
      { grade: '3–4', meaning: 'Strong credit', band: 'good' },
      { grade: '5–6', meaning: 'Credit', band: 'satisfactory' },
      { grade: '7–8', meaning: 'Pass', band: 'weak' },
      { grade: '9', meaning: 'Fail', band: 'weak' },
    ],
  },
  {
    id: 'nsc', name: 'National Senior Certificate (South Africa)', usedIn: 'South Africa',
    note: 'Achievement levels per subject.',
    grades: [
      { grade: 'Level 7', range: '80–100%', meaning: 'Outstanding achievement', band: 'excellent' },
      { grade: 'Level 6', range: '70–79%', meaning: 'Meritorious achievement', band: 'excellent' },
      { grade: 'Level 5', range: '60–69%', meaning: 'Substantial achievement', band: 'good' },
      { grade: 'Level 4', range: '50–59%', meaning: 'Adequate achievement', band: 'satisfactory' },
      { grade: 'Level 3', range: '40–49%', meaning: 'Moderate achievement', band: 'weak' },
      { grade: 'Level 2', range: '30–39%', meaning: 'Elementary achievement', band: 'weak' },
      { grade: 'Level 1', range: '0–29%', meaning: 'Not achieved', band: 'weak' },
    ],
    source: { title: 'NSC grading scale (OpenEduCat)', url: 'https://openeducat.org/gradebook/south-africa-nsc/grading-scale/' },
  },
  {
    id: 'fr-20', name: 'Marks out of 20 (Baccalauréat)', usedIn: 'Francophone and Maghreb countries',
    note: 'A Baccalauréat average of 10/20 is a pass. Mentions: Passable, Assez bien, Bien, Très bien.',
    grades: twenty(true),
  },
  {
    id: 'pt-20', name: 'Marks out of 20 (Lusophone)', usedIn: 'Angola, Mozambique, Cabo Verde, Guinea-Bissau, São Tomé and Príncipe',
    note: '10 out of 20 is the pass mark.', grades: twenty(false),
  },
  {
    id: 'es-10', name: 'Marks out of 10 (Spanish model)', usedIn: 'Equatorial Guinea',
    grades: [
      { grade: '9–10', meaning: 'Sobresaliente (outstanding)', band: 'excellent' },
      { grade: '7–8.9', meaning: 'Notable (very good)', band: 'good' },
      { grade: '6–6.9', meaning: 'Bien (good)', band: 'satisfactory' },
      { grade: '5–5.9', meaning: 'Suficiente (pass)', band: 'satisfactory' },
      { grade: 'Below 5', meaning: 'Insuficiente (fail)', band: 'weak' },
    ],
  },
  {
    id: 'esslce', name: 'ESSLCE (Ethiopia, Grade 12)', usedIn: 'Ethiopia',
    note: 'Since 2024: six subjects scored out of 100 each (total 600). An average of 50% is needed for direct university admission.',
    grades: [
      { grade: '80–100%', meaning: 'Excellent subject score', band: 'excellent' },
      { grade: '65–79%', meaning: 'Strong subject score', band: 'good' },
      { grade: '50–64%', meaning: 'University-entry level', band: 'satisfactory' },
      { grade: 'Below 50%', meaning: 'Below university-entry level', band: 'weak' },
    ],
    source: { title: 'Education system Ethiopia (Nuffic)', url: 'https://www.nuffic.nl/en/node/217' },
  },
  {
    id: 'cambridge', name: 'Cambridge (IGCSE, O Level, AS & A Level)', usedIn: 'Mauritius, Seychelles and Cambridge schools across Africa',
    grades: [
      { grade: 'A* / A', meaning: 'Excellent', band: 'excellent' },
      { grade: 'B', meaning: 'Very good', band: 'good' },
      { grade: 'C', meaning: 'Good', band: 'satisfactory' },
      { grade: 'D / E', meaning: 'Pass, low', band: 'weak' },
      { grade: 'U', meaning: 'Ungraded', band: 'weak' },
    ],
  },
  {
    id: 'percent', name: 'Percentage scores', usedIn: 'Egypt, Sudan, Libya, Eritrea, Somalia, South Sudan, DR Congo',
    note: 'National cut-offs vary by exam and year; Egypt\'s Thanaweya Amma totals are very competitive at the top end.',
    grades: [
      { grade: '85–100%', meaning: 'Excellent', band: 'excellent' },
      { grade: '70–84%', meaning: 'Very good', band: 'good' },
      { grade: '50–69%', meaning: 'Pass to good', band: 'satisfactory' },
      { grade: 'Below 50%', meaning: 'Below pass', band: 'weak' },
    ],
  },
];

export const scaleById = (id: string) => SCALES.find((s) => s.id === id) ?? SCALES[SCALES.length - 1];
