/**
 * Indicative transition-profile engine.
 *
 * Every rating starts from the education tradition's baseline and is adjusted, step by step,
 * for the subject, the country, the entry point and (in the student tool) the student's own
 * background. Each step is recorded so the page can show why a rating is what it is.
 */
import { DIMS, LEVEL_LABEL, clamp, type Dim } from './dims';
import { countryById, type Country } from '@/data/countries';
import { subjectById, type Subject } from '@/data/subjects';
import { traditionById, type Tradition } from '@/data/traditions';
import { BAND_EFFECT, BAND_LABEL, type Band } from '@/data/grading';
import { conflictFor } from '@/data/contexts';

export type Entry = 'early' | 'late';
export type Language = 'English' | 'French' | 'Portuguese' | 'Arabic' | 'Spanish' | 'Other';
export const LANGUAGES: Language[] = ['English', 'French', 'Portuguese', 'Arabic', 'Spanish', 'Other'];

export interface StudentContext {
  language?: Language;
  band?: Band;
  labs?: 'regular' | 'some' | 'none';
  research?: boolean;
  computing?: boolean;
  mathLit?: boolean;
  /** Conflict-affected schooling. Defaults to on for conflict-affected countries (not for DR Congo, where it depends on the region). */
  conflict?: boolean;
  interrupted?: boolean;
  mcq?: boolean;
  remote?: boolean;
  homeLanguage?: boolean;
  mixed?: boolean;
}

export interface Step { text: string; delta: number }
export interface DimResult { dim: Dim; score: number; label: string; steps: Step[] }
export interface Finding { dim: Dim; text: string }
export interface Profile {
  country: Country;
  subject: Subject;
  tradition: Tradition;
  entry: Entry;
  dims: Record<Dim, DimResult>;
  overall: { score: number; label: string };
  strengths: Finding[];
  gaps: Finding[];
  watch: Finding[];
  support: Finding[];
  /** Context and wellbeing notes for faculty (not tied to one readiness area). */
  care: string[];
  conflict: boolean;
}

const SCIENCES = new Set(['biology', 'chemistry', 'physics']);
const HANDS_ON = new Set(['biology', 'chemistry', 'physics', 'computer-science', 'geography']);
const LANGUAGE_SCORE: Record<Language, number> = { English: 5, French: 1, Portuguese: 2, Arabic: 2, Spanish: 2, Other: 2 };

const STRONG: Record<Dim, string> = {
  content: 'Has met much of the core content: {f}',
  practical: 'Experience of {f}',
  inquiry: 'Some experience of {f}',
  writing: 'Comfortable with {f}',
  quant: 'Confident with {f}',
  english: 'Comfortable with {f}',
  assessment: 'Used to {f}',
};
const WEAK: Record<Dim, string> = {
  content: 'Gaps in {f}',
  practical: 'Little experience of {f}',
  inquiry: 'Limited experience of {f}',
  writing: 'Less practice with {f}',
  quant: 'Needs practice with {f}',
  english: 'Needs support with {f}',
  assessment: 'New to {f}',
};
const fill = (t: string, f: string) => t.replace('{f}', f);

export const label = (score: number) => LEVEL_LABEL[clamp(score)];

