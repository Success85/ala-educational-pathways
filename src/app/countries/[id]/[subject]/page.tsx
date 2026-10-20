import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COUNTRIES, countryById, regionName } from '@/data/countries';
import { SUBJECTS, subjectById } from '@/data/subjects';
import { plansFor } from '@/data/unitPlans';
import { profileFor, type Entry } from '@/lib/engine';
import { DIM_LABEL } from '@/lib/dims';
import { profileMarkdown } from '@/lib/exportMd';
import { teamMatrixFor, teamReport } from '@/lib/team';
import { ratingScore } from '@/lib/research';
import { Rating } from '@/components/Rating';
import { Trail } from '@/components/Trail';
import { EntryTabs } from '@/components/EntryTabs';
import { ProfileView } from '@/components/ProfileView';
import { TeamReportView } from '@/components/TeamReportView';
import { Markdown } from '@/components/Markdown';
import { PrintButton } from '@/components/PrintButton';
import { DownloadButton } from '@/components/DownloadButton';
import { IndicativeBadge, TeamBadge } from '@/components/Provenance';
import { ConflictPanel, EveryStudent } from '@/components/ContextPanel';

export const generateStaticParams = () => COUNTRIES.flatMap((c) => SUBJECTS.map((s) => ({ id: c.id, subject: s.id })));
export function generateMetadata({ params }: { params: { id: string; subject: string } }) {
  return { title: `${subjectById(params.subject)?.name ?? 'Subject'}: ${countryById(params.id)?.name ?? ''}` };
}

