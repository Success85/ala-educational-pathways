import Link from 'next/link';
import { DIMS, DIM_HELP, DIM_LABEL } from '@/lib/dims';

export const metadata = { title: 'About the research and method' };

const SOURCES = [
  ['UNHCR, Refugee Education 2030: A Strategy for Refugee Inclusion (via INEE)', 'https://inee.org/resources/refugee-education-2030-strategy-refugee-inclusion'],
  ['Cambridge International, Command words', 'https://www.cambridgeinternational.org/exam-administration/what-to-expect-on-exams-day/command-words/'],
  ['DataReportal, Digital 2026: Eritrea', 'https://datareportal.com/reports/digital-2026-eritrea'],
  ['UN Office of the Special Representative for Children and Armed Conflict', 'https://childrenandarmedconflict.un.org/'],
  ['African Leadership Academy: Academics', 'https://www.africanleadershipacademy.org/the-academy/academics/'],
  ['African Leadership Academy (Wikipedia)', 'https://en.wikipedia.org/wiki/African_Leadership_Academy'],
  ['Cambridge International AS & A Level subjects and syllabus codes', 'https://en.wikipedia.org/wiki/List_of_Cambridge_International_Examinations_Advanced_Level_subjects'],
  ['West African Senior School Certificate Examination', 'https://en.wikipedia.org/wiki/West_African_Senior_School_Certificate_Examination'],
  ['Explainer: Kenya\'s first Grade 10 learners in 2026 (People Daily)', 'https://peopledaily.digital/news/explainer-what-awaits-kenyas-first-grade-10-learners-in-2026/amp'],
  ['UNEB explains new grading system (Daily Monitor, Uganda)', 'https://www.monitor.co.ug/uganda/news/national/uneb-explains-new-grading-system-under-revised-curriculum-4921732'],
  ['Education system Ethiopia (Nuffic)', 'https://www.nuffic.nl/en/node/217'],
  ['The Ethiopian University Entrance Exam Explained (uni2study)', 'https://www.uni2study.com/articles/ethiopian-university-entrance-exam-explained'],
  ['Understanding the new heritage-based curriculum (The Herald, Zimbabwe)', 'https://www.heraldonline.co.zw/understanding-the-new-heritage-based-curriculum-2/'],
  ['Thanaweya Amma to remain, baccalaureate optional (Ahram Online)', 'https://english.ahram.org.eg/NewsContent/1/2/549292/Egypt/Society/Thanaweya-Amma-to-remain-in-place%2C-baccalaureate-s.aspx'],
  ['Sudan: war disruption to education (allAfrica)', 'https://allafrica.com/stories/202507080009.html'],
  ['Rwanda NESA grading system (KT Press)', 'https://www.ktpress.rw/2022/08/rwanda-national-examination-body-introduces-new-grading-system/'],
  ['Ghana ready to roll out new SHS curriculum (GNA)', 'https://gna.org.gh/2024/11/ghana-ready-to-roll-out-new-shs-curriculum/'],
  ['FG to decide on proposed 12-year basic education (TheCable, Nigeria)', 'https://thecable.ng/fg-to-decide-on-proposed-adoption-of-12-year-basic-education-in-oct-2025'],
  ['Education in Namibia (Wikipedia)', 'https://en.wikipedia.org/wiki/Education_in_Namibia'],
  ['South Africa NSC grading scale (OpenEduCat)', 'https://openeducat.org/gradebook/south-africa-nsc/grading-scale/'],
];

