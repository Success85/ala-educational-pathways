import { Suspense } from 'react';
import { PlanList } from '@/components/PlanList';

export const metadata = { title: 'Unit plans' };

export default function UnitPlansPage() {
  return (
    <>
      <div className="pagehead"><div><h1>Unit plans</h1><p className="sub">Example bridging and core units, each linked to the transition gaps it helps close. They show how departments can turn the research into teaching; they are not official ALA documents.</p></div></div>
      <Suspense fallback={<p className="empty">Loading…</p>}><PlanList /></Suspense>
    </>
  );
}
