import Link from 'next/link';
import { DEPARTMENTS, SUBJECTS } from '@/data/subjects';

export const metadata = { title: 'Subjects' };

export default function SubjectsPage() {
  return (
    <>
      <div className="pagehead"><div><h1>Subjects</h1><p className="sub">Each ALA subject, its Cambridge or ALA benchmark, and how ready students from every African system are likely to be.</p></div></div>
      {DEPARTMENTS.map((d) => (
        <section key={d} className="block">
          <h2>{d}</h2>
          <div className="cards">
            {SUBJECTS.filter((s) => s.department === d).map((s) => (
              <Link key={s.id} href={`/subjects/${s.id}/`} className="card-link">
                <span className="card-title">{s.name}</span>
                <span className="s">{s.benchmark.title}{s.benchmark.code ? ` (${s.benchmark.code})` : ''}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
