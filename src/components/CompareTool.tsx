'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { COUNTRIES } from '@/data/countries';
import { SUBJECTS } from '@/data/subjects';
import { DIMS, DIM_LABEL } from '@/lib/dims';
import { profileFor, type Entry } from '@/lib/engine';
import { RatingLegend } from './Rating';

const SORTED = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
const DEFAULTS = ['nigeria', 'kenya', 'senegal', 'mozambique'];

export function CompareTool() {
  const router = useRouter();
  const sp = useSearchParams();
  const subject = SUBJECTS.find((s) => s.id === sp.get('subject'))?.id ?? 'biology';
  const entry: Entry = sp.get('entry') === 'early' ? 'early' : 'late';
  const fromUrl = (sp.get('countries') ?? '').split(',').filter((id) => COUNTRIES.some((c) => c.id === id));
  const ids = (fromUrl.length ? fromUrl : DEFAULTS).slice(0, 4);

  const update = (next: { subject?: string; entry?: Entry; ids?: string[] }) => {
    const q = new URLSearchParams({ subject: next.subject ?? subject, entry: next.entry ?? entry, countries: (next.ids ?? ids).join(',') });
    router.replace(`/compare/?${q.toString()}`, { scroll: false });
  };

  const profiles = useMemo(() => ids.map((id) => profileFor(id, subject, entry)!).filter(Boolean), [ids.join(), subject, entry]);
  const s = SUBJECTS.find((x) => x.id === subject)!;
  const dims = DIMS.filter((d) => s.weights[d] > 0);
  const diffs = dims.map((d) => {
    const sc = profiles.map((p) => p.dims[d].score);
    const max = Math.max(...sc), min = Math.min(...sc);
    return { d, gap: max - min, lead: profiles[sc.indexOf(max)]?.country.name, lag: profiles[sc.indexOf(min)]?.country.name };
  }).filter((x) => x.gap >= 2).sort((a, b) => b.gap - a.gap);

  return (
    <>
      <div className="compare-controls">
        <div className="field">
          <label htmlFor="cmp-subject">Subject</label>
          <select id="cmp-subject" value={subject} onChange={(e) => update({ subject: e.target.value })}>
            {SUBJECTS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cmp-entry">Entry point</label>
          <select id="cmp-entry" value={entry} onChange={(e) => update({ entry: e.target.value as Entry })}>
            <option value="late">After the national qualification</option>
            <option value="early">Before it (earlier entry)</option>
          </select>
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="field">
            <label htmlFor={`cmp-c${i}`}>Country {i + 1}</label>
            <select id={`cmp-c${i}`} value={ids[i] ?? ''} onChange={(e) => {
              const next = [...ids]; if (e.target.value) next[i] = e.target.value; else next.splice(i, 1);
              update({ ids: [...new Set(next.filter(Boolean))] });
            }}>
              <option value="">{i < 2 ? 'Choose a country' : 'None'}</option>
              {SORTED.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        ))}
      </div>

      {profiles.length < 2 ? <p className="empty">Choose at least two countries.</p> : (
        <>
          <div className="scoreboard">
            {profiles.map((p) => (
              <div key={p.country.id} className={`score cell s${p.overall.score}`}>
                <span className="s">{p.country.name}</span><b>{p.overall.label}</b>
              </div>
            ))}
            <p className="score-note">Overall readiness for {s.name}</p>
          </div>
          {diffs.length > 0 && <p className="callout"><b>Biggest differences:</b> {diffs.map((x) => `${DIM_LABEL[x.d]} (${x.lead} stronger than ${x.lag})`).join('; ')}.</p>}
          <RatingLegend />
          <div className="tablewrap">
            <table className="matrix">
              <thead><tr><th>Readiness area</th>{profiles.map((p) => <th key={p.country.id}><Link href={`/countries/${p.country.id}/${subject}/`}>{p.country.name}</Link></th>)}</tr></thead>
              <tbody>
                {dims.map((d) => (
                  <tr key={d}><th scope="row">{DIM_LABEL[d]}</th>{profiles.map((p) => <td key={p.country.id} className={`cell s${p.dims[d].score}`}>{p.dims[d].label}</td>)}</tr>
                ))}
                <tr><th scope="row">System</th>{profiles.map((p) => <td key={p.country.id} className="s">{p.tradition.short}; taught in {p.country.instruction}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <div className="compare-cards">
            {profiles.map((p) => (
              <div key={p.country.id} className="panel">
                <h3>{p.country.name}</h3>
                <h4>Brings</h4><ul>{p.strengths.slice(0, 3).map((f) => <li key={f.dim}>{f.text}</li>)}{!p.strengths.length && <li className="s">No clear strengths stand out</li>}</ul>
                <h4>May struggle with</h4><ul>{[...p.gaps, ...p.watch].slice(0, 3).map((f) => <li key={f.dim}>{f.text}</li>)}{!p.gaps.length && !p.watch.length && <li className="s">No major gaps expected</li>}</ul>
                <Link href={`/countries/${p.country.id}/${subject}/`}>Full profile</Link>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
