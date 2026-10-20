import { DIMS, DIM_LABEL } from './dims';
import type { Profile } from './engine';

/** A profile as Markdown, for downloads. */
export function profileMarkdown(title: string, profiles: { label: string; p: Profile }[], extra: string[] = []): string {
  const first = profiles[0].p;
  const out: string[] = [`# ${title}`, '', `Country: ${first.country.name}`, `Education system: ${first.country.structure} (${first.tradition.name})`,
    `Qualification: ${first.country.qualification}`, `Benchmark: ${first.subject.benchmark.title}${first.subject.benchmark.code ? ` (${first.subject.benchmark.code})` : ''}`, ''];
  for (const { label, p } of profiles) {
    out.push(`## ${label}`, '', `Overall readiness: **${p.overall.label}**`, '', '| Readiness area | Rating |', '| --- | --- |');
    for (const d of DIMS) if (p.subject.weights[d] > 0) out.push(`| ${DIM_LABEL[d]} | ${p.dims[d].label} |`);
    out.push('', '**What students bring**', ...p.strengths.map((f) => `- ${f.text}`), '');
    out.push('**Where they may struggle**', ...[...p.gaps, ...p.watch].map((f) => `- ${f.text}`), '');
    out.push('**Support to prioritise**', ...p.support.map((f) => `- ${f.text}`), '');
    if (p.care.length) out.push('**Context and wellbeing**', ...p.care.map((t) => `- ${t}`), '');
  }
  out.push(...extra, '', '_Indicative profile generated from the features of the education system. Research-based guidance, not an admissions score; individual students vary._');
  return out.join('\n');
}
