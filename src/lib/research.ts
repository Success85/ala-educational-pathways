/**
 * Research model for ALA Educational Pathways.
 *
 * A subject analysis mirrors the research team's sheet template:
 *   A Curriculum overview · B/C Transition profiles by entry point · D Common strengths
 *   E Transition gaps · F Cambridge expectations · G NEASC competencies · H ALA expectations
 *   I Department recommendations · J Departmental conclusion · K+ Additional sections
 * A comparison matrix mirrors the multi-country template (Area | Country… | ALA implication).
 *
 * This file has no imports so it can run in the browser, on the server and in scripts.
 */

export type Row2 = { area: string; rating: string };

export interface EntryProfile {
  label: string;
  heading: string;
  ratings: Row2[];
  strengths: string[];
  challenges: string[];
}

export interface AnalysisContent {
  benchmark: string;
  overview: { label: string; value: string }[];
  profiles: EntryProfile[];
  strengths: { area: string; evidence: string }[];
  gaps: { area: string; impact: string }[];
  cambridge: Row2[];
  neasc: { competency: string; rating: string; commentary: string }[];
  ala: { expectation: string; preparedness: string; support: string }[];
  recommendations: { title: string; lead: string; items: string[] }[];
  conclusion: { summary: string; readinessTitle: string; readiness: Row2[]; verdict: string };
  extra: { title: string; body: string }[];
}

export interface MatrixRow {
  area: string;
  ratings: Record<string, string>; // country id -> rating
  implication: string;
}

export const NEASC_COMPETENCIES = [
  'Critical Thinking', 'Communication', 'Collaboration', 'Creativity',
  'Self-Directed Learning', 'Ethical Reasoning', 'Global Perspective',
];

/* ---------------- Ratings ---------------- */

export const RATING_SCALE = ['Low', 'Low-Moderate', 'Moderate-Low', 'Moderate', 'Moderate-High', 'High', 'Very High'];
export const SUPPORT_SCALE = ['Low', 'Moderate', 'High', 'Very High'];

const SCORES: [string, number][] = [
  ['very high', 6], ['exceptional', 6], ['very strong', 6],
  ['moderate-high', 4], ['moderate-low', 2], ['low-moderate', 2],
  ['high', 5], ['strong', 5], ['moderate', 3], ['very low', 1], ['low', 1], ['weak', 1],
];

