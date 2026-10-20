import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: { default: 'Educational Pathways', template: '%s | Educational Pathways' },
  description: 'How African education systems compare with the ALA Cambridge curriculum, and how faculty can support students in transition.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='46' fill='%237B2332'/><path d='M30 62 L50 30 L70 62' stroke='%23C6A96A' stroke-width='8' fill='none'/></svg>" />
      </head>
      <body>
        <Header />
        <main className="page">{children}</main>
        <footer className="site-foot">
          <div className="site-foot-in">
            <p><b>Educational Pathways</b><br />How students from across Africa transition into ALA&apos;s Cambridge programme.</p>
            <p>Research-based guidance for faculty, not an admissions tool.<br /><Link href="/">Welcome and how to use it</Link> · <Link href="/about/">About the research and method</Link></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
