export interface CliContext {
  args: string[];
  json: boolean;
}

export interface QuestPlan {
  codename: string;
  pitch: string;
  omen: string;
  quests: string[];
  constraints: string[];
  structure: FileSuggestion[];
  nextCommands: string[];
}

export interface FileSuggestion {
  path: string;
  purpose: string;
}

export interface InspectionReport {
  target: string;
  filesSeen: number;
  directoriesSeen: number;
  signals: string[];
  suggestions: string[];
}
