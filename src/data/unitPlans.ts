/**
 * Example unit plans. These are simulated outlines that show how departments can respond to
 * identified transition gaps; they are not official ALA documents.
 */
import type { Dim } from '@/lib/dims';

export interface UnitPlan {
  id: string;
  subject: string;
  title: string;
  year: 'Year 1' | 'Year 2';
  timing: string;
  kind: 'Bridging' | 'Core';
  targets: Dim[];
  cambridge: string;
  objectives: string[];
  activities: string[];
  assessment: string;
}

export const UNIT_PLANS: UnitPlan[] = [
  {
    id: 'math-bridge', subject: 'mathematics', title: 'Functions and the road to calculus', year: 'Year 1', timing: 'Weeks 1–3', kind: 'Bridging',
    targets: ['content', 'writing', 'english'], cambridge: '9709 Pure Mathematics 1: quadratics, functions, coordinate geometry',
    objectives: ['Secure algebraic manipulation and quadratics', 'Understand functions, domain, range and inverses', 'Explain each step of a solution in words'],
    activities: ['Diagnostic quiz in the first lesson', 'Small-group catch-up on topics students have not met', 'Daily "explain your step" warm-ups', 'Vocabulary wall of key mathematical terms'],
    assessment: 'Short skills check at the end of Week 3, used to group students for support',
  },
  {
    id: 'math-model', subject: 'mathematics', title: 'Modelling with calculus', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['practical', 'inquiry', 'assessment'], cambridge: '9709 Pure Mathematics 1: differentiation and integration',
    objectives: ['Apply differentiation to rates and optimisation', 'Model real situations', 'Answer multi-step Cambridge questions'],
    activities: ['Optimisation problems from African contexts (crop yield, water storage)', 'Unfamiliar-problem Fridays', 'Past-paper questions marked with the mark scheme'],
    assessment: 'Timed Cambridge-style test with mark-scheme review',
  },
  {
    id: 'bio-bridge', subject: 'biology', title: 'Lab skills and cell structure', year: 'Year 1', timing: 'Weeks 1–3', kind: 'Bridging',
    targets: ['practical', 'quant', 'english'], cambridge: '9700 Cell structure; Paper 3 practical skills',
    objectives: ['Use a light microscope and draw cells accurately', 'Record results in tables and draw graphs', 'Use key biological terms in English'],
    activities: ['Guided microscopy practicals', 'Lab-skills checklist signed off for each student', 'Illustrated glossary of cell biology terms', 'Results table and graph clinic'],
    assessment: 'Practical skills check and short written test',
  },
  {
    id: 'bio-investigate', subject: 'biology', title: 'Enzymes: planning an investigation', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['inquiry', 'writing', 'assessment'], cambridge: '9700 Enzymes; Paper 5 planning, analysis and evaluation',
    objectives: ['Plan an investigation with variables and controls', 'Analyse results and identify sources of error', 'Write an extended evaluation'],
    activities: ['Model a full investigation together', 'Students plan their own enzyme experiment in pairs', 'Peer review of plans before carrying them out', 'Write-up using an evaluation frame'],
    assessment: 'Assessed investigation write-up using a Paper 5-style rubric',
  },
  {
    id: 'chem-bridge', subject: 'chemistry', title: 'Practical chemistry bootcamp', year: 'Year 1', timing: 'Weeks 1–2', kind: 'Bridging',
    targets: ['practical', 'quant'], cambridge: '9701 Atoms, molecules and stoichiometry; Paper 3 practical skills',
    objectives: ['Work safely in the laboratory', 'Carry out an accurate titration', 'Calculate moles and concentrations'],
    activities: ['Equipment and safety induction', 'Repeated titration practice with feedback', 'Mole calculation drills with worked examples'],
    assessment: 'Titration accuracy check and calculation quiz',
  },
  {
    id: 'chem-organic', subject: 'chemistry', title: 'Introduction to organic chemistry', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['content', 'writing'], cambridge: '9701 Organic chemistry: hydrocarbons and functional groups',
    objectives: ['Name and draw organic compounds', 'Explain reaction mechanisms', 'Write clear explanations for "explain" questions'],
    activities: ['Molecular model building', 'Mechanism card sorts', 'Answer frames for explanation questions'],
    assessment: 'Structured questions in Cambridge style',
  },
  {
    id: 'phys-bridge', subject: 'physics', title: 'Measurement, uncertainty and graphs', year: 'Year 1', timing: 'Weeks 1–3', kind: 'Bridging',
    targets: ['practical', 'quant', 'english'], cambridge: '9702 Physical quantities and units; measurement techniques',
    objectives: ['Measure accurately with common instruments', 'Calculate and combine uncertainties', 'Plot and interpret straight-line graphs'],
    activities: ['Rotating measurement stations', 'Uncertainty worked examples', 'Lab report template with sentence starters'],
    assessment: 'Short practical with an uncertainty analysis',
  },
  {
    id: 'phys-mechanics', subject: 'physics', title: 'Kinematics and dynamics in context', year: 'Year 1', timing: 'Term 1', kind: 'Core',
    targets: ['content', 'inquiry'], cambridge: '9702 Kinematics; dynamics',
    objectives: ['Use equations of motion', 'Apply Newton\'s laws', 'Plan a simple motion experiment'],
    activities: ['Motion experiments with phone video analysis', 'Problem-solving in pairs', 'Planning task with peer feedback'],
    assessment: 'Structured test and planning task',
  },
  {
    id: 'cs-bridge', subject: 'computer-science', title: 'Programming from zero', year: 'Year 1', timing: 'Weeks 1–4', kind: 'Bridging',
    targets: ['practical', 'quant'], cambridge: '9618 Paper 2: algorithms, pseudocode and programming',
    objectives: ['Write simple programs with variables, selection and loops', 'Read and write Cambridge pseudocode', 'Trace and debug code'],
    activities: ['Daily 20-minute coding exercises', 'Pair programming', 'Trace-table practice'],
    assessment: 'Short practical programming task',
  },
  {
    id: 'cs-project', subject: 'computer-science', title: 'Build a small app for a campus problem', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['inquiry', 'writing'], cambridge: '9618 Software development; Paper 4 practical',
    objectives: ['Analyse a real problem', 'Design, build and test a solution', 'Document the program clearly'],
    activities: ['Interview a "client" on campus', 'Weekly milestones with feedback', 'Documentation template'],
    assessment: 'Working program and documentation',
  },
  {
    id: 'wr-bridge', subject: 'writing-rhetoric', title: 'Close reading and the argumentative essay', year: 'Year 1', timing: 'Weeks 1–4', kind: 'Bridging',
    targets: ['writing', 'english', 'practical'], cambridge: 'ALA Writing & Rhetoric Year 1',
    objectives: ['Annotate unseen texts', 'Build an argument with evidence', 'Take part in a short seminar'],
    activities: ['Annotation modelling', 'Paragraph-building workshops', 'Low-stakes seminars with roles', 'Revision after written feedback'],
    assessment: 'Argumentative essay with one revision cycle',
  },
  {
    id: 'eng-analysis', subject: 'english', title: 'Language analysis of African non-fiction', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['inquiry', 'assessment'], cambridge: '9093 Paper 1 reading',
    objectives: ['Analyse writers\' choices', 'Compare texts', 'Answer Cambridge-style analysis questions'],
    activities: ['Speeches and essays by African writers and leaders', 'Comparison grids', 'Past-paper practice'],
    assessment: 'Timed analysis answer',
  },
  {
    id: 'eng-directed', subject: 'english', title: 'Writing for audience and purpose', year: 'Year 1', timing: 'Term 1', kind: 'Bridging',
    targets: ['writing', 'english', 'assessment'], cambridge: '9093 Paper 1 directed response; Paper 2 writing',
    objectives: ['Identify audience, purpose and form in a task', 'Adapt tone and register', 'Plan and write within time limits'],
    activities: ['Task-unpacking routine', 'Rewriting one text for different audiences', 'Timed writing with success criteria'],
    assessment: 'Directed-writing response under timed conditions',
  },
  {
    id: 'wr-research', subject: 'writing-rhetoric', title: 'The researched argument', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['inquiry', 'writing', 'english'], cambridge: 'ALA Writing & Rhetoric Year 1',
    objectives: ['Find and judge sources', 'Paraphrase, quote and cite correctly', 'Write a research-based argument'],
    activities: ['Library and online search workshop', 'Paraphrasing and citation practice', 'Draft, peer review and revise', 'Short speech presenting the argument'],
    assessment: 'Research essay with citations, and a short speech',
  },
  {
    id: 'lang-intensive', subject: 'language-transition', title: 'Intensive academic English (first term)', year: 'Year 1', timing: 'Term 1', kind: 'Bridging',
    targets: ['english', 'writing', 'practical'], cambridge: 'Supports every Cambridge subject',
    objectives: ['Follow lessons and take notes in English', 'Write well-structured paragraphs', 'Speak confidently in class'],
    activities: ['Placement assessment on arrival', 'Daily small-group English sessions', 'Subject vocabulary lists from each department', 'Peer mentoring with strong English speakers'],
    assessment: 'Re-assessment at the end of term to decide continued support',
  },
  {
    id: 'lang-command', subject: 'language-transition', title: 'Command words across subjects', year: 'Year 1', timing: 'Weeks 2–6', kind: 'Core',
    targets: ['assessment', 'writing'], cambridge: 'Cambridge command words (explain, describe, evaluate, suggest)',
    objectives: ['Recognise what each command word asks for', 'Write answers that match the command word'],
    activities: ['Command-word card games', 'Same question, different command words', 'Joint sessions with science and humanities teachers'],
    assessment: 'Mixed-subject command-word quiz',
  },
  {
    id: 'hist-sources', subject: 'history', title: 'Working with sources', year: 'Year 1', timing: 'Weeks 1–3', kind: 'Bridging',
    targets: ['practical', 'writing'], cambridge: '9489 Paper 1 document question',
    objectives: ['Assess provenance and reliability', 'Compare two sources', 'Write a supported judgement'],
    activities: ['Source detective tasks', 'Model answers deconstructed together', 'Paragraph frames for comparison'],
    assessment: 'Short source comparison answer',
  },
  {
    id: 'hist-essay', subject: 'history', title: 'Decolonisation essay unit', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['writing', 'inquiry', 'content'], cambridge: '9489 Paper 2 outline study essays',
    objectives: ['Plan a balanced essay', 'Reach a clear judgement', 'Use independent reading'],
    activities: ['Case studies from several regions of Africa', 'Debate on causes', 'Independent reading log'],
    assessment: 'Timed essay',
  },
  {
    id: 'geo-field', subject: 'geography', title: 'Campus fieldwork investigation', year: 'Year 1', timing: 'Term 1', kind: 'Bridging',
    targets: ['practical', 'quant', 'inquiry'], cambridge: '9696 skills: data collection and analysis',
    objectives: ['Design a simple geographical investigation', 'Collect and present data', 'Draw conclusions'],
    activities: ['Microclimate or land-use survey on campus', 'Data presentation workshop', 'Group write-up'],
    assessment: 'Fieldwork report',
  },
  {
    id: 'geo-dev', subject: 'geography', title: 'Population and development', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['writing', 'assessment'], cambridge: '9696 Human Geography: population and migration',
    objectives: ['Interpret population data', 'Use case studies', 'Write evaluative answers'],
    activities: ['Students bring case studies from their home countries', 'Data-response practice', '"Assess" essay planning'],
    assessment: 'Data response and short essay',
  },
  {
    id: 'econ-bridge', subject: 'economics', title: 'Economics toolkit: diagrams and data', year: 'Year 1', timing: 'Weeks 1–3', kind: 'Bridging',
    targets: ['quant', 'content', 'english'], cambridge: '9708 basic economic ideas; demand and supply',
    objectives: ['Draw and explain supply and demand diagrams', 'Read economic data', 'Use key terms accurately'],
    activities: ['Diagram drills', 'Data from African economies', 'Economics glossary'],
    assessment: 'Diagram and data quiz',
  },
  {
    id: 'econ-eval', subject: 'economics', title: 'Government intervention: writing to evaluate', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['writing', 'practical', 'assessment'], cambridge: '9708 government microeconomic intervention',
    objectives: ['Analyse policy with diagrams', 'Evaluate effectiveness', 'Answer data-response questions'],
    activities: ['Case studies such as fuel subsidies or price controls', 'Analyse-then-evaluate essay frame', 'Past-paper practice'],
    assessment: 'Essay and data response',
  },
  {
    id: 'bus-bridge', subject: 'business-studies', title: 'Business English and case-study basics', year: 'Year 1', timing: 'Weeks 1–3', kind: 'Bridging',
    targets: ['english', 'practical', 'writing'], cambridge: '9609 Business and its environment',
    objectives: ['Use business terminology in English', 'Read and analyse a short case study', 'Write a short business report'],
    activities: ['Local business case studies', 'Business vocabulary lists', 'Report templates'],
    assessment: 'Short case-study answer',
  },
  {
    id: 'bus-finance', subject: 'business-studies', title: 'Finance for decision-making', year: 'Year 1', timing: 'Term 2', kind: 'Core',
    targets: ['quant', 'assessment'], cambridge: '9609 Finance and accounting',
    objectives: ['Read income statements and balance sheets', 'Calculate and interpret ratios', 'Make a recommendation'],
    activities: ['Accounts from a student enterprise', 'Ratio practice', 'Recommendation writing'],
    assessment: 'Data-response question',
  },
  {
    id: 'as-core', subject: 'african-studies', title: 'Africa\'s regions: beyond the home country', year: 'Year 1', timing: 'Term 1', kind: 'Core',
    targets: ['content', 'practical', 'english'], cambridge: 'ALA African Studies Year 1 core',
    objectives: ['Compare regions of Africa', 'Discuss development challenges', 'Use evidence in discussion'],
    activities: ['Mixed-country discussion groups', 'Structured debates', 'Short research presentations'],
    assessment: 'Group presentation and reflection',
  },
  {
    id: 'as-research', subject: 'african-studies', title: 'Research project on a development challenge', year: 'Year 2', timing: 'Term 1', kind: 'Core',
    targets: ['inquiry', 'writing', 'quant'], cambridge: 'ALA African Studies Year 2 discipline courses',
    objectives: ['Frame a research question', 'Use development data', 'Write an analytical paper'],
    activities: ['Guided source lists', 'Data workshops on development indicators', 'Draft and feedback cycle'],
    assessment: 'Research paper',
  },
  {
    id: 'el-start', subject: 'entrepreneurial-leadership', title: 'Team challenges and leadership basics', year: 'Year 1', timing: 'Term 1', kind: 'Bridging',
    targets: ['practical', 'english'], cambridge: 'ALA Entrepreneurial Leadership Year 1',
    objectives: ['Work in diverse teams', 'Reflect on leadership', 'Pitch an idea in English'],
    activities: ['Low-risk team challenges', 'Leadership coaching circles', 'Pitch practice in small groups'],
    assessment: 'Reflection journal and short pitch',
  },
  {
    id: 'el-venture', subject: 'entrepreneurial-leadership', title: 'Original Idea for Development Incubator', year: 'Year 1', timing: 'Term 3', kind: 'Core',
    targets: ['inquiry', 'quant', 'writing'], cambridge: 'ALA Entrepreneurial Leadership Year 1',
    objectives: ['Identify a real problem', 'Research customers and markets', 'Build a simple budget and plan'],
    activities: ['Customer interviews', 'Budget workshop', 'Plan templates and mentor feedback'],
    assessment: 'Venture plan and pitch',
  },
];

export const plansFor = (subject: string) => UNIT_PLANS.filter((p) => p.subject === subject);