/** Score 1–6 for a rating label such as "Moderate-High" or "Moderate-High with targeted support…". */
export function ratingScore(label?: string | null): number | null {
  if (!label) return null;
  const s = label.toLowerCase().replace(/[–—]/g, '-').replace(/\s*-\s*/g, '-').trim();
  for (const [term, score] of SCORES) {
    if (s === term || s.startsWith(term + ' ') || s.startsWith(term + '-') === false && s.startsWith(term) && /^[\s,.;:(]/.test(s.slice(term.length))) return score;
  }
  return null;
}

/** Leading rating term of a verdict like "Moderate-Low – the single most important…". */
export function leadingRating(text?: string | null): string {
  if (!text) return '';
  const t = text.replace(/[–—]/g, '-').trim();
  const sorted = [...RATING_SCALE].sort((a, b) => b.length - a.length);
  for (const r of sorted) {
    if (t.toLowerCase().startsWith(r.toLowerCase())) {
      const rest = t.slice(r.length);
      if (!rest || /^[\s,.;:(-]/.test(rest)) return r;
    }
  }
  return '';
}

/* ---------------- Empty shapes ---------------- */

export function emptyContent(qualification = 'national qualification'): AnalysisContent {
  return {
    benchmark: '',
    overview: [],
    profiles: [
      { label: 'After Grade 10 equivalent', heading: '', ratings: [], strengths: [], challenges: [] },
      { label: `After ${qualification}`, heading: '', ratings: [], strengths: [], challenges: [] },
    ],
    strengths: [],
    gaps: [],
    cambridge: [],
    neasc: NEASC_COMPETENCIES.map((competency) => ({ competency, rating: '', commentary: '' })),
    ala: [],
    recommendations: [],
    conclusion: { summary: '', readinessTitle: '', readiness: [], verdict: '' },
    extra: [],
  };
}

/* ---------------- Text helpers ---------------- */

const META = /^(next\b.*|perfect\..*|now let'?s\b.*|this comparative format\b.*|the next subjects would be\b.*|which will complete\b.*|sheet \d+\s*[–—-].*complete.*)$/i;
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const clean = (s: string) => s.replace(/ /g, ' ').replace(/\s+$/g, '').replace(/^\s+/, '');
const isTab = (s: string) => s.includes('\t');
const cells = (s: string) => s.split('\t').map((c) => c.trim());
const endsSentence = (s: string) => /[.!?;:]$/.test(s.trim());

function normaliseLines(text: string): string[] {
  return text.replace(/\r\n?/g, '\n').split('\n').map(clean);
}

/**
 * Turn loose research prose (paragraphs, colon-introduced lists, short headings, tab tables)
 * into the small Markdown subset the app renders: "### heading", "- item", "| a | b |", paragraphs.
 */
export function proseToMarkdown(lines: string[]): string {
  // Blocks are separated by blank lines and by switches between table rows and prose.
  const blocks: string[][] = [];
  let cur: string[] = [];
  const flush = () => { if (cur.length) blocks.push(cur); cur = []; };
  for (const raw of lines) {
    const l = raw.replace(/^ +| +$/g, '');
    if (!l.trim()) { flush(); continue; }
    if (cur.length && isTab(cur[0]) !== isTab(l)) flush();
    cur.push(l);
  }
  flush();

  const out: string[] = [];
  const para = (s: string) => out.push('', s, '');
  const heading = (s: string) => out.push('', `### ${s}`, '');
  const headingLike = (l: string) => !endsSentence(l) && words(l) <= 7 && /^[A-Z0-9]/.test(l);
  let list = false;
  let items: string[] = [];
  const startList = () => { list = true; items = []; };
  const stopList = () => { list = false; items = []; };

  blocks.forEach((block, bi) => {
    const nextBlock = blocks[bi + 1];
    if (isTab(block[0])) {
      const rows = block.map(cells);
      out.push('', `| ${rows[0].join(' | ')} |`, `| ${rows[0].map(() => '---').join(' | ')} |`);
      rows.slice(1).forEach((r) => out.push(`| ${r.join(' | ')} |`));
      out.push('');
      stopList();
      return;
    }
    let endedWithOpener = false;
    block.forEach((line, li) => {
      const after = block[li + 1];
      endedWithOpener = false;
      const introducesContent = after ? words(after) > 12 || after.endsWith(':') : !!nextBlock;
      if (line.endsWith(':')) { para(line); startList(); endedWithOpener = true; return; }
      if (/^[a-z]/.test(line)) { para(line); stopList(); return; }
      const headingAllowed = !list || !items.length || items.some(endsSentence);
      if (headingLike(line) && introducesContent && headingAllowed) {
        heading(line); startList(); endedWithOpener = true; return;
      }
      if (list) {
        const sentenceAfterBareItems = line.endsWith('.') && items.length > 0 && !items.some(endsSentence) && words(line) > 6;
        if (words(line) > 12 || sentenceAfterBareItems) { para(line); stopList(); return; }
        out.push(`- ${line}`); items.push(line); return;
      }
      if (block.length > 1 && block.every((l) => words(l) <= 12)) { out.push(`- ${line}`); return; }
      para(line);
    });
    if (!endedWithOpener) stopList();
    else if (!list) startList();
    out.push('');
  });
  return out.join('\n').replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').trim();
}

/* ---------------- Sheet parser ---------------- */

export interface ParsedSheet {
  title: string;
  subjectName: string;
  countryName: string;
  content: AnalysisContent;
  trailing: string;
  found: string[];
  warnings: string[];
}

type Section = { letter: string; title: string; lines: string[] };

function splitSections(lines: string[]) {
  const head: string[] = [];
  const sections: Section[] = [];
  let trailing: string[] = [];
  let ended = false;
  for (const l of lines) {
    if (ended) { trailing.push(l); continue; }
    if (/^sheet \d+\s*[–—-].*complete/i.test(l)) { ended = true; continue; }
    const m = l.match(/^SECTION\s+([A-Z])\s*[:.\-–]\s*(.*)$/i);
    if (m) { sections.push({ letter: m[1].toUpperCase(), title: m[2].trim(), lines: [] }); continue; }
    if (META.test(l.trim()) && !/^next:/i.test(l.trim()) && l.trim().toLowerCase() !== 'next') { continue; }
    if (/^next:?$/i.test(l.trim()) || /^next:/i.test(l.trim())) continue;
    if (sections.length) sections[sections.length - 1].lines.push(l); else head.push(l);
  }
  trailing = trailing.filter((l) => !/^next\b/i.test(l.trim()));
  return { head, sections, trailing };
}

function tableRows(lines: string[], skipHeader = true): string[][] {
  const rows: string[][] = [];
  let inTable = false;
  for (const l of lines) {
    if (isTab(l)) {
      if (!inTable && skipHeader) { inTable = true; continue; }
      inTable = true;
      rows.push(cells(l));
    } else if (l.trim()) inTable = false;
  }
  return rows;
}

/** Items after a "…:" intro line until the next blank-separated non-item or a stop line. */
function listAfter(lines: string[], start: number, stop: (l: string) => boolean): string[] {
  const items: string[] = [];
  let i = start;
  while (i < lines.length && !lines[i].trim()) i++;
  if (i < lines.length && lines[i].trim().endsWith(':')) i++;
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) { if (items.length) { const n = lines.slice(i + 1).find((x) => x.trim()); if (!n || stop(n)) break; } continue; }
    if (stop(l) || isTab(l)) break;
    items.push(l);
  }
  return items;
}

function parseProfile(sec: Section): EntryProfile {
  const nonEmpty = sec.lines.map((l) => l.trim()).filter(Boolean);
  const label = nonEmpty[0] && !isTab(nonEmpty[0]) ? nonEmpty[0].replace(/^student\s+joining\s+ala\s+/i, '').replace(/^\w/, (c) => c.toUpperCase()) : sec.title;
  const heading = nonEmpty[1] && !isTab(nonEmpty[1]) ? nonEmpty[1] : '';
  const ratings = tableRows(sec.lines).map(([area, rating]) => ({ area, rating: rating ?? '' }));
  const sIdx = sec.lines.findIndex((l) => /^typical strengths/i.test(l.trim()));
  const cIdx = sec.lines.findIndex((l) => /^typical challenges/i.test(l.trim()));
  const strengths = sIdx >= 0 ? listAfter(sec.lines, sIdx + 1, (l) => /^typical challenges/i.test(l.trim())) : [];
  const challenges = cIdx >= 0 ? listAfter(sec.lines, cIdx + 1, () => false) : [];
  return { label, heading, ratings, strengths, challenges };
}

function parseRecommendations(sec: Section) {
  const recs: { title: string; lead: string; items: string[] }[] = [];
  let cur: { title: string; lead: string; items: string[] } | null = null;
  let stage = 0;
  for (const raw of sec.lines) {
    const l = raw.trim();
    if (!l) continue;
    if (/^recommendation\s+\d+/i.test(l)) {
      const rest = l.replace(/^recommendation\s+\d+\s*[:.\-–]?\s*/i, '');
      cur = { title: rest, lead: '', items: [] }; recs.push(cur); stage = rest ? 1 : 0; continue;
    }
    if (!cur) continue;
    if (stage === 0) { cur.title = l; stage = 1; continue; }
    if (stage === 1 && l.endsWith(':')) { cur.lead = l; stage = 2; continue; }
    cur.items.push(l); stage = 2;
  }
  return recs;
}

/** Find the "Area | Rating" table that summarises overall readiness, plus its heading line. */
function findReadiness(lines: string[]) {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (isTab(lines[i]) && /^area\trating$/i.test(lines[i].replace(/\t+/g, '\t').trim())) {
      let end = i + 1;
      while (end < lines.length && (isTab(lines[end]))) end++;
      let h = i - 1;
      while (h >= 0 && !lines[h].trim()) h--;
      const title = h >= 0 && !isTab(lines[h]) && !endsSentence(lines[h]) ? lines[h].trim() : '';
      return { start: title ? h : i, headerIdx: i, end, title, rows: lines.slice(i + 1, end).map(cells) };
    }
  }
  return null;
}

