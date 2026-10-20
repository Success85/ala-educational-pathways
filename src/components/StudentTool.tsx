'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { COUNTRIES, countryById } from '@/data/countries';
import { SUBJECTS } from '@/data/subjects';
import { traditionById } from '@/data/traditions';
import { scaleById, BAND_LABEL, type Band } from '@/data/grading';
import { plansFor } from '@/data/unitPlans';
import { DIM_LABEL, type Dim } from '@/lib/dims';
import { LANGUAGES, profileFor, type Entry, type Language, type Profile } from '@/lib/engine';
import { profileMarkdown } from '@/lib/exportMd';
import { Rating } from './Rating';
import { DimTable } from './ProfileView';
import { DownloadButton } from './DownloadButton';
import { conflictFor } from '@/data/contexts';

const SORTED = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
const STORE = 'pathways-student-profiles';

interface Form {
  name: string;
  country: string;
  entry: Entry;
  language: Language;
  subjects: string[];
  grades: Record<string, string>;
  labs: 'regular' | 'some' | 'none';
  research: boolean;
  computing: boolean;
  mathLit: boolean;
  /** Home country, when different from where they studied (for example a refugee studying in a host country). */
  origin: string;
  conflict: boolean;
  interrupted: boolean;
  mcq: boolean;
  remote: boolean;
  homeLanguage: boolean;
  mixed: boolean;
}
interface Saved { id: string; savedAt: string; form: Form }

const TRADITION_LANGUAGE: Record<string, Language> = {
  'anglo-west': 'English', 'anglo-east': 'English', 'anglo-south': 'English', 'sa-caps': 'English',
  franco: 'French', luso: 'Portuguese', arabo: 'Arabic', hispano: 'Spanish',
};
function defaultLanguage(countryId: string): Language {
  const c = countryById(countryId);
  return c ? TRADITION_LANGUAGE[c.tradition] ?? 'Other' : 'English';
}

const conflictDefault = (countryId: string) => { const c = conflictFor(countryId); return !!c && !c.area; };
const BLANK = { origin: '', interrupted: false, mcq: false, remote: false, homeLanguage: false, mixed: false };
/** Older saved profiles lack the context fields; fill them in. */
const normalise = (f: Partial<Form> & { country: string }): Form => ({ ...BLANK, conflict: conflictDefault(f.country), ...f } as Form);

function readSaved(): Saved[] {
  try { return JSON.parse(localStorage.getItem(STORE) ?? '[]') as Saved[]; } catch { return []; }
}
function writeSaved(list: Saved[]) {
  try { localStorage.setItem(STORE, JSON.stringify(list)); return true; } catch { return false; }
}

