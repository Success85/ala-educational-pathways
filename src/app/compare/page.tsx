import Link from 'next/link';
import { Suspense } from 'react';
import { TEAM_COMPARISONS } from '@/lib/team';
import { CompareTool } from '@/components/CompareTool';

export const metadata = { title: 'Compare countries' };

export default function ComparePage() {
  return (
    <>
      <div className="pagehead"><div><h1>Compare countries</h1><p className="sub">Put up to four education systems side by side for one subject.</p></div></div>
      {TEAM_COMPARISONS.length > 0 && (
        <p className="callout">
          <b>Research team comparisons:</b>
          {TEAM_COMPARISONS.map((g) => <Link key={g.id} href={`/compare/research/${g.id}/`}>{g.name}</Link>)}
        </p>
      )}
      <Suspense fallback={<p className="empty">Loading…</p>}><CompareTool /></Suspense>
    </>
  );
}
