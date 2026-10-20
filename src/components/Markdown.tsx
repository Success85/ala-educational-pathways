/**
 * Renders the small Markdown subset used for research narrative:
 * "### heading", "- item", "| a | b |" tables and paragraphs. No HTML is ever injected.
 */
import { Rating } from './Rating';
import { ratingScore } from '@/lib/research';

type Block = { kind: 'h' | 'p' | 'ul' | 'table'; lines: string[] };

function blocks(text: string): Block[] {
  const out: Block[] = [];
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    const last = out[out.length - 1];
    if (!line) { out.push({ kind: 'p', lines: [] }); continue; }
    if (line.startsWith('### ')) { out.push({ kind: 'h', lines: [line.slice(4)] }); continue; }
    if (/^[-*] /.test(line)) {
      if (last?.kind === 'ul') last.lines.push(line.slice(2)); else out.push({ kind: 'ul', lines: [line.slice(2)] });
      continue;
    }
    if (line.startsWith('|')) {
      if (/^\|[\s|:-]+\|$/.test(line)) continue;
      const row = line.replace(/^\||\|$/g, '');
      if (last?.kind === 'table') last.lines.push(row); else out.push({ kind: 'table', lines: [row] });
      continue;
    }
    if (last?.kind === 'p' && last.lines.length) last.lines.push(line); else out.push({ kind: 'p', lines: [line] });
  }
  return out.filter((b) => b.lines.length);
}

export function Markdown({ text, headingLevel = 3 }: { text?: string | null; headingLevel?: 3 | 4 }) {
  if (!text?.trim()) return null;
  const H = `h${headingLevel}` as 'h3' | 'h4';
  return (
    <div className="md">
      {blocks(text).map((b, i) => {
        if (b.kind === 'h') return <H key={i}>{b.lines[0]}</H>;
        if (b.kind === 'ul') return <ul key={i}>{b.lines.map((l, j) => <li key={j}>{l}</li>)}</ul>;
        if (b.kind === 'table') {
          const rows = b.lines.map((r) => r.split('|').map((c) => c.trim()));
          return (
            <div key={i} className="tablewrap"><table>
              <thead><tr>{rows[0].map((c, j) => <th key={j}>{c}</th>)}</tr></thead>
              <tbody>{rows.slice(1).map((r, j) => (
                <tr key={j}>{r.map((c, k) => <td key={k}>{k > 0 && ratingScore(c) != null && c.split(' ').length <= 3 ? <Rating value={c} compact /> : c}</td>)}</tr>
              ))}</tbody>
            </table></div>
          );
        }
        return <p key={i}>{b.lines.join(' ')}</p>;
      })}
    </div>
  );
}