export function profileFor(countryId: string, subjectId: string, entry: Entry, student: StudentContext = {}): Profile | null {
  const country = countryById(countryId);
  const subject = subjectById(subjectId);
  if (!country || !subject) return null;
  const tradition = traditionById(country.tradition);
  const englishMedium = /^english/i.test(country.instruction) || tradition.language.startsWith('English');

  const raw = {} as Record<Dim, { value: number; steps: Step[] }>;
  for (const d of DIMS) raw[d] = { value: tradition.baseline[d], steps: [{ text: `${tradition.short}: typical starting point ${LEVEL_LABEL[tradition.baseline[d]]}`, delta: 0 }] };
  const apply = (dims: Partial<Record<Dim, number>>, text: string) => {
    for (const [d, delta] of Object.entries(dims) as [Dim, number][]) {
      if (!delta) continue;
      raw[d].value += delta;
      raw[d].steps.push({ text, delta });
    }
  };

  if (subject.general) apply(subject.general.dims, subject.general.reason);
  const ts = tradition.subjects[subject.id];
  if (ts) apply(ts.dims, ts.reason);
  for (const m of country.modifiers ?? []) if (!m.subjects || m.subjects.includes(subject.id)) apply(m.dims, `${country.name}: ${m.reason}`);

  // Language of instruction chosen in the student tool replaces the system's default.
  if (student.language) {
    const target = LANGUAGE_SCORE[student.language];
    const current = raw.english.value;
    if (target !== current && !(student.language === 'English' && englishMedium)) {
      apply({ english: target - current }, `Student learned in ${student.language}`);
      if (student.language === 'English' && !englishMedium) apply({ assessment: 1 }, 'English-medium schooling (for example the Anglophone sub-system) is closer to Cambridge');
    }
  }
  const learnsInEnglish = student.language ? student.language === 'English' : englishMedium;

  // Learning context: what students actually experienced, not only what the curriculum states.
  const care: string[] = [];
  const ctx = conflictFor(country.id);
  const conflict = student.conflict ?? (!!ctx && !ctx.area);
  if (conflict) {
    apply({ content: -1 }, 'Conflict-affected context: schooling disrupted by conflict or displacement');
    if (HANDS_ON.has(subject.id)) apply({ practical: -1 }, 'Conflict-affected context: little or no laboratory or equipment access');
    apply({ writing: -1 }, 'Conflict-affected context: mostly multiple-choice exams, so essay writing is often new');
    if (subject.id === 'computer-science') apply({ content: -1 }, 'Conflict-affected context: very limited computer access');
    care.push('Use a short diagnostic before teaching: what the curriculum states may not be what was taught.');
    care.push('Plan wellbeing-aware support with pastoral care; some students have experienced displacement or violence. Keep expectations high.');
  } else {
    if (student.interrupted) apply({ content: -1 }, 'Schooling was interrupted');
    if (student.mcq) apply({ writing: -1, assessment: -1 }, 'Mostly multiple-choice exams, so essay writing is new');
  }
  if (student.remote && HANDS_ON.has(subject.id)) apply({ practical: -1 }, 'Remote or rural school with little laboratory or computer access');
  if (student.remote && subject.id === 'computer-science') apply({ content: -1 }, 'Remote or rural school with little computer access');
  if (student.homeLanguage) {
    apply({ english: -1 }, 'Learned mainly in a home language');
    care.push(`Check the student's comfort in ${country.instruction.split(/[(,]/)[0].trim()} as well as English; they learned mainly in a home language.`);
  }
  if (student.mixed) care.push('The student met mixed teaching and assessment models; explain Cambridge expectations explicitly from the start.');

  if (entry === 'late' && country.advancedLevel) apply({ content: 1, assessment: 1 }, 'Has already studied A Level or AS Level content at home');
  if (entry === 'early') {
    apply({ content: -1 }, 'Joins before completing the final national qualification');
    if (!learnsInEnglish) apply({ english: -1 }, 'Fewer years of English as a subject before joining');
  }

  if (student.band) {
    const delta = BAND_EFFECT[student.band];
    if (delta) apply({ content: delta }, `National result in this subject: ${BAND_LABEL[student.band].toLowerCase()}`);
  }
  if (student.labs && SCIENCES.has(subject.id)) {
    if (student.labs === 'regular') apply({ practical: 1 }, 'Regular laboratory practicals at school');
    if (student.labs === 'none') apply({ practical: -1 }, 'No laboratory practicals at school');
  }
  if (student.research) apply({ inquiry: 1 }, 'Has completed an independent research project');
  if (student.computing && subject.id === 'computer-science') apply({ practical: 1, content: 1 }, 'Regular computer and programming access');
  if (student.mathLit && subject.id === 'mathematics') apply({ content: -2, quant: -1 }, 'Took Mathematical Literacy rather than Mathematics');

  const dims = {} as Record<Dim, DimResult>;
  for (const d of DIMS) {
    const score = clamp(raw[d].value);
    dims[d] = { dim: d, score, label: LEVEL_LABEL[score], steps: raw[d].steps };
  }

  const weighted = DIMS.reduce((s, d) => s + dims[d].score * subject.weights[d], 0);
  const totalW = DIMS.reduce((s, d) => s + subject.weights[d], 0);
  const overallScore = clamp(weighted / totalW);

  const relevant = DIMS.filter((d) => subject.weights[d] > 0);
  const strengths = [...relevant].filter((d) => dims[d].score >= 4)
    .sort((a, b) => dims[b].score - dims[a].score || subject.weights[b] - subject.weights[a]).slice(0, 4)
    .map((d) => ({ dim: d, text: fill(STRONG[d], subject.focus[d]) }));
  const gapDims = [...relevant].filter((d) => dims[d].score <= 2)
    .sort((a, b) => dims[a].score - dims[b].score || subject.weights[b] - subject.weights[a]);
  const watchDims = [...relevant].filter((d) => dims[d].score === 3 && subject.weights[d] >= 2)
    .sort((a, b) => subject.weights[b] - subject.weights[a]);
  const gaps = gapDims.map((d) => ({ dim: d, text: fill(WEAK[d], subject.focus[d]) }));
  const watch = watchDims.map((d) => ({ dim: d, text: fill(WEAK[d], subject.focus[d]) }));

  const support: Finding[] = [...gapDims, ...watchDims.slice(0, Math.max(0, 3 - gapDims.length))]
    .map((d) => ({ dim: d, text: subject.support[d] }));
  if (!learnsInEnglish && tradition.languageSupport && (dims.english.score <= 2)) {
    support.push({ dim: 'english', text: tradition.languageSupport });
  }

  return { country, subject, tradition, entry, dims, overall: { score: overallScore, label: LEVEL_LABEL[overallScore] }, strengths, gaps, watch, support, care, conflict };
}

/** Overall readiness for every subject, for listings. */
export function overallFor(countryId: string, subjectId: string, entry: Entry) {
  return profileFor(countryId, subjectId, entry)?.overall ?? { score: 0, label: '' };
}
