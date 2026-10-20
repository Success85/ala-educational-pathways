import Link from 'next/link';
import { notFound } from 'next/navigation';
import { commandWord, vocabFor } from '@/data/glossary';
import { SUBJECTS, subjectById } from '@/data/subjects';
import { PrintButton } from '@/components/PrintButton';

export const generateStaticParams = () => SUBJECTS.map((s) => ({ id: s.id }));
export function generateMetadata({ params }: { params: { id: string } }) {
  return { title: `${subjectById(params.id)?.name ?? 'Subject'} vocabulary` };
}

export default function SubjectVocabularyPage({ params }: { params: { id: string } }) {
  const s = subjectById(params.id);
  const v = vocabFor(params.id);
  if (!s || !v) notFound();
  return (
    <>
      <p className="crumbs"><Link href="/vocabulary/">Subject vocabulary</Link></p>
      <div className="pagehead">
        <div><p className="kicker">{s.department}</p><h1>{s.name}: key vocabulary</h1><p className="sub">The words students need to understand and use in {s.name} at ALA.</p></div>
        <div className="actions no-print"><PrintButton label="Print glossary" /><Link className="btn" href={`/subjects/${s.id}/`}>{s.name} across Africa</Link></div>
      </div>

      <section className="sec first">
        <h2>Key terms</h2>
        <div className="tablewrap">
          <table className="glossary">
            <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
            <tbody>{v.terms.map((t) => <tr key={t.term}><th scope="row">{t.term}</th><td>{t.meaning}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="sec">
        <h2>What questions ask for</h2>
        <p className="sub mb">Example {s.name} questions. The command word decides what a good answer looks like.</p>
        <div className="q-list">
          {v.questions.map((q) => {
            const cw = commandWord(q.word);
            return (
              <div key={q.question} className="q">
                <p className="q-text"><b className="q-word">{q.word}</b> {q.question}</p>
                {cw ? <p className="s"><Link href={`/vocabulary/#${cw.word.toLowerCase()}`}>{cw.word}</Link>: {cw.definition.toLowerCase()}. {cw.doThis}</p>
                  : <p className="s">A subject-specific instruction: do exactly what it says and show your working or reasoning.</p>}
              </div>
            );
          })}
        </div>
      </section>

      <p className="chips mt no-print"><Link className="chip" href="/vocabulary/">All command words</Link><Link className="chip" href={`/unit-plans/?subject=${s.id}`}>{s.name} unit plans</Link></p>
    </>
  );
}