export function parseSheet(text: string): ParsedSheet {
  const lines = normaliseLines(text);
  const { head, sections, trailing } = splitSections(lines);
  const content = emptyContent();
  content.profiles = [];
  const found: string[] = [];
  const warnings: string[] = [];

  const headClean = head.map((l) => l.trim()).filter((l) => l && !/^sheet\s+\d+$/i.test(l) && !/^next$/i.test(l));
  const title = headClean.find((l) => /comparative analysis|analysis/i.test(l) && /\(|system/i.test(l)) ?? headClean.find((l) => /analysis/i.test(l)) ?? '';
  const benchmark = headClean.find((l) => /^benchmark/i.test(l)) ?? '';
  const subjectName = headClean.find((l) => l === l.toUpperCase() && /[A-Z]/.test(l) && !/^SHEET/.test(l)) ?? '';
  const countryName = title ? title.split('(')[0].replace(/comparative analysis/i, '').trim() : '';
  content.benchmark = benchmark;

  const extraSections: Section[] = [];
  for (const sec of sections) {
    const t = sec.title.toLowerCase();
    found.push(`${sec.letter}: ${sec.title}`);
    if (/overview|language of instruction/.test(t) && sec.letter === 'A') {
      content.overview = tableRows(sec.lines).map(([label, value]) => ({ label, value: value ?? '' }));
    } else if (/transition profile/.test(t)) {
      content.profiles.push(parseProfile(sec));
    } else if (/strength/.test(t)) {
      content.strengths = tableRows(sec.lines).map(([area, evidence]) => ({ area, evidence: evidence ?? '' }));
    } else if (/gap|weakness/.test(t)) {
      content.gaps = tableRows(sec.lines).map(([area, impact]) => ({ area, impact: impact ?? '' }));
    } else if (/cambridge/.test(t)) {
      content.cambridge = tableRows(sec.lines).map(([area, rating]) => ({ area, rating: rating ?? '' }));
    } else if (/neasc/.test(t)) {
      content.neasc = tableRows(sec.lines).map(([competency, rating, commentary]) => ({ competency, rating: rating ?? '', commentary: commentary ?? '' }));
    } else if (/ala/.test(t) && /expectation/.test(t)) {
      content.ala = tableRows(sec.lines).map(([expectation, preparedness, support]) => ({ expectation, preparedness: preparedness ?? '', support: support ?? '' }));
    } else if (/recommendation/.test(t)) {
      content.recommendations = parseRecommendations(sec);
    } else if (/conclusion|summary/.test(t)) {
      content.conclusion.summary = '__J__';
      extraSections.push({ ...sec, letter: 'J' });
    } else {
      extraSections.push(sec);
    }
  }

  // Overall readiness may sit at the end of J or after K.
  const lastSecs = extraSections.filter((s) => s.letter >= 'J');
  let readinessHost: Section | undefined;
  let readiness: ReturnType<typeof findReadiness> = null;
  for (let i = lastSecs.length - 1; i >= 0 && !readiness; i--) {
    readiness = findReadiness(lastSecs[i].lines);
    if (readiness) readinessHost = lastSecs[i];
  }
  if (readiness && readinessHost) {
    content.conclusion.readinessTitle = readiness.title;
    const rows = readiness.rows.map(([area, rating]) => ({ area, rating: rating ?? '' }));
    const overallIdx = rows.findIndex((r) => /^overall/i.test(r.area));
    if (overallIdx >= 0) {
      content.conclusion.verdict = rows[overallIdx].rating;
      rows.splice(overallIdx, 1);
    }
    content.conclusion.readiness = rows;
    readinessHost.lines = [...readinessHost.lines.slice(0, readiness.start), ...readinessHost.lines.slice(readiness.end)];
  } else {
    warnings.push('No overall readiness table (Area | Rating) was found.');
  }

  for (const sec of extraSections) {
    const md = proseToMarkdown(sec.lines.filter((l) => !/^departmental conclusion$/i.test(l.trim())));
    if (sec.letter === 'J') content.conclusion.summary = md;
    else if (md) content.extra.push({ title: sec.title, body: md });
  }
  if (content.conclusion.summary === '__J__') content.conclusion.summary = '';
  if (!content.neasc.length) content.neasc = emptyContent().neasc;

  const expect: [string, boolean][] = [
    ['Curriculum overview (A)', content.overview.length > 0],
    ['Transition profiles (B, C)', content.profiles.length > 0],
    ['Common strengths (D)', content.strengths.length > 0],
    ['Transition gaps (E)', content.gaps.length > 0],
    ['Cambridge comparison (F)', content.cambridge.length > 0],
    ['ALA expectations (H)', content.ala.length > 0],
    ['Recommendations (I)', content.recommendations.length > 0],
  ];
  for (const [name, ok] of expect) if (!ok) warnings.push(`${name} not found.`);
  if (!sections.length) warnings.push('No "SECTION A:" style headings were found. Check you pasted a full sheet.');

  return { title, subjectName, countryName, content, trailing: trailing.join('\n').trim(), found, warnings };
}

/* ---------------- Matrix parser ---------------- */

export interface ParsedMatrix {
  subjectName: string;
  countries: string[];
  rows: { area: string; ratings: string[]; implication: string }[];
  conclusion: string;
}

/** Parse one or more "SUBJECT N: NAME" blocks with an "Area | Country… | ALA implications" table. */
export function parseMatrices(text: string): ParsedMatrix[] {
  const lines = normaliseLines(text);
  const blocks: { name: string; lines: string[] }[] = [];
  let skipping = false;
  for (const l of lines) {
    const m = l.match(/^SUBJECT\s+\d+\s*[:.\-–]\s*(.+)$/i);
    if (m) { blocks.push({ name: m[1].trim(), lines: [] }); skipping = false; continue; }
    if (META.test(l.trim())) { skipping = true; continue; }
    if (skipping) continue;
    if (blocks.length) blocks[blocks.length - 1].lines.push(l);
  }
  if (!blocks.length && lines.some(isTab)) blocks.push({ name: '', lines });

  return blocks.map((b) => {
    const headerIdx = b.lines.findIndex(isTab);
    const header = headerIdx >= 0 ? cells(b.lines[headerIdx]) : [];
    const hasImplication = header.length > 2 && /implication|ala/i.test(header[header.length - 1]);
    const countries = header.slice(1, hasImplication ? -1 : undefined);
    const rows: ParsedMatrix['rows'] = [];
    let i = headerIdx + 1;
    for (; headerIdx >= 0 && i < b.lines.length && isTab(b.lines[i]); i++) {
      const c = cells(b.lines[i]);
      rows.push({ area: c[0], ratings: countries.map((_, k) => c[k + 1] ?? ''), implication: hasImplication ? c[countries.length + 1] ?? '' : '' });
    }
    const rest = b.lines.slice(Math.max(i, 0)).filter((l) => !/^comparative conclusion$/i.test(l.trim()));
    return { subjectName: b.name, countries, rows, conclusion: proseToMarkdown(rest) };
  });
}

/* ---------------- Matching helpers ---------------- */

const SUBJECT_ALIASES: [RegExp, string][] = [
  [/language|english transition|french/i, 'language-transition'],
  [/business/i, 'business-studies'],
  [/computer|ict/i, 'computer-science'],
  [/math/i, 'mathematics'],
  [/biolog/i, 'biology'], [/chemi/i, 'chemistry'], [/physic/i, 'physics'],
  [/econom/i, 'economics'], [/geograph/i, 'geography'], [/histor/i, 'history'], [/english/i, 'english'],
];

export function guessSubjectId(name: string, subjects: { id: string; name: string }[]): string {
  const n = name.trim().toLowerCase();
  const exact = subjects.find((s) => s.name.toLowerCase() === n);
  if (exact) return exact.id;
  for (const [re, id] of SUBJECT_ALIASES) if (re.test(name) && subjects.some((s) => s.id === id)) return id;
  return '';
}

/* ---------------- Sanitising (server side) ---------------- */

const S = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const A = <T>(v: unknown, map: (x: Record<string, unknown>) => T, max = 60): T[] =>
  Array.isArray(v) ? v.slice(0, max).filter((x) => x && typeof x === 'object').map((x) => map(x as Record<string, unknown>)) : [];
const L = (v: unknown, max = 40) => (Array.isArray(v) ? v.map((x) => S(x, 600)).filter(Boolean).slice(0, max) : []);

export function sanitizeContent(raw: unknown): AnalysisContent {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const c = (r.conclusion && typeof r.conclusion === 'object' ? r.conclusion : {}) as Record<string, unknown>;
  const keep = <T extends Record<string, string | string[]>>(rows: T[], key: keyof T) => rows.filter((x) => x[key]);
  return {
    benchmark: S(r.benchmark, 300),
    overview: keep(A(r.overview, (x) => ({ label: S(x.label, 200), value: S(x.value, 600) })), 'label'),
    profiles: A(r.profiles, (x) => ({
      label: S(x.label, 200), heading: S(x.heading, 200),
      ratings: keep(A(x.ratings, (y) => ({ area: S(y.area, 200), rating: S(y.rating, 200) })), 'area'),
      strengths: L(x.strengths), challenges: L(x.challenges),
    }), 6).filter((p) => p.label),
    strengths: keep(A(r.strengths, (x) => ({ area: S(x.area, 200), evidence: S(x.evidence, 600) })), 'area'),
    gaps: keep(A(r.gaps, (x) => ({ area: S(x.area, 200), impact: S(x.impact, 600) })), 'area'),
    cambridge: keep(A(r.cambridge, (x) => ({ area: S(x.area, 200), rating: S(x.rating, 200) })), 'area'),
    neasc: keep(A(r.neasc, (x) => ({ competency: S(x.competency, 200), rating: S(x.rating, 200), commentary: S(x.commentary, 800) })), 'competency'),
    ala: keep(A(r.ala, (x) => ({ expectation: S(x.expectation, 200), preparedness: S(x.preparedness, 200), support: S(x.support, 200) })), 'expectation'),
    recommendations: A(r.recommendations, (x) => ({ title: S(x.title, 300), lead: S(x.lead, 300), items: L(x.items) }), 20).filter((x) => x.title),
    conclusion: {
      summary: S(c.summary, 20000),
      readinessTitle: S(c.readinessTitle, 300),
      readiness: keep(A(c.readiness, (y) => ({ area: S(y.area, 200), rating: S(y.rating, 300) })), 'area'),
      verdict: S(c.verdict, 1000),
    },
    extra: A(r.extra, (x) => ({ title: S(x.title, 300), body: S(x.body, 20000) }), 10).filter((x) => x.title || x.body),
  };
}

export function sanitizeMatrixRows(raw: unknown, countryIds: string[]): MatrixRow[] {
  return A(raw, (x) => {
    const ratings = (x.ratings && typeof x.ratings === 'object' ? x.ratings : {}) as Record<string, unknown>;
    return {
      area: S(x.area, 200),
      ratings: Object.fromEntries(countryIds.map((id) => [id, S(ratings[id], 200)])),
      implication: S(x.implication, 800),
    };
  }, 80).filter((r) => r.area);
}

/** Overall rating label for listings: the leading term of the verdict, else blank. */
export function overallRating(content: AnalysisContent): string {
  return leadingRating(content.conclusion.verdict);
}
