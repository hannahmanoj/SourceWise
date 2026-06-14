export type EvidenceStatus = "emerging" | "mixed evidence" | "mostly agreed";
export type AcademicLevel = "Bachelor's" | "Master's" | "PhD";

export type ResearchRequest = {
  topic: string;
  academicLevel: AcademicLevel;
};

export type ResearchResult = {
  topic: string;
  researchMap: ResearchMap;
  papers: ResearchPaper[];
  comparisons: ResearchComparisons;
  debates: ResearchDebate[];
  readingPath: ReadingPathStep[];
  reflectionQuestions: string[];
};

export type ResearchMap = {
  themes: ResearchTheme[];
};

export type ResearchTheme = {
  name: string;
  explanation: string;
  debateStatus: EvidenceStatus;
  paperTitles: string[];
  debateQuestions: string[];
};

export type ResearchPaper = {
  id?: string;
  title: string;
  year: number;
  authors: string;
  venue: string;
  relevance: number;
  citations: number;
  type: string;
  url: string;
  whyItMatters: string;
  credibility: PaperCredibility;
};

export type PaperCredibility = {
  score: number;
  citationStrength: string;
  recency: string;
  methodology: string;
  venueQuality: string;
  limitations: string;
  whyTrust: string;
};

export type ResearchComparisons = {
  default: PaperComparison;
};

export type PaperComparison = {
  agreement: string;
  disagreement: string;
  methodDifference: string;
  dissertationUse: string;
};

export type PaperComparisonRequest = {
  topic: string;
  papers: [ResearchPaper, ResearchPaper];
};

export type ResearchDebate = {
  question: string;
  explanation: string;
  sides?: DebateSide[];
  papers: DebatePaper[];
};

export type DebateSide = {
  stance: string;
  paperIds: string[];
};

export type DebatePaper = {
  title: string;
  stance: string;
};

export type ReadingPathStep = {
  label: string;
  purpose: string;
};