export default function SubjectReport({ params }: { params: { id: string; subject: string } }) {
  const c = countryById(params.id);
  const s = subjectById(params.subject);
  if (!c || !s) notFound();
  const late = profileFor(c.id, s.id, 'late')!;
  const early = profileFor(c.id, s.id, 'early')!;
  const team = teamReport(c.id, s.id);
  const matrix = teamMatrixFor(c.id, s.id);
  const plans = plansFor(s.id);
  const gapDims = new Set([...late.gaps, ...late.watch, ...early.gaps, ...early.watch].map((f) => f.dim));
  const tabs: [Entry, string][] = [['late', `Joined ${c.entry.late.replace(/^After/, 'after')}`], ['early', `Joined ${c.entry.early.replace(/^After/, 'after')}`]];
  const peers = matrix ? matrix.comparison.countries.filter((id) => id !== c.id).map((id) => countryById(id)!) : [];
  const otherSubjects = SUBJECTS.filter((x) => x.id !== s.id);

  const stops = [
    { label: 'Country', href: `/countries/${c.id}/` },
    { label: 'Education system', href: `/countries/${c.id}/#system` },
    { label: 'Entry point', href: '#profile' },
    { label: 'Subject', href: '#profile' },
    { label: 'Cambridge benchmark', href: '#benchmark' },
    { label: 'Strengths and gaps', href: '#profile' },
    { label: 'Faculty support', href: '#support' },
    { label: 'Unit plans', href: '#plans' },
  ];

  const md = profileMarkdown(`${s.name}: students from ${c.name}`, [{ label: tabs[0][1], p: late }, { label: tabs[1][1], p: early }],
    team ? ['', '## Research team findings', '', `See the full research sheet in the app: ${team.title}. Overall readiness (research team): ${team.content.conclusion.verdict || team.overall}.`] : []);

  return (
    <article className="report">
      <p className="crumbs"><Link href="/explore/">Explore</Link> / <Link href={`/regions/${c.region}/`}>{regionName(c.region)}</Link> / <Link href={`/countries/${c.id}/`}>{c.name}</Link></p>

      <header className="report-head">
        <div className="report-title">
          <p className="kicker">{c.name}, {c.qualification}</p>
          <h1>{s.name}</h1>
          <p className="sub">Benchmark: {s.benchmark.title}{s.benchmark.code ? ` (${s.benchmark.code})` : ''}</p>
          <p className="badges">{team || matrix ? <TeamBadge /> : null}<IndicativeBadge /></p>
        </div>
        <div className="verdict">
          <p className="verdict-label">Overall readiness for ALA</p>
          <div className="verdict-rows">
            <div><span className="s">{tabs[0][1]}</span><Rating value={late.overall.label} /></div>
            <div><span className="s">{tabs[1][1]}</span><Rating value={early.overall.label} /></div>
            {team && <div><span className="s">Research team rating</span><Rating value={team.overall} /></div>}
            {!team && matrix?.overall && <div><span className="s">Research team rating</span><Rating value={matrix.overall.ratings[c.id]} /></div>}
          </div>
        </div>
        <div className="actions no-print">
          <PrintButton />
          <DownloadButton filename={`${c.id}-${s.id}-profile.md`} content={md} label="Download" />
          <Link className="btn" href={`/student/?country=${c.id}&subjects=${s.id}`}>Profile one student</Link>
          <Link className="btn" href={`/compare/?subject=${s.id}&countries=${[c.id, ...peers.map((p) => p.id)].join(',')}`}>Compare countries</Link>
        </div>
      </header>

      <Trail stops={stops} reached={stops.length} />

      {team && (
        <p className="callout no-print"><b>The ALA research team has a full {s.name} sheet for {c.name}.</b> <a href="#research">Jump to the research team findings</a></p>
      )}

      <ConflictPanel country={c} compact />

      <section className="sec first" id="profile">
        <h2>Transition profile</h2>
        <p className="sub mb">Choose when the student joined ALA. The profile is generated from the features of {c.name}&apos;s system; open &quot;Why this rating?&quot; to see each step.</p>
        <EntryTabs labels={tabs.map(([, l]) => l)}>
          {[late, early].map((p, i) => <ProfileView key={i} p={p} />)}
        </EntryTabs>
        <p className="disclaimer">Indicative, research-based guidance about typical preparation in this system. It is not an admissions score, and individual students vary.</p>
      </section>

      <section className="sec" id="benchmark">
        <h2>Cambridge benchmark</h2>
        <div className="two">
          <div className="panel">
            <h3>{s.benchmark.title}{s.benchmark.code ? ` (${s.benchmark.code})` : ''}</h3>
            <p className="s mb">{s.benchmark.level}</p>
            <p>{s.benchmark.summary}</p>
            <h4 className="mt">Components</h4>
            <ul>{s.benchmark.components.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="panel">
            <h3>What ALA expects of students</h3>
            <ul className="expects">{s.benchmark.expects.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="mt"><Link href={`/vocabulary/${s.id}/`}>{s.name} key terms and command words</Link></p>
          </div>
        </div>
      </section>

      {matrix && (
        <section className="sec" id="comparison">
          <h2>Research team comparison</h2>
          <p className="sub mb">{matrix.comparison.name}. <TeamBadge /></p>
          <div className="tablewrap">
            <table className="matrix">
              <thead><tr><th>Area</th><th>{c.name}</th>{peers.map((p) => <th key={p.id}>{p.name}</th>)}<th>ALA transition implications</th></tr></thead>
              <tbody>
                {matrix.matrix.rows.map((r) => (
                  <tr key={r.area} className={/^overall/i.test(r.area) ? 'total' : ''}>
                    <th scope="row">{r.area}</th>
                    {[c, ...peers].map((x) => { const v = r.ratings[x.id] ?? ''; const sc = ratingScore(v); return <td key={x.id} className={`cell${sc ? ` s${sc}` : ''}`}>{v || '—'}</td>; })}
                    <td>{r.implication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {matrix.matrix.conclusion && <div className="panel mt"><h3>Comparative conclusion</h3><Markdown text={matrix.matrix.conclusion} headingLevel={4} /></div>}
        </section>
      )}

      {team && (
        <section className="sec" id="research">
          <h2>Research team findings</h2>
          <p className="sub mb">{team.title}. {team.content.benchmark} <TeamBadge /></p>
          <TeamReportView x={team.content} subjectName={s.name} />
        </section>
      )}

      <section className="sec" id="support">
        <h2>Faculty support</h2>
        <EveryStudent subjectId={s.id} subjectName={s.name} />
        <div className="two">
          {[late, early].map((p, i) => (
            <div key={i} className="panel">
              <h3>{tabs[i][1]}</h3>
              {p.support.length ? <ol className="support-list">{p.support.map((f, j) => <li key={j}><b>{f.text}</b><span>{DIM_LABEL[f.dim]}</span></li>)}</ol> : <p className="s">No targeted support expected beyond normal induction.</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="sec" id="plans">
        <h2>Unit plans</h2>
        <p className="sub mb">Example {s.name} unit plans. Plans marked &quot;Matches a gap&quot; target an area this profile flags.</p>
        <div className="plans">
          {plans.map((u) => {
            const hits = u.targets.filter((d) => gapDims.has(d));
            return (
              <div key={u.id} className="plan">
                <p className="rec-n">{u.kind} unit, {u.year}, {u.timing}</p>
                <h3>{u.title}</h3>
                <p className="s">{u.cambridge}</p>
                {hits.length > 0 && <p className="match">Matches a gap: {hits.map((d) => DIM_LABEL[d].toLowerCase()).join(', ')}</p>}
                <details><summary>Objectives and activities</summary>
                  <h4>Objectives</h4><ul>{u.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
                  <h4>Activities</h4><ul>{u.activities.map((o) => <li key={o}>{o}</li>)}</ul>
                  <p className="s mt">Assessment: {u.assessment}</p>
                </details>
              </div>
            );
          })}
        </div>
        <p className="s mt"><Link href={`/unit-plans/?subject=${s.id}`}>All {s.name} unit plans</Link></p>
      </section>

      <section className="sec no-print">
        <h2>Other subjects for {c.name}</h2>
        <div className="chips">{otherSubjects.map((x) => <Link key={x.id} className="chip" href={`/countries/${c.id}/${x.id}/`}>{x.name}</Link>)}</div>
      </section>
    </article>
  );
}
