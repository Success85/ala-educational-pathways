import { ratingScore } from '@/lib/research';

/** A research rating such as "Moderate-High", shown as a six-step bar with its label. */
export function Rating({ value, compact = false }: { value?: string | null; compact?: boolean }) {
  const label = (value ?? '').trim();
  const score = ratingScore(label);
  if (!label) return <span className="rating none">Not rated</span>;
  if (score == null) return <span className="rating text">{label}</span>;
  return (
    <span className={`rating s${score}${compact ? ' compact' : ''}`} title={label}>
      <span className="bar" aria-hidden="true">{[1, 2, 3, 4, 5, 6].map((i) => <i key={i} className={i <= score ? 'on' : ''} />)}</span>
      <span className="lab">{label}</span>
    </span>
  );
}

/** Support needed (Low → Very High) reads the other way: more support = more attention. */
export function SupportLevel({ value }: { value?: string | null }) {
  const label = (value ?? '').trim();
  const score = ratingScore(label) ?? 0;
  const level = score >= 6 ? 'urgent' : score >= 5 ? 'high' : score >= 3 ? 'mid' : 'low';
  return label ? <span className={`support ${level}`}>{label}</span> : <span className="rating none">Not rated</span>;
}

/** "Significant challenge" / "Moderate challenge" tags. */
export function Impact({ value }: { value: string }) {
  const v = value.toLowerCase();
  const level = /significant|major|high|critical/.test(v) ? 'high' : /moderate/.test(v) ? 'mid' : 'low';
  return <span className={`support ${level === 'high' ? 'urgent' : level}`}>{value}</span>;
}

/** Legend for rating colours. */
export function RatingLegend() {
  return (
    <p className="legend" aria-label="Rating scale">
      <span>Readiness scale</span>
      {['Low', 'Low-Moderate', 'Moderate', 'Moderate-High', 'High', 'Very High'].map((l) => (
        <span key={l} className={`cell s${ratingScore(l)}`}>{l}</span>
      ))}
    </p>
  );
}
