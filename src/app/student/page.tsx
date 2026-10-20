import { Suspense } from 'react';
import { StudentTool } from '@/components/StudentTool';

export const metadata = { title: 'Student transition profile' };

export default function StudentPage() {
  return (
    <>
      <div className="pagehead no-print"><div><h1>Student transition profile</h1><p className="sub">Describe one student&apos;s previous schooling. The profile updates as you go and shows their likely strengths, gaps and the support to plan for each subject.</p></div></div>
      <Suspense fallback={<p className="empty">Loading…</p>}><StudentTool /></Suspense>
    </>
  );
}
