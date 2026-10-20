'use client';
import { useState } from 'react';
import { COUNTRIES, countryById } from '@/data/countries';
import { BAND_LABEL, scaleById } from '@/data/grading';

const SORTED = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
const BAND_TEXT = {
  excellent: 'A strong result. Expect secure content knowledge; still check skills the national exam does not test, such as independent investigation.',
  good: 'A solid result. Content foundations are likely in place; watch for gaps in application and evaluative writing.',
  satisfactory: 'A pass. Expect some content gaps; a diagnostic task in the first weeks will show where.',
  weak: 'Below the usual credit level. Plan early catch-up support in this subject.',
};

export function GradeInterpreter() {
  const [country, setCountry] = useState('ghana');
  const [grade, setGrade] = useState('');
  const c = countryById(country)!;
  const scale = scaleById(c.grading);
  const g = scale.grades.find((x) => x.grade === grade);
  return (
    <div className="card interpreter">
      <h2>Read a result</h2>
      <div className="grid2">
        <div className="field">
          <label htmlFor="gi-country">Country</label>
          <select id="gi-country" value={country} onChange={(e) => { setCountry(e.target.value); setGrade(''); }}>
            {SORTED.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
          <span className="hint">{c.qualification}</span>
        </div>
        <div className="field">
          <label htmlFor="gi-grade">Grade in one subject</label>
          <select id="gi-grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="">Choose a grade</option>
            {scale.grades.map((x) => <option key={x.grade} value={x.grade}>{x.grade}{x.range ? ` (${x.range})` : ''}</option>)}
          </select>
          <span className="hint">{scale.name}</span>
        </div>
      </div>
      {g && (
        <div className={`interp band-${g.band}`} role="status">
          <p className="interp-head"><b>{g.grade}</b>{g.range ? ` (${g.range})` : ''}: {g.meaning}. Reading for ALA: <b>{BAND_LABEL[g.band]}</b>.</p>
          <p>{BAND_TEXT[g.band]}</p>
        </div>
      )}
      <p className="hint">The original grade is kept as it is. The reading is a rough guide for teachers, not an equivalence to Cambridge grades.</p>
    </div>
  );
}
