'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Rating } from './Rating';

export interface ReadinessRow {
  id: string; name: string; region: string; regionName: string; tradition: string; traditionName: string;
  late: { score: number; label: string }; early: { score: number; label: string }; watch: string; team: boolean;
}

/** All countries' readiness for one subject, filterable and sortable. */
export function ReadinessTable({ rows, subjectId, regions, traditions }: {
  rows: ReadinessRow[]; subjectId: string; regions: { id: string; name: string }[]; traditions: { id: string; name: string }[];
}) {
  const [entry, setEntry] = useState<'late' | 'early'>('late');
  const [region, setRegion] = useState('');
  const [tradition, setTradition] = useState('');
  const [sort, setSort] = useState<'name' | 'low' | 'high'>('low');
  const shown = useMemo(() => {
    const r = rows.filter((x) => (!region || x.region === region) && (!tradition || x.tradition === tradition));
    return r.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name)
      : sort === 'low' ? a[entry].score - b[entry].score || a.name.localeCompare(b.name)
        : b[entry].score - a[entry].score || a.name.localeCompare(b.name));
  }, [rows, region, tradition, sort, entry]);
  return (
    <>
      <div className="filters">
        <select aria-label="Entry point" value={entry} onChange={(e) => setEntry(e.target.value as 'late' | 'early')}>
          <option value="late">Joining after the national qualification</option>
          <option value="early">Joining before it (earlier entry)</option>
        </select>
        <select aria-label="Region" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">All regions</option>{regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select aria-label="Education system" value={tradition} onChange={(e) => setTradition(e.target.value)}>
          <option value="">All systems</option>{traditions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as 'name' | 'low' | 'high')}>
          <option value="low">Most support needed first</option>
          <option value="high">Best prepared first</option>
          <option value="name">A to Z</option>
        </select>
      </div>
      <p className="count-line">{shown.length} countries</p>
      <div className="tablewrap">
        <table>
          <thead><tr><th>Country</th><th>System</th><th>Overall readiness</th><th>Main area to watch</th></tr></thead>
          <tbody>
            {shown.map((x) => (
              <tr key={x.id}>
                <td><Link href={`/countries/${x.id}/${subjectId}/`}>{x.name}</Link>{x.team && <> <span className="prov team small">Research</span></>}</td>
                <td className="s">{x.traditionName}</td>
                <td><Rating value={x[entry].label} compact /></td>
                <td className="s">{x.watch || 'No major gaps expected'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
