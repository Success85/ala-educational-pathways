import Link from 'next/link';
import { COUNTRIES } from '@/data/countries';
import { TRADITIONS } from '@/data/traditions';

export const metadata = { title: 'Education systems' };

export default function SystemsPage() {
  return (
    <>
      <div className="pagehead"><div><h1>Education systems</h1><p className="sub">African countries grouped by the education tradition they share: language of instruction, examinations and teaching style. Students from the same tradition tend to bring similar strengths and face similar transitions.</p></div></div>
      <div className="rows">
        {TRADITIONS.map((t) => {
          const cs = COUNTRIES.filter((c) => c.tradition === t.id).sort((a, b) => a.name.localeCompare(b.name));
          return (
            <Link key={t.id} href={`/systems/${t.id}/`} className="row">
              <span className="grow"><span className="t">{t.name}</span><br /><span className="s">{cs.map((c) => c.name).join(', ')}</span></span>
              <span className="chip">{t.language}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
