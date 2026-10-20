import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COUNTRIES, REGIONS, regionName } from '@/data/countries';
import { SUBJECTS, subjectById } from '@/data/subjects';
import { TRADITIONS, traditionById } from '@/data/traditions';
import { plansFor } from '@/data/unitPlans';
import { DIMS, DIM_HELP, DIM_LABEL } from '@/lib/dims';
import { profileFor } from '@/lib/engine';
import { teamMatrixFor, teamReport } from '@/lib/team';
import { ReadinessTable, type ReadinessRow } from '@/components/ReadinessTable';

export const generateStaticParams = () => SUBJECTS.map((s) => ({ id: s.id }));
export function generateMetadata({ params }: { params: { id: string } }) {
  return { title: subjectById(params.id)?.name ?? 'Subject' };
}

export default function SubjectPage({ params }: { params: { id: string } }) {
  const s = subjectById(params.id);
  if (!s) notFound();
  const rows: ReadinessRow[] = COUNTRIES.map((c) => {
    const late = profileFor(c.id, s.id, 'late')!;
    const early = profileFor(c.id, s.id, 'early')!;
    const w = [...late.gaps, ...late.watch][0];
    return {
      id: c.id, name: c.name, region: c.region, regionName: regionName(c.region), tradition: c.tradition, traditionName: traditionById(c.tradition).short,
      late: late.overall, early: early.overall, watch: w ? w.text : '', team: !!(teamReport(c.id, s.id) || teamMatrixFor(c.id, s.id)),
    };
  });
  const plans = plansFor(s.id);
  const weights = DIMS.filter((d) => s.weights[d] > 0).sort((a, b) => s.weights[b] - s.weights[a]);

  return (
    <>
      <p className="crumbs"><Link href="/subjects/">Subjects</Link></p>
      <div className="pagehead"><div><p className="kicker">{s.department}</p><h1>{s.name}</h1><p className="sub">{s.benchmark.title}{s.benchmark.code ? ` (${s.benchmark.code})` : ''}. {s.benchmark.level}.</p></div></div>

      <section className="sec first">
        <h2>The benchmark</h2>
        <div className="two">
          <div className="panel">
            <p>{s.benchmark.summary}</p>
            <h3 className="mt">Components</h3>
            <ul>{s.benchmark.components.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="panel">
            <h3>What ALA expects</h3>
            <ul className="expects">{s.benchmark.expects.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="sec">
        <h2>What readiness means in {s.name}</h2>
        <div className="tablewrap">
          <table>
            <thead><tr><th>Readiness area</th><th>In {s.name}</th><th>Weight</th><th>If students are weak here</th></tr></thead>
            <tbody>{weights.map((d) => (
              <tr key={d}><th scope="row">{DIM_LABEL[d]}<span className="dim-help">{DIM_HELP[d]}</span></th><td>{s.focus[d].replace(/^\w/, (m) => m.toUpperCase())}</td><td>{'●'.repeat(s.weights[d])}<span className="sr">{s.weights[d]} of 3</span></td><td>{s.support[d]}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="sec">
        <h2>Readiness across Africa</h2>
        <p className="sub mb">Every country&apos;s indicative readiness for {s.name}. Use it to plan where support will be needed.</p>
        <ReadinessTable rows={rows} subjectId={s.id} regions={REGIONS} traditions={TRADITIONS.map((t) => ({ id: t.id, name: t.name }))} />
      </section>

      <section className="sec">
        <h2>Unit plans</h2>
        <div className="rows">{plans.map((u) => (
          <Link key={u.id} className="row" href={`/unit-plans/?subject=${s.id}#${u.id}`}><span className="grow"><span className="t">{u.title}</span><br /><span className="s">{u.kind} unit, {u.year}, {u.timing}. Targets: {u.targets.map((d) => DIM_LABEL[d].toLowerCase()).join(', ')}</span></span></Link>
        ))}</div>
      </section>
    </>
  );
}
