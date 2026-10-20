import Link from 'next/link';
import { COUNTRIES, REGIONS } from '@/data/countries';
import { TRADITIONS } from '@/data/traditions';
import { SUBJECTS } from '@/data/subjects';
import { TEAM_COMPARISONS, TEAM_REPORTS } from '@/lib/team';
import { CountryFinder } from '@/components/CountryFinder';
import { ContextCheck } from '@/components/ContextCheck';

const STEPS = ['Country', 'Education system', 'Entry point', 'Subject', 'Cambridge benchmark', 'Strengths and gaps', 'Faculty support', 'Unit plans'];

export const metadata = { title: 'Explore' };
export default function Home() {
  const countries = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <section className="hero">
        {/*<p className="welcome-banner"><span>New here? See what this tool does for ALA teachers.</span> <Link className="btn small primary" href="/welcome/">Read the welcome</Link></p>*/}
        <h1>Where is your student coming from?</h1>
        <p className="lede">See what students from any African country studied before ALA, how it compares with the Cambridge curriculum, and how to support them in each subject.</p>
        <CountryFinder countries={countries.map((c) => ({ id: c.id, name: c.name }))} />
        <ol className="pathway" aria-label="How a lookup works">{STEPS.map((s) => <li key={s}>{s}</li>)}</ol>
      </section>

      <section className="block">
        <ContextCheck countries={countries.map((c) => ({ id: c.id, name: c.name }))} />
      </section>

      <section className="block">
        <div className="starts">
          <Link href="/student/" className="start primary-start">
            <span className="card-title">Build a student transition profile</span>
            <span>Enter one student&apos;s country, entry point, subjects and results. Get a printable profile with support priorities.</span>
          </Link>
          <Link href="/compare/" className="start">
            <span className="card-title">Compare countries</span>
            <span>Put up to four systems side by side for one subject.</span>
          </Link>
          <Link href="/subjects/" className="start">
            <span className="card-title">Browse by subject</span>
            <span>The Cambridge benchmark and readiness of every country for {SUBJECTS.length} ALA subjects.</span>
          </Link>
          <Link href="/grades/" className="start">
            <span className="card-title">Read a national result</span>
            <span>WASSCE, KCSE, UCE, Baccalauréat and more, explained.</span>
          </Link>
          <Link href="/vocabulary/" className="start">
            <span className="card-title">Teach subject vocabulary</span>
            <span>Cambridge command words and key terms for every subject.</span>
          </Link>
          <Link href="/contexts/" className="start">
            <span className="card-title">Understand learning contexts</span>
            <span>Conflict-affected countries, remote schools, home languages and more.</span>
          </Link>
        </div>
      </section>

      <section className="block">
        <h2>Countries by region</h2>
        <div className="region-lists">
          {REGIONS.map((r) => {
            const cs = countries.filter((c) => c.region === r.id);
            return (
              <div key={r.id} className="region-list">
                <h3><Link href={`/regions/${r.id}/`}>{r.name}</Link></h3>
                <ul>{cs.map((c) => <li key={c.id}><Link href={`/countries/${c.id}/`}>{c.name}</Link></li>)}</ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="block">
        <h2>Research team findings</h2>
        <div className="cards">
          {TEAM_REPORTS.map((r) => {
            const c = COUNTRIES.find((x) => x.id === r.country);
            const s = SUBJECTS.find((x) => x.id === r.subject);
            return (
              <Link key={r.country + r.subject} href={`/countries/${r.country}/${r.subject}/`} className="card-link">
                <span className="prov team">Research team</span>
                <span className="card-title">{s?.name}: {c?.name}</span>
                <span className="s">Full sheet, Sections A to K. Overall readiness: {r.overall}</span>
              </Link>
            );
          })}
          {TEAM_COMPARISONS.map((g) => (
            <Link key={g.id} href={`/compare/research/${g.id}/`} className="card-link">
              <span className="prov team">Research team</span>
              <span className="card-title">{g.name}</span>
              <span className="s">{g.matrices.length} subjects compared side by side</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="block">
        <h2>Education systems</h2>
        <p className="sub mb">Countries that share a language of instruction and examination model tend to prepare students in similar ways.</p>
        <div className="cards">
          {TRADITIONS.map((t) => (
            <Link key={t.id} href={`/systems/${t.id}/`} className="card-link">
              <span className="card-title">{t.name}</span>
              <span className="s">{(() => { const n = COUNTRIES.filter((c) => c.tradition === t.id).length; return `${n} ${n === 1 ? 'country' : 'countries'}`; })()}. Taught in {t.language}.</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="block">
        <h2>Try a search</h2>
        <div className="chips big">
          <Link className="chip" href="/search/?country=kenya&subject=biology&type=gaps">Kenya, Biology, transition gaps</Link>
          <Link className="chip" href="/search/?country=burkina-faso&subject=dept:Humanities&q=writing">Burkina Faso, Humanities, academic writing</Link>
          <Link className="chip" href="/search/?country=sudan&subject=dept:Sciences&q=practical">Sudan, Sciences, practical skills</Link>
          <Link className="chip" href="/search/?type=support&q=English">Support for academic English</Link>
        </div>
      </section>
    </>
  );
}