export function StudentTool() {
  const sp = useSearchParams();
  const initialCountry = countryById(sp.get('country') ?? '')?.id ?? 'nigeria';
  const initialSubjects = (sp.get('subjects') ?? '').split(',').filter((id) => SUBJECTS.some((s) => s.id === id));
  const [form, setForm] = useState<Form>({
    name: '', country: initialCountry, entry: 'late', language: defaultLanguage(initialCountry),
    subjects: initialSubjects.length ? [...new Set([...initialSubjects, 'language-transition'])] : ['mathematics', 'biology', 'writing-rhetoric', 'language-transition'],
    grades: {}, labs: 'some', research: false, computing: false, mathLit: false,
    ...BLANK, conflict: conflictDefault(initialCountry),
  });
  const [saved, setSaved] = useState<Saved[]>([]);
  const [note, setNote] = useState('');
  useEffect(() => { setSaved(readSaved()); }, []);

  const country = countryById(form.country)!;
  const tradition = traditionById(country.tradition);
  const scale = scaleById(country.grading);
  const ctx = conflictFor(form.country);
  const origin = form.origin && form.origin !== form.country ? countryById(form.origin) : undefined;
  const originCtx = origin ? conflictFor(origin.id) : undefined;
  const extraCare = originCtx ? [`Home country ${origin!.name} is conflict-affected. Even though the student studied in ${country.name}, plan wellbeing-aware support with pastoral care; some students have experienced displacement or violence.`] : [];
  const set = (patch: Partial<Form>) => { setForm((f) => ({ ...f, ...patch })); setNote(''); };

  const profiles = useMemo(() => form.subjects.map((sid) => {
    const g = scale.grades.find((x) => x.grade === form.grades[sid]);
    return profileFor(form.country, sid, form.entry, {
      language: form.language, band: g?.band as Band | undefined, labs: form.labs, research: form.research, computing: form.computing,
      mathLit: form.mathLit && country.id === 'south-africa',
      conflict: form.conflict, interrupted: form.interrupted, mcq: form.mcq, remote: form.remote, homeLanguage: form.homeLanguage, mixed: form.mixed,
    });
  }).filter(Boolean) as Profile[], [form, scale, country.id]);

  // Cross-subject priorities: areas that come up as gaps in several subjects.
  const priorities = useMemo(() => {
    const count = new Map<Dim, { n: number; subjects: string[]; support: string }>();
    for (const p of profiles) for (const f of [...p.gaps, ...p.watch.slice(0, 1)]) {
      const e = count.get(f.dim) ?? { n: 0, subjects: [], support: p.subject.support[f.dim] };
      e.n += p.gaps.some((x) => x.dim === f.dim) ? 2 : 1; e.subjects.push(p.subject.name); count.set(f.dim, e);
    }
    return [...count.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 4);
  }, [profiles]);

  const care = useMemo(() => [...new Set([...extraCare, ...profiles.flatMap((p) => p.care)])], [profiles, extraCare.join()]);
  const contextBits = [form.conflict && 'conflict-affected schooling', !form.conflict && form.interrupted && 'interrupted schooling', !form.conflict && form.mcq && 'mostly multiple-choice exams', form.remote && 'remote or rural school', form.homeLanguage && 'learned mainly in a home language', form.mixed && 'mixed teaching models'].filter(Boolean) as string[];
  const who = form.name.trim() || 'This student';
  const md = profiles.length ? [
    `# Transition profile: ${who}`, '',
    `${origin ? `Home country: ${origin.name}. Studied in: ${country.name}.` : `Country: ${country.name}.`} System: ${tradition.name}. Learned in: ${form.language}.`,
    ...(contextBits.length ? [`Learning context: ${contextBits.join(', ')}.`] : []),
    `Joined ALA: ${form.entry === 'late' ? country.entry.late : country.entry.early}.`, '',
    '## Cross-subject priorities', ...priorities.map(([d, e]) => `- **${DIM_LABEL[d]}** (${e.subjects.join(', ')}): ${e.support}`), '',
    '## For every student', '- Teach learning how to learn in the first term: note-making in their own words, planning time, and moving from memorising to analysing and applying.', '- Teach command words and subject vocabulary explicitly in every subject.', '',
    ...(care.length ? ['## Context and wellbeing', ...care.map((t) => `- ${t}`), ''] : []),
    ...profiles.map((p) => profileMarkdown(p.subject.name, [{ label: `${p.subject.name}${form.grades[p.subject.id] ? ` (national result ${form.grades[p.subject.id]})` : ''}`, p }]).split('\n').slice(6).join('\n')),
  ].join('\n') : '';

  function save() {
    const entry: Saved = { id: String(Date.now()), savedAt: new Date().toISOString(), form };
    const list = [entry, ...readSaved()].slice(0, 30);
    setNote(writeSaved(list) ? 'Saved in this browser.' : 'This browser blocked saving. Download the profile instead.');
    setSaved(list);
  }
  function remove(id: string) { const list = readSaved().filter((s) => s.id !== id); writeSaved(list); setSaved(list); }

  return (
    <div className="student">
      <form className="card student-form no-print" onSubmit={(e) => e.preventDefault()}>
        <h2>About the student</h2>
        <div className="field">
          <label htmlFor="st-name">Name or initials <span className="s">(optional)</span></label>
          <input id="st-name" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="For example A.K." />
        </div>
        <div className="field">
          <label htmlFor="st-country">Studied in</label>
          <select id="st-country" value={form.country} onChange={(e) => set({ country: e.target.value, language: defaultLanguage(e.target.value), grades: {}, mathLit: false, conflict: conflictDefault(e.target.value) })}>
            {SORTED.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span className="hint">The country whose school system they followed. {country.qualification}. {tradition.name}.</span>
        </div>
        <div className="field">
          <label htmlFor="st-origin">Home country, if different <span className="s">(optional)</span></label>
          <select id="st-origin" value={form.origin} onChange={(e) => set({ origin: e.target.value })}>
            <option value="">Same as where they studied</option>
            {SORTED.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span className="hint">For example a South Sudanese student who studied in Uganda: choose Uganda above and South Sudan here. <Link href="/contexts/#asylum">Why this matters</Link></span>
        </div>
        <fieldset className="fieldset">
          <legend>When did they join ALA?</legend>
          <label className="check"><input type="radio" name="entry" checked={form.entry === 'early'} onChange={() => set({ entry: 'early' })} /> {country.entry.early}</label>
          <label className="check"><input type="radio" name="entry" checked={form.entry === 'late'} onChange={() => set({ entry: 'late' })} /> {country.entry.late}</label>
        </fieldset>
        <div className="field">
          <label htmlFor="st-lang">Language they learned in</label>
          <select id="st-lang" value={form.language} onChange={(e) => set({ language: e.target.value as Language })}>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <span className="hint">Change this for students from a different stream, for example Cameroon&apos;s Anglophone sub-system or Egypt&apos;s language schools.</span>
        </div>

        <fieldset className="fieldset">
          <legend>Subjects at ALA</legend>
          <div className="subject-picks">
            {SUBJECTS.map((s) => (
              <label key={s.id} className="check"><input type="checkbox" checked={form.subjects.includes(s.id)}
                onChange={(e) => set({ subjects: e.target.checked ? [...form.subjects, s.id] : form.subjects.filter((x) => x !== s.id) })} /> {s.name}</label>
            ))}
          </div>
        </fieldset>

        {form.subjects.length > 0 && (
          <fieldset className="fieldset">
            <legend>National results <span className="s">(optional)</span></legend>
            <p className="hint mb">{scale.name}. <Link href={`/grades/#${scale.id}`}>How to read these results</Link></p>
            {form.subjects.map((sid) => (
              <div key={sid} className="grade-row">
                <label htmlFor={`g-${sid}`}>{SUBJECTS.find((s) => s.id === sid)?.name}</label>
                <select id={`g-${sid}`} value={form.grades[sid] ?? ''} onChange={(e) => set({ grades: { ...form.grades, [sid]: e.target.value } })}>
                  <option value="">Not known</option>
                  {scale.grades.map((g) => <option key={g.grade} value={g.grade}>{g.grade}{g.range ? ` (${g.range})` : ''}: {g.meaning}</option>)}
                </select>
              </div>
            ))}
          </fieldset>
        )}

        <fieldset className="fieldset">
          <legend>Learning background</legend>
          <div className="field">
            <label htmlFor="st-labs">Laboratory practicals at school</label>
            <select id="st-labs" value={form.labs} onChange={(e) => set({ labs: e.target.value as Form['labs'] })}>
              <option value="regular">Regular</option><option value="some">Some or not known</option><option value="none">None</option>
            </select>
          </div>
          <label className="check"><input type="checkbox" checked={form.research} onChange={(e) => set({ research: e.target.checked })} /> Has completed an independent research project</label>
          <label className="check"><input type="checkbox" checked={form.computing} onChange={(e) => set({ computing: e.target.checked })} /> Had regular computer or programming access</label>
          {country.id === 'south-africa' && <label className="check"><input type="checkbox" checked={form.mathLit} onChange={(e) => set({ mathLit: e.target.checked })} /> Took Mathematical Literacy, not Mathematics</label>}
        </fieldset>

        <fieldset className="fieldset context-fieldset">
          <legend>Learning context</legend>
          <p className="hint mb">What the student actually experienced, which may differ from the official curriculum. <Link href="/contexts/">About learning contexts</Link></p>
          {ctx?.area ? (
            <label className="check"><input type="checkbox" checked={form.conflict} onChange={(e) => set({ conflict: e.target.checked })} /> <span>Studied in {ctx.area}</span></label>
          ) : (
            <label className="check"><input type="checkbox" checked={form.conflict} onChange={(e) => set({ conflict: e.target.checked })} /> <span>Conflict-affected or displaced schooling{ctx ? <span className="s"> (on by default for {country.name})</span> : null}</span></label>
          )}
          <label className="check"><input type="checkbox" disabled={form.conflict} checked={form.conflict || form.interrupted} onChange={(e) => set({ interrupted: e.target.checked })} /> <span>Schooling was interrupted{form.conflict && <span className="s"> (included above)</span>}</span></label>
          <label className="check"><input type="checkbox" disabled={form.conflict} checked={form.conflict || form.mcq} onChange={(e) => set({ mcq: e.target.checked })} /> <span>Mostly multiple-choice exams, little essay writing{form.conflict && <span className="s"> (included above)</span>}</span></label>
          <label className="check"><input type="checkbox" checked={form.remote} onChange={(e) => set({ remote: e.target.checked })} /> <span>Remote or rural school, with little lab or computer access</span></label>
          <label className="check"><input type="checkbox" checked={form.homeLanguage} onChange={(e) => set({ homeLanguage: e.target.checked })} /> <span>Learned mainly in a home language, such as Shona or isiZulu, not the official language</span></label>
          <label className="check"><input type="checkbox" checked={form.mixed} onChange={(e) => set({ mixed: e.target.checked })} /> <span>Met mixed teaching models, for example British-style then French-style assessment</span></label>
        </fieldset>
      </form>

      <div className="student-result">
        <div className="report-head student-head">
          <div className="report-title">
            <p className="kicker">Educational transition profile</p>
            <h2 className="h1">{who}</h2>
            <p className="sub">{origin ? `From ${origin.name}, studied in ${country.name}` : country.name}, {form.entry === 'late' ? country.entry.late : country.entry.early}. Learned in {form.language}.</p>
            {contextBits.length > 0 && <p className="s">Learning context: {contextBits.join(', ')}.</p>}
          </div>
          <div className="actions no-print">
            <button type="button" className="btn primary" onClick={save} disabled={!profiles.length}>Save profile</button>
            <button type="button" className="btn" onClick={() => window.print()} disabled={!profiles.length}>Print</button>
            {md && <DownloadButton filename={`transition-profile-${(form.name.trim() || 'student').replace(/[^\w-]+/g, '-').toLowerCase()}.md`} content={md} />}
          </div>
          {note && <p className="form-ok" role="status">{note}</p>}
        </div>

        {!profiles.length ? <p className="empty">Choose at least one subject.</p> : (
          <>
            {priorities.length > 0 && (
              <section className="panel priorities">
                <h3>Cross-subject priorities</h3>
                <ol>{priorities.map(([d, e]) => <li key={d}><b>{DIM_LABEL[d]}</b> <span className="s">({e.subjects.join(', ')})</span><br />{e.support}</li>)}</ol>
              </section>
            )}
            {care.length > 0 && (
              <section className="care">
                <h3>Context and wellbeing</h3>
                <ul>{care.map((t) => <li key={t}>{t}</li>)}</ul>
              </section>
            )}
            <section className="every-student">
              <h3>For every student</h3>
              <ul>
                <li><b>Learning how to learn.</b> Make study skills a priority in the first term: note-making in their own words, planning time, and moving from memorising to analysing and applying.</li>
                <li><b>Subject vocabulary.</b> Teach command words and key terms explicitly: {profiles.map((p, i) => <span key={p.subject.id}>{i ? ', ' : ''}<Link href={`/vocabulary/${p.subject.id}/`}>{p.subject.name}</Link></span>)}.</li>
              </ul>
            </section>
            <div className="subject-cards">
              {profiles.map((p) => {
                const plans = plansFor(p.subject.id).filter((u) => u.targets.some((d) => [...p.gaps, ...p.watch].some((f) => f.dim === d)));
                const grade = form.grades[p.subject.id];
                const g = scale.grades.find((x) => x.grade === grade);
                return (
                  <section key={p.subject.id} className="panel subject-card">
                    <div className="subject-card-head">
                      <h3><Link href={`/countries/${form.country}/${p.subject.id}/`}>{p.subject.name}</Link></h3>
                      <Rating value={p.overall.label} />
                    </div>
                    {g && <p className="s">National result: {grade} ({BAND_LABEL[g.band].toLowerCase()})</p>}
                    <div className="three">
                      <div><h4>Brings</h4><ul>{p.strengths.slice(0, 3).map((f) => <li key={f.dim}>{f.text}</li>)}{!p.strengths.length && <li className="s">No clear strengths stand out</li>}</ul></div>
                      <div><h4>May struggle with</h4><ul>{[...p.gaps, ...p.watch].slice(0, 3).map((f) => <li key={f.dim}>{f.text}</li>)}{!p.gaps.length && !p.watch.length && <li className="s">No major gaps expected</li>}</ul></div>
                      <div><h4>Support</h4><ul>{p.support.slice(0, 3).map((f, i) => <li key={i}>{f.text}</li>)}{!p.support.length && <li className="s">Standard induction</li>}</ul></div>
                    </div>
                    {plans.length > 0 && <p className="s">Unit plans: {plans.map((u, i) => <span key={u.id}>{i ? ', ' : ''}<Link href={`/unit-plans/?subject=${u.subject}#${u.id}`}>{u.title}</Link></span>)}</p>}
                    <details className="no-print"><summary>All readiness areas</summary><DimTable p={p} /></details>
                  </section>
                );
              })}
            </div>
            <p className="disclaimer">Indicative profile based on the student&apos;s system, entry point and the details entered. Use it to plan support, then confirm it with early assessments. It is not an admissions decision.</p>
          </>
        )}

        <section className="sec no-print">
          <h2>Saved profiles</h2>
          <p className="s mb">Saved only in this browser, on this device. Avoid entering sensitive personal information.</p>
          {saved.length ? (
            <div className="rows">{saved.map((s) => (
              <div key={s.id} className="row">
                <span className="grow"><span className="t">{s.form.name || 'Unnamed student'}</span><br /><span className="s">{countryById(s.form.country)?.name}, {s.form.subjects.length} subjects. Saved {new Date(s.savedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
                <button type="button" className="btn small" onClick={() => { setForm(normalise(s.form)); window.scrollTo({ top: 0 }); }}>Open</button>
                <button type="button" className="btn small danger" onClick={() => { if (confirm('Delete this saved profile?')) remove(s.id); }}>Delete</button>
              </div>
            ))}</div>
          ) : <p className="empty">No saved profiles yet.</p>}
        </section>
      </div>
    </div>
  );
}
