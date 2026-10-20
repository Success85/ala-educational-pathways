'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { DEPARTMENTS, SUBJECTS } from '@/data/subjects';
import { UNIT_PLANS } from '@/data/unitPlans';
import { DIMS, DIM_LABEL } from '@/lib/dims';

export function PlanList() {
  const sp = useSearchParams();
  const [subject, setSubject] = useState(sp.get('subject') ?? '');
  const [target, setTarget] = useState('');
  const [kind, setKind] = useState('');
  const subj = (id: string) => SUBJECTS.find((s) => s.id === id);
  const plans = UNIT_PLANS.filter((u) => (!subject || (subject.startsWith('dept:') ? subj(u.subject)?.department === subject.slice(5) : u.subject === subject))
    && (!target || u.targets.includes(target as (typeof DIMS)[number])) && (!kind || u.kind === kind));
  return (
    <>
      <div className="filters">
        <select aria-label="Subject or department" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">All subjects</option>
          <optgroup label="Departments">{DEPARTMENTS.map((d) => <option key={d} value={`dept:${d}`}>{d}</option>)}</optgroup>
          <optgroup label="Subjects">{SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
        </select>
        <select aria-label="Gap addressed" value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="">Any gap</option>{DIMS.map((d) => <option key={d} value={d}>{DIM_LABEL[d]}</option>)}
        </select>
        <select aria-label="Kind" value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="">Bridging and core</option><option value="Bridging">Bridging units</option><option value="Core">Core units</option>
        </select>
      </div>
      <p className="count-line">{plans.length} unit plans</p>
      <div className="plans">
        {plans.map((u) => (
          <article key={u.id} id={u.id} className="plan">
            <p className="rec-n">{subj(u.subject)?.name}. {u.kind} unit, {u.year}, {u.timing}</p>
            <h2 className="h3">{u.title}</h2>
            <p className="s">{u.cambridge}</p>
            <p className="chips">{u.targets.map((d) => <span key={d} className="chip">{DIM_LABEL[d]}</span>)}</p>
            <h3 className="h4">Objectives</h3><ul>{u.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
            <h3 className="h4">Activities</h3><ul>{u.activities.map((o) => <li key={o}>{o}</li>)}</ul>
            <p className="s mt">Assessment: {u.assessment}</p>
            <p className="s"><Link href={`/subjects/${u.subject}/`}>{subj(u.subject)?.name} readiness across Africa</Link></p>
          </article>
        ))}
        {!plans.length && <p className="empty">No unit plans match. Try another filter.</p>}
      </div>
    </>
  );
}
