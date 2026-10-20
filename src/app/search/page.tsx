import { Suspense } from 'react';
import { SearchTool } from '@/components/SearchTool';

export const metadata = { title: 'Search' };

export default function SearchPage() {
  return (
    <>
      <div className="pagehead"><div><h1>Search the findings</h1><p className="sub">Combine a country, a subject or department, and the kind of finding. For example: Kenya, Biology, transition gaps.</p></div></div>
      <Suspense fallback={<p className="empty">Loading…</p>}><SearchTool /></Suspense>
    </>
  );
}
