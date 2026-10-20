import { SCALES, BAND_LABEL } from '@/data/grading';
import { GradeInterpreter } from '@/components/GradeInterpreter';

export const metadata = { title: 'Grade guide' };

export default function GradesPage() {
  return (
    <>
      <div className="pagehead"><div><h1>Grade guide</h1><p className="sub">How the main African secondary qualifications report results. Each grade keeps its original meaning, with a simple reading for ALA faculty.</p></div></div>
      <GradeInterpreter />
      <div className="scales">
        {SCALES.map((s) => (
          <section key={s.id} id={s.id} className="panel scale">
            <h2>{s.name}</h2>
            <p className="s">Used in: {s.usedIn}</p>
            <table className="ratings">
              <thead><tr><th>Grade</th><th>Meaning</th><th>Reading for ALA</th></tr></thead>
              <tbody>{s.grades.map((g) => (
                <tr key={g.grade}><th scope="row">{g.grade}{g.range && <span className="dim-help">{g.range}</span>}</th><td>{g.meaning}</td><td><span className={`band band-${g.band}`}>{BAND_LABEL[g.band]}</span></td></tr>
              ))}</tbody>
            </table>
            {s.note && <p className="s mt">{s.note}</p>}
            {s.source && <p className="s mt">Source: <a href={s.source.url} target="_blank" rel="noopener noreferrer">{s.source.title}</a></p>}
          </section>
        ))}
      </div>
    </>
  );
}
