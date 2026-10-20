import Link from 'next/link';
import { COMMAND_GROUPS, COMMAND_WORDS, vocabFor } from '@/data/glossary';
import { DEPARTMENTS, SUBJECTS } from '@/data/subjects';
import { PrintButton } from '@/components/PrintButton';

export const metadata = { title: 'Subject vocabulary' };

export default function VocabularyPage() {
  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Subject vocabulary</h1>
          <p className="sub">Many students speak English well but have never been taught what an exam question is asking them to do. &quot;Describe&quot;, &quot;explain&quot; and &quot;evaluate&quot; ask for very different answers. Teach these words explicitly in every subject.</p>
        </div>
        <div className="actions no-print"><PrintButton /></div>
      </div>

      <section className="sec first">
        <h2>Cambridge command words</h2>
        <p className="no-print mb"><a href="#glossaries">Jump to the subject glossaries</a></p>
        <p className="sub mb">Cambridge International&apos;s official definitions, from the simplest to the most demanding, with what a strong answer does.</p>
        <ol className="ladder" aria-label="From recall to judgement">
          {COMMAND_GROUPS.map((g) => <li key={g.id}><b>{g.name}</b><span>{g.note}</span></li>)}
        </ol>
        {COMMAND_GROUPS.map((g) => (
          <div key={g.id} className="cw-group">
            <h3>{g.name}</h3>
            <div className="cw-grid">
              {COMMAND_WORDS.filter((c) => c.group === g.id).map((c) => (
                <article key={c.word} className="cw" id={c.word.toLowerCase()}>
                  <h4>{c.word}</h4>
                  <p className="cw-def">{c.definition}</p>
                  <p><b>Do:</b> {c.doThis}</p>
                  <p className="s"><b>Avoid:</b> {c.avoid}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="sec" id="glossaries">
        <h2>Glossaries by subject</h2>
        <p className="sub mb">Key terms and example Cambridge-style questions for each subject. Open one to print it for students.</p>
        <div className="gloss-depts">
          {DEPARTMENTS.map((d) => {
            const subs = SUBJECTS.filter((s) => s.department === d);
            return (
              <section key={d} className="gloss-dept">
                <h3>{d} <span className="s">{subs.length} {subs.length === 1 ? 'subject' : 'subjects'}</span></h3>
                <ul>
                  {subs.map((s) => {
                    const v = vocabFor(s.id);
                    return (
                      <li key={s.id}>
                        <Link href={`/vocabulary/${s.id}/`} className="gloss-link">
                          <span className="gloss-name">{s.name}</span>
                          <span className="gloss-meta">{s.benchmark.code ? `${s.benchmark.code} · ` : ''}{v ? `${v.terms.length} terms · ${v.questions.length} questions` : ''}</span>
                          <span className="gloss-arrow" aria-hidden="true">→</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
                  <p className="s mt">Source: <a href="https://www.cambridgeinternational.org/exam-administration/what-to-expect-on-exams-day/command-words/" target="_blank" rel="noopener noreferrer">Cambridge International command words</a>. Subject syllabuses may add their own command words.</p>
      </section>
    </>
  );
}