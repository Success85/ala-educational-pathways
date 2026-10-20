import Link from 'next/link';

export type Stop = { label: string; href?: string };

/** The pathway every lookup follows; on a report it doubles as the section navigation. */
export function Trail({ stops, reached }: { stops: Stop[]; reached: number }) {
  return (
    <nav aria-label="Pathway" className="trail-wrap">
      <ol className="trail">
        {stops.map((s, i) => {
          const done = i < reached;
          const here = i === reached - 1;
          return (
            <li key={s.label} className={`${done ? 'done' : ''}${here ? ' here' : ''}`} aria-current={here ? 'step' : undefined}>
              {s.href && done ? (s.href.startsWith('#') ? <a href={s.href}>{s.label}</a> : <Link href={s.href}>{s.label}</Link>) : s.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
