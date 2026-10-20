import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COUNTRIES } from '@/data/countries';
import { SUBJECTS } from '@/data/subjects';
import { TRADITIONS, traditionById } from '@/data/traditions';
import { DIMS, DIM_LABEL, LEVEL_LABEL } from '@/lib/dims';
import { profileFor } from '@/lib/engine';
import { Rating } from '@/components/Rating';

export const generateStaticParams = () => TRADITIONS.map((t) => ({ id: t.id }));
export function generateMetadata({ params }: { params: { id: string } }) {
  return { title: TRADITIONS.find((t) => t.id === params.id)?.name ?? 'System' };
}

export default function SystemPage({ params }: { params: { id: string } }) {
  const t = TRADITIONS.find((x) => x.id === params.id);
  if (!t) notFound();
  const cs = COUNTRIES.filter((c) => c.tradition === t.id).sort((a, b) => a.name.localeCompare(b.name));
  const avg = (subject: string) => {
    const scores = cs.map((c) => profileFor(c.id, subject, 'late')!.overall.score);
    return LEVEL_LABEL[Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)];
  };
  return (
    <>
      <p className="crumbs"><Link href="/systems/">Education systems</Link></p>
      <div className="pagehead"><div><h1>{traditionById(t.id).name}</h1><p className="sub">{t.summary}</p></div></div>

      <section className="sec first">
        <h2>Key features</h2>
        <ul className="prose">{t.features.map((f) => <li key={f}>{f}</li>)}</ul>
      </section>

      <section className="sec">
        <h2>What students typically bring</h2>
        <div className="two">
          <div className="finding strengths"><h3>Typical strengths</h3><ul>{t.strengths.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="finding gaps"><h3>Typical challenges</h3><ul>{t.challenges.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
        {t.languageSupport && <p className="callout"><b>Language support:</b> {t.languageSupport}.</p>}
      </section>

      <section className="sec">
        <h2>Typical starting point</h2>
        <p className="sub mb">Indicative readiness for a student completing the national qualification, before subject and country adjustments.</p>
        <div className="panel"><table className="ratings"><tbody>
          {DIMS.map((d) => <tr key={d}><th scope="row">{DIM_LABEL[d]}</th><td><Rating value={LEVEL_LABEL[t.baseline[d]]} /></td></tr>)}
        </tbody></table></div>
      </section>

      <section className="sec">
        <h2>Readiness by subject</h2>
        <p className="sub mb">Average across the {cs.length} countries in this group, for students joining after the national qualification.</p>
        <div className="rows">
          {SUBJECTS.map((s) => (
            <Link key={s.id} className="row" href={`/subjects/${s.id}/`}><span className="grow"><span className="t">{s.name}</span><br /><span className="s">{s.department}</span></span><Rating value={avg(s.id)} /></Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <h2>Countries</h2>
        <div className="rows">
          {cs.map((c) => (
            <Link key={c.id} className="row" href={`/countries/${c.id}/`}><span className="grow"><span className="t">{c.name}</span><br /><span className="s">{c.qualification}. Taught in {c.instruction}.</span></span></Link>
          ))}
        </div>
      </section>
    </>
  );
}
