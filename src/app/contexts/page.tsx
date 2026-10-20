import Link from 'next/link';
import { ALL_COUNTRY_INDICATORS, CONFLICT_COUNTRIES, CONFLICT_INDICATORS, type Indicator } from '@/data/contexts';
import { countryById } from '@/data/countries';
import { PrintButton } from '@/components/PrintButton';

export const metadata = { title: 'Learning contexts' };

function Card({ i }: { i: Indicator }) {
  return (
    <article className="indicator" id={i.id}>
      <p className={`prov ${i.source === 'research' ? 'team' : 'documented'}`}>{i.source === 'research' ? 'Research team observation' : 'Documented'}</p>
      <h3>{i.title}</h3>
      <p>{i.detail}</p>
      <p className="for-teachers"><b>For teachers:</b> {i.forTeachers}</p>
      {i.link && <p className="s">Source: <a href={i.link.url} target="_blank" rel="noopener noreferrer">{i.link.title}</a></p>}
    </article>
  );
}

export default function ContextsPage() {
  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Learning contexts</h1>
          <p className="sub">What a curriculum says is not always what students experienced. These indicators describe the conditions students learned in, and what teachers can do about them.</p>
        </div>
        <div className="actions no-print"><PrintButton /></div>
      </div>

      <section className="sec first" id="all">
        <h2>For students from every country</h2>
        <div className="indicators">{ALL_COUNTRY_INDICATORS.map((i) => <Card key={i.id} i={i} />)}</div>
      </section>

      <section className="sec" id="conflict">
        <h2>Conflict-affected and fragile contexts</h2>
        <p className="sub mb">Students from these countries or areas often learned in very different conditions from what the official curriculum describes. Profiles for these countries already allow for this; open &quot;Why this rating?&quot; on any report to see how.</p>
        <div className="rows mb">
          {CONFLICT_COUNTRIES.map((c) => {
            const country = countryById(c.id)!;
            return (
              <Link key={c.id} className="row" href={`/countries/${c.id}/`}>
                <span className="grow"><span className="t">{country.name}{c.area ? `: ${c.area}` : ''}</span><br /><span className="s">{c.note}</span></span>
              </Link>
            );
          })}
        </div>
        <div className="indicators">{CONFLICT_INDICATORS.map((i) => <Card key={i.id} i={i} />)}</div>
      </section>

      <section className="sec">
        <h2>Use it for one student</h2>
        <p className="prose">The <Link href="/student/">student profile tool</Link> lets you record where a student actually studied (including a country of asylum), whether their schooling was interrupted or conflict-affected, whether they mainly sat multiple-choice exams, came from a remote school, learned mainly in a home language, or met mixed teaching models. The profile adjusts and adds the matching support.</p>
        <p className="s mt">&quot;Research team observation&quot; marks points shared by the ALA research team that are still being verified against published sources.</p>
      </section>
    </>
  );
}
