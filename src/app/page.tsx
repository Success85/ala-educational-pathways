import Link from 'next/link';
import { COUNTRIES } from '@/data/countries';
import { SUBJECTS } from '@/data/subjects';

// export const metadata = { title: 'Welcome' };

const HELPS: [string, string, string][] = [
  ['Know your students before the first lesson', 'See what students from each country studied, how they were taught and examined, and what they are likely to find new at ALA.', '/explore/'],
  ['Compare with the Cambridge benchmark', 'For every subject, see where students are strong and where they may struggle against Cambridge AS & A Level and ALA core course expectations.', '/subjects/'],
  ['Plan support that fits', 'Get practical faculty actions and example unit plans matched to the gaps students usually have.', '/unit-plans/'],
  ['Build a profile for one student', 'Enter a student\'s country, subjects, results and background for a personal profile you can save, print or share with colleagues.', '/student/'],
  ['Read national results', 'Understand grades from WASSCE, KCSE, the Baccalauréat and other national exams in plain terms.', '/grades/'],
  ['Understand learning contexts', 'Recognise when a student comes from a conflict-affected country, a remote school or a home-language background, and how to respond.', '/contexts/'],
  ['Teach subject vocabulary', 'Cambridge command words and key terms for every subject, ready to print for students.', '/vocabulary/'],
  ['Compare countries side by side', 'Put up to four education systems next to each other for one subject.', '/compare/'],
];

export default function WelcomePage() {
  return (
    <article className="welcome">
      <section className="welcome-hero">
        <p className="kicker">Welcome to Educational Pathways</p>
        <h1>Understand where every ALA student is coming from, and how to help them succeed.</h1>
        <p className="lede">ALA students arrive from across Africa, each shaped by a different school system. Educational Pathways is a reference tool for ALA faculty. It shows what students studied before ALA, how that compares with ALA&apos;s Cambridge and core curriculum, and what teachers can do to support them from the first week.</p>
        <p className="welcome-cta">
          <Link className="btn primary" href="/explore">Start exploring</Link>
          <Link className="btn" href="/student/">Build a student profile</Link>
        </p>
        <ul className="welcome-facts" aria-label="At a glance">
          <li><b>{COUNTRIES.length}</b> African countries</li>
          <li><b>{SUBJECTS.length}</b> ALA subjects and core courses</li>
          {/*<li><b>No login</b> open it and start</li>*/}
        </ul>
      </section>

      <section className="sec">
        <h2>Why it exists</h2>
        <div className="two">
          <div className="panel">
            <h3>The challenge</h3>
            <p>A class at ALA can include students from a dozen education systems: English, French, Portuguese and Arabic-medium; exam-heavy or practical; stable or disrupted by conflict. Gaps often only show after weeks of teaching, when students are already behind.</p>
          </div>
          <div className="panel">
            <h3>What this tool does</h3>
            <p>It brings the ALA research team&apos;s findings and published information about each country&apos;s system into one place, so teachers can anticipate those gaps and plan support from day one, rather than discovering them later.</p>
          </div>
        </div>
      </section>

      <section className="sec">
        <h2>What it helps you do</h2>
        <div className="welcome-grid">
          {HELPS.map(([t, d, href]) => (
            <Link key={t} href={href} className="welcome-card">
              <span className="card-title">{t}</span>
              <span>{d}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <h2>How to use it in three steps</h2>
        <ol className="welcome-steps">
          <li><b>Find the country.</b> Search for where the student studied, or browse by region. Read how its education system works.</li>
          <li><b>Open a subject.</b> Choose when the student joined ALA and see their readiness, strengths and gaps against the benchmark.</li>
          <li><b>Plan support.</b> Use the faculty actions, vocabulary lists and unit plans, or build a profile for one student.</li>
        </ol>
      </section>

      <section className="sec">
        <h2>Good to know</h2>
        <ul className="prose welcome-notes">
          <li><b>It is guidance, not a judgement.</b> Profiles describe typical students from a system. Every student is an individual; confirm with early assessment.</li>
          <li><b>It is not an admissions tool.</b> Ratings help teachers plan support. They are not scores for selecting students.</li>
          <li><b>You can see where content comes from.</b> &quot;Research team findings&quot; come from the ALA research team. &quot;Indicative profile&quot; is built from published information about each system. &quot;Why this rating?&quot; explains every rating.</li>
          <li><b>Nothing is stored on a server.</b> Saved student profiles stay in your own browser.</li>
        </ul>
        <p className="mt"><Link href="/about/">Read about the research and method</Link></p>
      </section>
    </article>
  );
}
