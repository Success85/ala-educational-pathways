/** The ALA research team's own findings (verbatim from their research sheets). */
import data from '@/data/research.json';
import type { AnalysisContent, MatrixRow } from './research';

export interface TeamReport { country: string; subject: string; title: string; overall: string; content: AnalysisContent }
export interface TeamMatrix { subject: string; rows: MatrixRow[]; conclusion: string }
export interface TeamComparison { id: string; name: string; description: string; countries: string[]; matrices: TeamMatrix[] }

export const TEAM_REPORTS = data.reports as unknown as TeamReport[];
export const TEAM_COMPARISONS = data.comparisons as unknown as TeamComparison[];
export const COUNTRY_FINDINGS = data.countryFindings as Record<string, { ranking: string[]; keyFindings: string }>;

export const teamReport = (country: string, subject: string) => TEAM_REPORTS.find((r) => r.country === country && r.subject === subject);
export function teamMatrixFor(country: string, subject: string) {
  for (const c of TEAM_COMPARISONS) {
    if (!c.countries.includes(country)) continue;
    const m = c.matrices.find((x) => x.subject === subject);
    if (m) return { comparison: c, matrix: m, overall: m.rows.find((r) => /^overall/i.test(r.area)) };
  }
  return null;
}
export const hasTeamResearch = (country: string) =>
  TEAM_REPORTS.some((r) => r.country === country) || TEAM_COMPARISONS.some((c) => c.countries.includes(country));
