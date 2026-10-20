'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const ITEMS: [string, string][] = [
  ['/', 'Home'],
  ['/explore/', 'Explore'],
  ['/subjects/', 'Subjects'],
  ['/vocabulary/', 'Vocabulary'],
  ['/systems/', 'Systems'],
  ['/contexts/', 'Contexts'],
  ['/compare/', 'Compare'],
  ['/student/', 'Student profile'],
  ['/grades/', 'Grade guide'],
  ['/unit-plans/', 'Unit plans'],
  ['/search/', 'Search'],
];

export function Header() {
  const path = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Show the menu button whenever the links do not fit on one line next to the logo.
  // Measured from a hidden copy of the links, so it works for any screen size, font or zoom level.
  useIso(() => {
    const row = rowRef.current, brand = brandRef.current, measure = measureRef.current;
    if (!row || !brand || !measure) return;
    const check = () => {
      const cs = getComputedStyle(row);
      const inner = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const needed = brand.offsetWidth + 24 + measure.scrollWidth;
      setCompact(needed > inner);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(row);
    document.fonts?.ready.then(check).catch(() => {});
    return () => ro.disconnect();
  }, []);
  useEffect(() => { if (!compact) setOpen(false); }, [compact]);
    const active = (href: string) =>
    href === '/' ? path === '/' : href === '/explore/' ? path.startsWith('/explore') || path.startsWith('/regions') || path.startsWith('/countries') : path.startsWith(href);

  // Close the menu after navigating, and on Escape.
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`top${compact ? ' compact' : ''}${open ? ' menu-open' : ''}`}>
      <div className="top-in" ref={rowRef}>
        <div className="nav-measure" ref={measureRef} aria-hidden="true">
          {ITEMS.map(([href, label]) => <span key={href}>{label}</span>)}
        </div>
        <Link className="brand" href="/" ref={brandRef}><b>Educational Pathways</b><span>African Leadership Academy</span></Link>
        <button type="button" className="menu-btn" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen((o) => !o)}>
          <span className="menu-icon" aria-hidden="true"><i /><i /><i /></span>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="main-nav" className="main" aria-label="Main">
          {ITEMS.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active(href) ? 'page' : undefined}>{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
