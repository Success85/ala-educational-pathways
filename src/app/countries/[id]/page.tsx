import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COUNTRIES, countryById, regionName } from '@/data/countries';
import { SUBJECTS } from '@/data/subjects';
import { traditionById } from '@/data/traditions';
import { scaleById } from '@/data/grading';
import { profileFor } from '@/lib/engine';
import { COUNTRY_FINDINGS, TEAM_COMPARISONS, teamMatrixFor, teamReport } from '@/lib/team';
import { Rating } from '@/components/Rating';
import { Markdown } from '@/components/Markdown';
import { Trail } from '@/components/Trail';
import { EntryTabs } from '@/components/EntryTabs';
import { ConflictPanel, LanguageNote } from '@/components/ContextPanel';

export const generateStaticParams = () => COUNTRIES.map((c) => ({ id: c.id }));
export function generateMetadata({ params }: { params: { id: string } }) {
  return { title: countryById(params.id)?.name ?? 'Country' };
}

export default function CountryPage({ params }: { params: { id: string } }) {
  const c = countryById(params.id);
  if (!c) notFound();
  const t = traditionById(c.tradition);
  const scale = scaleById(c.grading);
  const findings = COUNTRY_FINDINGS[c.id];
  const comparisons = TEAM_COMPARISONS.filter((g) => g.countries.includes(c.id));
  const entries = [['late', `Joining ${c.entry.late.replace(/^After/, 'after')}`], ['early', `Joining ${c.entry.early.replace(/^After/, 'after')}`]] as const;

  const stops = [{ label: 'Country' }, { label: 'Education system' }, { label: 'Entry point' }, { label: 'Subject' }, { label: 'Cambridge benchmark' }, { label: 'Strengths and gaps' }, { label: 'Faculty support' }, { label: 'Unit plans' }];

  return (
    <>
      <Trail stops={stops} reached={3} />
      <p className="crumbs"><Link href="/explore/">Explore</Link> / <Link href={`/regions/${c.region}/`}>{regionName(c.region)}</Link></p>
      <div className="pagehead">
        <div>
          <h1>{c.name}</h1>
          <p className="sub"><Link href={`/systems/${t.id}/`}>{t.name}</Link>. Taught in {c.instruction}.</p>
        </div>
        <div className="actions no-print">
          <Link className="btn primary" href={`/student/?country=${c.id}`}>Build a student profile</Link>
          <Link className="btn" href={`/compare/?countries=${c.id}`}>Compare</Link>
        </div>
      </div>

      <section className="sec first" id="system">
        <h2>Education system</h2>
        <div className="two">
          <dl className="facts single">
            <div className="fact"><dt>Structure</dt><dd>{c.structure}</dd></div>
            <div className="fact"><dt>Final qualification</dt><dd>{c.qualification}</dd></div>
            <div className="fact"><dt>Examination body</dt><dd>{c.examBody.url ? <a href={c.examBody.url} target="_blank" rel="noopener noreferrer">{c.examBody.name}</a> : c.examBody.name}</dd></div>
            <div className="fact"><dt>Language of instruction</dt><dd>{c.instruction}{c.otherLanguages ? <span className="s"><br />Also: {c.otherLanguages}</span> : null}</dd></div>
            <div className="fact"><dt>Grading</dt><dd><Link href={`/grades/#${scale.id}`}>{scale.name}</Link></dd></div>
          </dl>
          <div className="panel">
            <h3>Stages</h3>
            <ol className="stages">{c.stages.map((s) => <li key={s.name}><b>{s.name}</b>{s.exam && <span>{s.exam}</span>}</li>)}</ol>
            <h3 className="mt">When students join ALA</h3>
            <ul className="entry-list">
              <li><b>{c.entry.early}</b><span>Earlier entry: more content still to learn at AS level.</span></li>
              <li><b>{c.entry.late}</b><span>After the national qualification.</span></li>
            </ul>
          </div>
        </div>
        {c.notes.length > 0 && <div className="callout col"><b>What to know</b><ul>{c.notes.map((n) => <li key={n}>{n}</li>)}</ul></div>}
        <LanguageNote country={c} />
        <ConflictPanel country={c} />
      </section>

      <section className="sec" id="subjects">
        <h2>Readiness by subject</h2>
        <p className="sub mb">Overall readiness for each ALA subject. Choose a subject for strengths, gaps, recommended support and unit plans.</p>
        <EntryTabs labels={entries.map(([, l]) => l)}>
          {entries.map(([entry]) => (
            <div key={entry} className="rows">
              {SUBJECTS.map((s) => {
                const p = profileFor(c.id, s.id, entry)!;
                const team = teamReport(c.id, s.id);
                const matrix = teamMatrixFor(c.id, s.id);
                const weakest = [...p.gaps, ...p.watch][0];
                return (
                  <Link key={s.id} className="row subject-row" href={`/countries/${c.id}/${s.id}/`}>
                    <span className="grow"><span className="t">{s.name}</span><br />
                      <span className="s">{s.department}{weakest ? `. Watch: ${weakest.text.toLowerCase()}` : ''}</span></span>
                    {(team || matrix) && <span className="prov team">Research team</span>}
                    <Rating value={p.overall.label} />
                  </Link>
                );
              })}
            </div>
          ))}
        </EntryTabs>
      </section>

      <section className="sec">
        <h2>Typical profile of students from this system</h2>
        <div className="two">
          <div className="finding strengths"><h3>Typical strengths</h3><ul>{t.strengths.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="finding gaps"><h3>Typical challenges</h3><ul>{t.challenges.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
      </section>

      {findings && (
        <section className="sec">
          <h2>Research team key findings</h2>
          <div className="two">
            <div className="panel"><Markdown text={findings.keyFindings} /></div>
            <div className="panel">
              <h3>Subjects ranked by readiness</h3>
              <p className="s mb">Strongest to weakest, as ranked by the research team.</p>
              <ol className="ranking">{findings.ranking.map((name) => {
                const s = SUBJECTS.find((x) => x.name.toLowerCase() === name.toLowerCase());
                return <li key={name}>{s ? <Link href={`/countries/${c.id}/${s.id}/`}>{name}</Link> : name}</li>;
              })}</ol>
            </div>
          </div>
        </section>
      )}

      {comparisons.length > 0 && (
        <section className="sec">
          <h2>Research team comparisons</h2>
          <div className="rows">{comparisons.map((g) => (
            <Link key={g.id} className="row" href={`/compare/research/${g.id}/`}><span className="grow"><span className="t">{g.name}</span><br /><span className="s">{g.description}</span></span><span className="prov team">Research team</span></Link>
          ))}</div>
        </section>
      )}

      {c.sources && c.sources.length > 0 && (
        <section className="sec"><h2>Sources</h2><ul className="prose">{c.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a></li>)}</ul></section>
      )}
    </>
  );
}
