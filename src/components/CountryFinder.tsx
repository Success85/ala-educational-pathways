'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CountryFinder({ countries }: { countries: { id: string; name: string }[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [miss, setMiss] = useState('');
  function go(e: React.FormEvent) {
    e.preventDefault();
    const t = q.trim().toLowerCase();
    if (!t) return;
    const hit = countries.find((c) => c.name.toLowerCase() === t) ?? countries.find((c) => c.name.toLowerCase().startsWith(t)) ?? countries.find((c) => c.name.toLowerCase().includes(t));
    if (hit) router.push(`/countries/${hit.id}/`);
    else setMiss(`No African country matches "${q.trim()}". Check the spelling, or browse by region below.`);
  }
  return (
    <form className="finder" onSubmit={go}>
      <label htmlFor="find" className="sr">Country</label>
      <input id="find" value={q} onChange={(e) => { setQ(e.target.value); setMiss(''); }} placeholder="Type a country, for example Kenya" autoComplete="off" />
      <button className="btn primary">Open country</button>
      {miss && <p className="form-error" role="alert" style={{ flexBasis: '100%' }}>{miss}</p>}
    </form>
  );
}
