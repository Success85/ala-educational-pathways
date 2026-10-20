'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { COUNTRIES } from '@/data/countries';
import { DEPARTMENTS, SUBJECTS } from '@/data/subjects';
import { DIM_LABEL } from '@/lib/dims';
import { profileFor } from '@/lib/engine';
import { TEAM_REPORTS } from '@/lib/team';

type Type = 'strengths' | 'challenges' | 'gaps' | 'support';
const TYPES: [Type, string, string][] = [
  ['strengths', 'Strengths', 'Strength'], ['challenges', 'Challenges', 'Challenge'],
  ['gaps', 'Transition gaps', 'Transition gap'], ['support', 'Faculty recommendations', 'Recommendation'],
];
interface Hit { country: string; subject: string; type: Type; text: string; detail: string; where: string; anchor: string; team: boolean }
const SORTED = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));

function buildIndex(): Hit[] {
  const hits: Hit[] = [];
  for (const c of COUNTRIES) for (const s of SUBJECTS) {
    const p = profileFor(c.id, s.id, 'late');
    if (!p) continue;
    p.strengths.forEach((f) => hits.push({ country: c.id, subject: s.id, type: 'strengths', text: f.text, detail: DIM_LABEL[f.dim], where: 'Indicative profile', anchor: 'profile', team: false }));
    p.gaps.forEach((f) => hits.push({ country: c.id, subject: s.id, type: 'gaps', text: f.text, detail: DIM_LABEL[f.dim], where: 'Indicative profile', anchor: 'profile', team: false }));
    p.watch.forEach((f) => hits.push({ country: c.id, subject: s.id, type: 'challenges', text: f.text, detail: DIM_LABEL[f.dim], where: 'Indicative profile', anchor: 'profile', team: false }));
    p.support.forEach((f) => hits.push({ country: c.id, subject: s.id, type: 'support', text: f.text, detail: DIM_LABEL[f.dim], where: 'Indicative profile', anchor: 'support', team: false }));
  }
  for (const r of TEAM_REPORTS) {
    const x = r.content;
    const add = (type: Type, text: string, detail: string, where: string) => hits.push({ country: r.country, subject: r.subject, type, text, detail, where, anchor: 'research', team: true });
    x.strengths.forEach((y) => add('strengths', y.area, y.evidence, 'Common strengths'));
    x.gaps.forEach((y) => add('gaps', y.area, y.impact, 'Common transition gaps'));
    x.profiles.forEach((p) => {
      p.strengths.forEach((t) => add('strengths', t, '', `Joined ${p.label.toLowerCase()}`));
      p.challenges.forEach((t) => add('challenges', t, '', `Joined ${p.label.toLowerCase()}`));
    });
    x.recommendations.forEach((y) => add('support', y.title, [y.lead, y.items.join(', ')].filter(Boolean).join(' '), 'Department recommendations'));
  }
  return hits;
}

export function SearchTool() {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') ?? '');
  const [country, setCountry] = useState(sp.get('country') ?? '');
  const [subject, setSubject] = useState(sp.get('subject') ?? '');
  const [type, setType] = useState<Type | ''>((sp.get('type') as Type) ?? '');
  const [source, setSource] = useState(sp.get('source') ?? '');
  const index = useMemo(buildIndex, []);
  const cName = (id: string) => COUNTRIES.find((c) => c.id === id)?.name ?? id;
  const sObj = (id: string) => SUBJECTS.find((s) => s.id === id);

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return index.filter((h) => {
      if (country && h.country !== country) return false;
      if (subject && (subject.startsWith('dept:') ? sObj(h.subject)?.department !== subject.slice(5) : h.subject !== subject)) return false;
      if (type && h.type !== type) return false;
      if (source === 'team' && !h.team) return false;
      if (source === 'indicative' && h.team) return false;
      if (!words.length) return true;
      const hay = `${h.text} ${h.detail} ${cName(h.country)} ${sObj(h.subject)?.name} ${sObj(h.subject)?.department}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    }).sort((a, b) => Number(b.team) - Number(a.team) || cName(a.country).localeCompare(cName(b.country)));
  }, [index, q, country, subject, type, source]);
  const label = (t: Type) => TYPES.find(([v]) => v === t)?.[2];

  return (
    <>
      <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="sr" htmlFor="q">Keywords</label>
        <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Keywords, for example academic writing" />
        <label className="sr" htmlFor="country">Country</label>
        <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>{SORTED.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="sr" htmlFor="subject">Subject or department</label>
        <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">All subjects</option>
          <optgroup label="Departments">{DEPARTMENTS.map((d) => <option key={d} value={`dept:${d}`}>{d} (all subjects)</option>)}</optgroup>
          <optgroup label="Subjects">{SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
        </select>
        <label className="sr" htmlFor="type">Finding type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value as Type | '')}>
          <option value="">All findings</option>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <label className="sr" htmlFor="source">Source</label>
        <select id="source" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All sources</option><option value="team">Research team only</option><option value="indicative">Indicative profiles only</option>
        </select>
      </form>
      <p className="count-line">{results.length} findings{results.length > 200 ? '. Showing the first 200; add a country or subject to narrow down.' : ''}</p>
      <div className="rows">
        {results.slice(0, 200).map((h, i) => (
          <Link key={i} className="row" href={`/countries/${h.country}/${h.subject}/#${h.anchor}`}>
            <span className="grow">
              <span className="t">{h.text}</span>
              {h.detail && <><br /><span className="s">{h.detail}</span></>}
              <br /><span className="s where">{cName(h.country)}, {sObj(h.subject)?.name}. {h.where}</span>
            </span>
            {h.team && <span className="prov team">Research team</span>}
            <span className={`tag ${h.type}`}>{label(h.type)}</span>
          </Link>
        ))}
        {!results.length && <p className="empty">No findings match. Try fewer filters or a different keyword.</p>}
      </div>
    </>
  );
}
