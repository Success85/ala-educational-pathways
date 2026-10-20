export const DIMS = ['content', 'practical', 'inquiry', 'writing', 'quant', 'english', 'assessment'] as const;
export type Dim = (typeof DIMS)[number];

export const DIM_LABEL: Record<Dim, string> = {
  content: 'Curriculum content',
  practical: 'Practical and applied work',
  inquiry: 'Independent research and inquiry',
  writing: 'Extended and evaluative writing',
  quant: 'Quantitative and data skills',
  english: 'Academic English',
  assessment: 'Cambridge-style assessment',
};

export const DIM_HELP: Record<Dim, string> = {
  content: 'How much of the ALA course content students have already met',
  practical: 'Hands-on work: labs, fieldwork, programming, case studies, presentations',
  inquiry: 'Working independently on open questions and research',
  writing: 'Writing extended, analytical and evaluative answers',
  quant: 'Calculation, data handling and interpretation',
  english: 'Learning, reading and writing the subject in English',
  assessment: 'Familiarity with Cambridge question styles, command words and mark schemes',
};

export const LEVEL_LABEL = ['', 'Low', 'Low-Moderate', 'Moderate', 'Moderate-High', 'High', 'Very High'];
export const clamp = (n: number) => Math.max(1, Math.min(6, Math.round(n)));
