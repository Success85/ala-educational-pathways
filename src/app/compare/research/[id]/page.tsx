import Link from 'next/link';
import { notFound } from 'next/navigation';
import { countryById } from '@/data/countries';
import { subjectById } from '@/data/subjects';
import { ratingScore } from '@/lib/research';
import { TEAM_COMPARISONS } from '@/lib/team';
import { Markdown } from '@/components/Markdown';
import { RatingLegend } from '@/components/Rating';
import { EntryTabs } from '@/components/EntryTabs';
import { PrintButton } from '@/components/PrintButton';
import { TeamBadge } from '@/components/Provenance';

export const generateStaticParams = () => TEAM_COMPARISONS.map((g) => ({ id: g.id }));
export function generateMetadata({ params }: { params: { id: string } }) {
  return { title: TEAM_COMPARISONS.find((g) => g.id === params.id)?.name ?? 'Comparison' };
}

const Cell = ({ v }: { v?: string }) => { const s = ratingScore(v); return <td className={`cell${s ? ` s${s}` : ''}`}>{v || '—'}</td>; };

export default function TeamComparisonPage({ params }: { params: { id: string } }) {
  const g = TEAM_COMPARISONS.find((x) => x.id === params.id);
  if (!g) notFound();
  const cols = g.countries.map((id) => countryById(id)!);
  const overallRow = (rows: { area: string }[]) => rows.find((r) => /^overall/i.test(r.area));
  return (
    <>
      <p className="crumbs"><Link href="/compare/">Compare</Link></p>
      <div className="pagehead">
        <div><h1>{g.name}</h1><p className="sub">{g.description} <TeamBadge /></p></div>
        <div className="actions no-print"><PrintButton /></div>
      </div>

      <section className="sec first">
        <h2>Overall readiness by subject</h2>
        <RatingLegend />
        <div className="tablewrap">
          <table className="matrix">
            <thead><tr><th>Subject</th>{cols.map((c) => <th key={c.id}><Link href={`/countries/${c.id}/`}>{c.name}</Link></th>)}<th>What it means at ALA</th></tr></thead>
            <tbody>{g.matrices.map((m) => {
              const o = overallRow(m.rows) as (typeof m.rows)[number] | undefined;
              return <tr key={m.subject}><th scope="row"><a href={`#${m.subject}`}>{subjectById(m.subject)?.name}</a></th>{cols.map((c) => <Cell key={c.id} v={o?.ratings[c.id]} />)}<td>{o?.implication}</td></tr>;
            })}</tbody>
          </table>
        </div>
      </section>

      <section className="sec">
        <h2>Subject by subject</h2>
        <EntryTabs labels={g.matrices.map((m) => subjectById(m.subject)?.name ?? m.subject)} ariaLabel="Subjects">
          {g.matrices.map((m) => {
            const o = overallRow(m.rows);
            return (
              <div key={m.subject} id={m.subject}>
                <div className="tablewrap">
                  <table className="matrix">
                    <thead><tr><th>Area</th>{cols.map((c) => <th key={c.id}>{c.name}</th>)}<th>ALA transition implications</th></tr></thead>
                    <tbody>{m.rows.filter((r) => r !== o).map((r) => <tr key={r.area}><th scope="row">{r.area}</th>{cols.map((c) => <Cell key={c.id} v={r.ratings[c.id]} />)}<td>{r.implication}</td></tr>)}</tbody>
                  </table>
                </div>
                {m.conclusion && <div className="panel mt"><h3>Comparative conclusion</h3><Markdown text={m.conclusion} headingLevel={4} /></div>}
                <p className="chips mt no-print">{cols.map((c) => <Link key={c.id} className="chip" href={`/countries/${c.id}/${m.subject}/`}>{c.name}: full {subjectById(m.subject)?.name} profile</Link>)}</p>
              </div>
            );
          })}
        </EntryTabs>
      </section>
    </>
  );
}