export default function AboutPage() {
  return (
    <article className="about">
      <div className="pagehead"><div><h1>About the research and method</h1><p className="sub">Educational Pathways helps ALA faculty understand what students from across Africa studied before ALA, and how to support their transition into the Cambridge programme.</p></div></div>

      <section className="sec first">
        <h2>What the app is for</h2>
        <p className="prose">Students arrive at ALA from more than 40 countries and many different school systems, then all follow the same Cambridge-based programme in English. The app answers one question for teachers: <b>what is this student likely to bring, where might they struggle, and what can I do about it?</b> It follows the project&apos;s pathway: country, education system, entry point, subject, Cambridge benchmark, strengths and gaps, faculty support, unit plans.</p>
        <p className="prose">It is a faculty resource for teaching and support. It is not an admissions tool and does not score applicants.</p>
      </section>

      <section className="sec">
        <h2>Where the content comes from</h2>
        <div className="two">
          <div className="panel"><h3><span className="prov team">Research team findings</span></h3><p>Taken directly from the ALA Educational Pathways research sheets: the Burkina Faso Business Studies and Language Transition sheets (Sections A to K) and the Francophone comparison of Tunisia and Burkina Faso across eight subjects. Wording and ratings are the research team&apos;s own.</p></div>
          <div className="panel"><h3><span className="prov indicative">Indicative profiles</span></h3><p>Generated for every country and subject from the features of each education system: language of instruction, examinations, curriculum style, laboratory access and recent reforms. Every rating can be opened to see how it was reached. They show what to expect and check, not verified findings.</p></div>
        </div>
        <p className="prose mt">Country education-system details (structure, examinations, grading and reforms) were compiled from national examination bodies, ministries and the public sources listed below. Example unit plans are illustrative outlines, not official ALA documents.</p>
      </section>

      <section className="sec">
        <h2>How indicative profiles are built</h2>
        <ol className="prose method">
          <li><b>Education tradition.</b> Each country belongs to one of eight traditions (for example West African WAEC systems, Francophone Baccalauréat systems). Each tradition has a typical starting point on seven readiness areas.</li>
          <li><b>Subject.</b> Some traditions are stronger or weaker in particular subjects (for example, strong mathematics in Baccalauréat systems), and some subjects, such as Computer Science, are rarely taught in depth anywhere.</li>
          <li><b>Country.</b> Country-specific factors adjust the profile: Cambridge exams taken locally (Mauritius, Seychelles), a recent switch to English (Rwanda), Kiswahili-medium primary school (Tanzania), or the Central African Republic&apos;s disrupted school system.</li>
          <li><b>Learning context.</b> For conflict-affected countries (Somalia, Eritrea, Sudan, South Sudan, Chad, and eastern DRC in the student tool), the profile allows for disrupted schooling, little practical work and mostly multiple-choice exams. See <Link href="/contexts/">Learning contexts</Link>.</li>
          <li><b>Entry point.</b> Students joining before completing the national qualification have more content still to learn; non-English-medium students have had fewer years of English.</li>
          <li><b>The individual student</b> (student profile tool only). National results, the language they learned in, laboratory experience, research projects, computing access, and learning context (where they actually studied, interrupted schooling, remote schools, home language, mixed teaching models) adjust the profile further.</li>
        </ol>
        <p className="prose">Ratings use the research team&apos;s scale: Low, Low-Moderate, Moderate, Moderate-High, High, Very High. Overall readiness is a weighted average, with weights set by what matters most in each subject.</p>
        <div className="tablewrap mt"><table><thead><tr><th>Readiness area</th><th>What it means</th></tr></thead><tbody>{DIMS.map((d) => <tr key={d}><th scope="row">{DIM_LABEL[d]}</th><td>{DIM_HELP[d]}</td></tr>)}</tbody></table></div>
      </section>

      <section className="sec">
        <h2>Limits</h2>
        <ul className="prose">
          <li>Profiles describe typical students from a system. Schools within a country differ greatly, and every student is an individual.</li>
          <li>Education systems change. Check the examination body for the latest structure and grading.</li>
          <li>Indicative profiles should be replaced by research team findings as the research covers more countries.</li>
        </ul>
      </section>

      <section className="sec">
        <h2>Sources consulted</h2>
        <ul className="prose">{SOURCES.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noopener noreferrer">{t}</a></li>)}</ul>
        <p className="s mt">Examination bodies are linked on each country page. <Link href="/grades/">Grading scales</Link> list their own sources.</p>
      </section>
    </article>
  );
}
