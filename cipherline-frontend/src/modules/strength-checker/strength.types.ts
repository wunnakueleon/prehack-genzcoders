export interface StrengthCheck {
  id: string;
  label: string;
  passed: boolean;
}

export interface StrengthAnalysis {
  score: number;
  label: string;
  entropy: number;
  length: number;
  charset: number;
  issues: string[];
  checks?: StrengthCheck[];
  suggestions?: string[];
  crackTime?: {
    seconds: number;
    label: string;
  };
}
