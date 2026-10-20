/** The research team's full subject sheet (Sections A–K), shown as written. */
import type { AnalysisContent } from '@/lib/research';
import { ratingScore } from '@/lib/research';
import { Impact, Rating, SupportLevel } from './Rating';
import { Markdown } from './Markdown';
import { EntryTabs } from './EntryTabs';

const severity = (impact: string) => (/significant|major|critical/i.test(impact) ? 3 : /moderate/i.test(impact) ? 2 : 1);
const maybeRating = (v: string) => (ratingScore(v) != null && v.split(' ').length <= 3 ? <Rating value={v} compact /> : v);

export function TeamReportView({ x, subjectName }: { x: AnalysisContent; subjectName: string }) {
  return (
    <div className="team-report">
      {x.overview.length > 0 && (
        <div className="block-sm">
          <h3>A. Curriculum overview</h3>
          <dl className="facts">{x.overview.map((r) => <div key={r.label} className="fact"><dt>{r.label}</dt><dd>{maybeRating(r.value)}</dd></div>)}</dl>
        </div>
      )}
      {x.profiles.length > 0 && (
        <div className="block-sm">
          <h3>B–C. Transition profiles by entry point</h3>
          <EntryTabs labels={x.profiles.map((p) => `Joined ${p.label.toLowerCase()}`)} ariaLabel="Research team entry profiles">
            {x.profiles.map((p, i) => (
              <div key={i} className="profile">
                <div className="panel">
                  <h4>{p.heading || 'Preparedness'}</h4>
                  <table className="ratings"><tbody>{p.ratings.map((r) => <tr key={r.area}><th scope="row">{r.area}</th><td><Rating value={r.rating} /></td></tr>)}</tbody></table>
                </div>
                <div className="two">
                  <div className="finding strengths"><h4>Typical strengths</h4><ul>{p.strengths.map((t) => <li key={t}>{t}</li>)}</ul></div>
                  <div className="finding gaps"><h4>Typical challenges</h4><ul>{p.challenges.map((t) => <li key={t}>{t}</li>)}</ul></div>
                </div>
              </div>
            ))}
          </EntryTabs>
        </div>
      )}
      <div className="two block-sm">
        <div className="panel"><h3>D. Common strengths</h3><table className="ratings"><tbody>{x.strengths.map((r) => <tr key={r.area}><th scope="row">{r.area}</th><td>{maybeRating(r.evidence)}</td></tr>)}</tbody></table></div>
        <div className="panel"><h3>E. Common transition gaps</h3><table className="ratings"><tbody>{[...x.gaps].sort((a, b) => severity(b.impact) - severity(a.impact)).map((r) => <tr key={r.area}><th scope="row">{r.area}</th><td><Impact value={r.impact} /></td></tr>)}</tbody></table></div>
      </div>
      <div className="two block-sm">
        {x.cambridge.length > 0 && <div className="panel"><h3>F. Against Cambridge {subjectName} expectations</h3><table className="ratings"><tbody>{x.cambridge.map((r) => <tr key={r.area}><th scope="row">{r.area}</th><td><Rating value={r.rating} /></td></tr>)}</tbody></table></div>}
        {x.ala.length > 0 && (
          <div className="panel"><h3>H. Against ALA expectations</h3>
            <table className="ratings"><thead><tr><th>Expectation</th><th>Preparedness</th><th>Support needed</th></tr></thead><tbody>
              {x.ala.map((r) => <tr key={r.expectation}><th scope="row">{r.expectation}</th><td><Rating value={r.preparedness} compact /></td><td><SupportLevel value={r.support} /></td></tr>)}
            </tbody></table>
          </div>
        )}
      </div>
      {x.neasc.some((r) => r.rating) && (
        <div className="panel block-sm"><h3>G. NEASC competencies</h3>
          <div className="tablewrap plain"><table className="ratings wide"><thead><tr><th>Competency</th><th>Readiness</th><th>Commentary</th></tr></thead><tbody>
            {x.neasc.filter((r) => r.rating).map((r) => <tr key={r.competency}><th scope="row">{r.competency}</th><td><Rating value={r.rating} compact /></td><td>{r.commentary}</td></tr>)}
          </tbody></table></div>
        </div>
      )}
      <div className="block-sm">
        <h3>I. Department recommendations</h3>
        <div className="recs">
          {x.recommendations.map((r, i) => (
            <div key={i} className="rec"><p className="rec-n">Recommendation {i + 1}</p><h4>{r.title}</h4>{r.lead && <p className="rec-lead">{r.lead}</p>}<ul>{r.items.map((t) => <li key={t}>{t}</li>)}</ul></div>
          ))}
        </div>
      </div>
      <div className="two block-sm">
        <div><h3>J. Departmental conclusion</h3><Markdown text={x.conclusion.summary} headingLevel={4} /></div>
        {x.conclusion.readiness.length > 0 && (
          <div className="panel"><h4>{x.conclusion.readinessTitle || 'Overall readiness'}</h4>
            <table className="ratings"><tbody>
              {x.conclusion.readiness.map((r) => <tr key={r.area}><th scope="row">{r.area}</th><td><Rating value={r.rating} /></td></tr>)}
              {x.conclusion.verdict && <tr className="total"><th scope="row">Overall</th><td>{x.conclusion.verdict}</td></tr>}
            </tbody></table>
          </div>
        )}
      </div>
      {x.extra.map((e) => <div key={e.title} className="panel block-sm"><h3>K. {e.title}</h3><Markdown text={e.body} headingLevel={4} /></div>)}
    </div>
  );
}
