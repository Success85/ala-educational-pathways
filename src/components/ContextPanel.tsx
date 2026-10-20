import Link from 'next/link';
import { ALL_COUNTRY_INDICATORS, CONFLICT_INDICATORS, conflictFor } from '@/data/contexts';
import type { Country } from '@/data/countries';

/** Conflict-affected context for a country, shown on country and report pages. */
export function ConflictPanel({ country, compact = false }: { country: Country; compact?: boolean }) {
  const ctx = conflictFor(country.id);
  if (!ctx) return null;
  const shown = compact ? CONFLICT_INDICATORS.slice(0, 4) : CONFLICT_INDICATORS;
  return (
    <section className="context-panel" aria-label="Conflict-affected context">
      <p className="context-kicker">{ctx.area ? `Conflict-affected context in ${ctx.area}` : 'Conflict-affected context'}</p>
      <p className="context-note">{ctx.note}</p>
      {ctx.area
        ? <p className="s">Ratings on this site describe the national system. For a student from {ctx.area}, switch on &quot;conflict-affected schooling&quot; in the <Link href={`/student/?country=${country.id}`}>student profile tool</Link>.</p>
        : <p className="s">Ratings for {country.name} already allow for this context; open &quot;Why this rating?&quot; to see each adjustment.</p>}
      <ul className="context-list">
        {shown.map((i) => <li key={i.id}><b>{i.title}.</b> {i.forTeachers}</li>)}
      </ul>
      <p className="s"><Link href="/contexts/#conflict">All conflict-affected indicators and sources</Link></p>
    </section>
  );
}

/** Reminder for every country: do not assume the language from the label. */
export function LanguageNote({ country }: { country: Country }) {
  if (!country.otherLanguages) return null;
  return (
    <p className="callout lang-note">
      <b>Check the student&apos;s languages.</b> Many students from {country.name} speak {country.otherLanguages.replace(/;.*$/, '')} at home and may be less comfortable in {country.instruction.split(/[(,]/)[0].trim()} than the label suggests.
    </p>
  );
}

/** Support that applies to every student, whatever their background. */
export function EveryStudent({ subjectId, subjectName }: { subjectId?: string; subjectName?: string }) {
  const [vocab, learn] = [ALL_COUNTRY_INDICATORS[0], ALL_COUNTRY_INDICATORS[1]];
  return (
    <div className="every-student">
      <h3>For every student</h3>
      <ul>
        <li><b>{learn.title}.</b> {learn.forTeachers}</li>
        <li><b>{vocab.title}.</b> {vocab.forTeachers} {subjectId && <Link href={`/vocabulary/${subjectId}/`}>{subjectName} vocabulary sheet</Link>}</li>
      </ul>
    </div>
  );
}
