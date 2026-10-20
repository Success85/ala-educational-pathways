/** Presents an engine profile: at a glance, then each readiness dimension with the reasons behind it. */
import { DIMS, DIM_HELP, DIM_LABEL } from '@/lib/dims';
import type { Profile } from '@/lib/engine';
import { Rating } from './Rating';

export function Glance({ p }: { p: Profile }) {
  return (
    <section className="glance" aria-label="At a glance">
      <div className="glance-col good">
        <h3>What students bring</h3>
        {p.strengths.length ? <ul>{p.strengths.map((f) => <li key={f.dim}><b>{f.text}</b><span>{DIM_LABEL[f.dim]}</span></li>)}</ul>
          : <p className="s">No clear strengths stand out for this subject; check individual results.</p>}
      </div>
      <div className="glance-col gap">
        <h3>Where they may struggle</h3>
        {p.gaps.length || p.watch.length ? (
          <ul>
            {p.gaps.map((f) => <li key={f.dim}><b>{f.text}</b><span>{DIM_LABEL[f.dim]}: likely gap</span></li>)}
            {p.watch.slice(0, Math.max(0, 4 - p.gaps.length)).map((f) => <li key={f.dim}><b>{f.text}</b><span>{DIM_LABEL[f.dim]}: worth checking</span></li>)}
          </ul>
        ) : <p className="s">No major gaps expected.</p>}
      </div>
      <div className="glance-col act">
        <h3>Support to prioritise</h3>
        {p.support.length ? <ul>{p.support.slice(0, 4).map((f, i) => <li key={i}><b>{f.text}</b><span>{DIM_LABEL[f.dim]}</span></li>)}</ul>
          : <p className="s">Standard induction should be enough; monitor early assessments.</p>}
      </div>
    </section>
  );
}

export function DimTable({ p, showWhy = true }: { p: Profile; showWhy?: boolean }) {
  return (
    <div className="panel">
      <table className="ratings dims">
        <thead><tr><th>Readiness area</th><th>Rating</th></tr></thead>
        <tbody>
          {DIMS.filter((d) => p.subject.weights[d] > 0).map((d) => {
            const r = p.dims[d];
            return (
              <tr key={d}>
                <th scope="row">
                  {DIM_LABEL[d]}
                  <span className="dim-help">{p.subject.focus[d].replace(/^\w/, (m) => m.toUpperCase())}</span>
                  {showWhy && (
                    <details className="why no-print">
                      <summary>Why this rating?</summary>
                      <ol>{r.steps.map((s, i) => <li key={i}>{s.text}{s.delta ? <b className={s.delta > 0 ? 'up' : 'down'}> {s.delta > 0 ? `+${s.delta}` : s.delta}</b> : null}</li>)}</ol>
                    </details>
                  )}
                </th>
                <td><Rating value={r.label} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="s mt">{DIMS.filter((d) => p.subject.weights[d] > 0).length} areas, weighted for {p.subject.name}. {DIM_HELP.assessment}.</p>
    </div>
  );
}

export function ProfileView({ p }: { p: Profile }) {
  return (
    <div className="profile">
      <Glance p={p} />
      {p.care.length > 0 && (
        <div className="care">
          <h3>Context and wellbeing</h3>
          <ul>{p.care.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      )}
      <DimTable p={p} />
    </div>
  );
}
