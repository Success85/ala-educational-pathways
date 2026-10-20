'use client';
import Link from 'next/link';
import { useState } from 'react';
import { CONFLICT_COUNTRIES, conflictFor } from '@/data/contexts';

/** Home page: pick a country, see at a glance whether it is a stable or conflict-affected context. */
export function ContextCheck({ countries }: { countries: { id: string; name: string }[] }) {
  const [id, setId] = useState('');
  const name = (cid: string) => countries.find((c) => c.id === cid)?.name ?? cid;
  const ctx = id ? conflictFor(id) : undefined;
  const status = !id ? null : !ctx ? 'stable' : ctx.area ? 'partly' : 'conflict';

  return (
    <div className="ctx-check">
      <div className="ctx-check-pick">
        <label htmlFor="ctx-country"><b>Stable or conflict-affected?</b> Choose the country the student studied in.</label>
        <select id="ctx-country" value={id} onChange={(e) => setId(e.target.value)}>
          <option value="">Choose a country…</option>
          {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <p className="s">Conflict-affected: {CONFLICT_COUNTRIES.map((c, i) => (
          <span key={c.id}>{i ? ', ' : ''}<button type="button" className="linkish" onClick={() => setId(c.id)}>{c.area ? `eastern ${name(c.id)}` : name(c.id)}</button></span>
        ))}.</p>
      </div>

      {status && (
        <div className={`ctx-result ${status}`} role="status">
          <p className="ctx-status">
            {status === 'stable' && <>Stable context</>}
            {status === 'conflict' && <>Conflict-affected</>}
            {status === 'partly' && <>Conflict-affected in {ctx!.area}</>}
          </p>
          {status === 'stable' ? (
            <>
              <p>{name(id)} is not on the conflict-affected list. Still check, for every student:</p>
              <ul>
                <li>which language they actually learned in (it may be a home language),</li>
                <li>whether they came from a remote school with little lab or computer access,</li>
                <li>subject vocabulary and command words, and how to learn at ALA.</li>
              </ul>
            </>
          ) : (
            <>
              <p>{ctx!.note}</p>
              <ul>
                <li>Use a short diagnostic: the curriculum on paper may not be what was taught.</li>
                <li>Expect mostly multiple-choice exams and little lab or computer work; teach essay writing and practicals early.</li>
                <li>Plan wellbeing-aware support. Ask where they studied: refugees often follow the host country&apos;s system.</li>
              </ul>
              {status === 'partly' && <p className="s">Country profiles for {name(id)} are not adjusted, because conditions differ by region. Tick &quot;Studied in eastern DRC&quot; in the student profile.</p>}
            </>
          )}
          <p className="ctx-links">
            <Link className="btn small" href={`/countries/${id}/`}>Open {name(id)}</Link>
            <Link className="btn small" href={`/student/?country=${id}`}>Profile a student</Link>
            <Link className="btn small" href={status === 'stable' ? '/contexts/#all' : '/contexts/#conflict'}>Learning contexts</Link>
          </p>
        </div>
      )}
    </div>
  );
}
