import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COUNTRIES, REGIONS } from '@/data/countries';
import { traditionById } from '@/data/traditions';
import { hasTeamResearch } from '@/lib/team';

export const generateStaticParams = () => REGIONS.map((r) => ({ id: r.id }));
export function generateMetadata({ params }: { params: { id: string } }) {
  return { title: REGIONS.find((r) => r.id === params.id)?.name ?? 'Region' };
}

export default function RegionPage({ params }: { params: { id: string } }) {
  const region = REGIONS.find((r) => r.id === params.id);
  if (!region) notFound();
  const cs = COUNTRIES.filter((c) => c.region === region.id).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <p className="crumbs"><Link href="/explore/">Explore</Link></p>
      <div className="pagehead"><div><h1>{region.name}</h1><p className="sub">{cs.length} countries. Choose one to see its education system and subject profiles.</p></div></div>
      <div className="rows">
        {cs.map((c) => (
          <Link key={c.id} className="row" href={`/countries/${c.id}/`}>
            <span className="grow"><span className="t">{c.name}</span><br /><span className="s">{c.qualification}. Taught in {c.instruction}.</span></span>
            <span className="chip">{traditionById(c.tradition).short}</span>
            {hasTeamResearch(c.id) && <span className="prov team">Research team</span>}
          </Link>
        ))}
      </div>
    </>
  );
}
