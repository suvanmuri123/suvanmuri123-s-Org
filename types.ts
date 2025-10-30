
export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  completionDate: string | null;
}

export type MoodValue = '😍' | '😊' | '🙂' | '😐' | '😟' | '😠';

export interface Mood {
    date: string;
    mood: MoodValue;
}

export interface AnalyticsData {
  date: string;
  completed: number;
}

export enum View {
  Tasks = 'TASKS',
  Analytics = 'ANALYTICS',
  FocusTimer = 'FOCUS_TIMER',
  Notes = 'NOTES',
}

export interface ReflectionData {
    win: string;
    lesson: string;
    skipped: string;
    onMyMind: string;
    grateful: string;
    procrastinated: string;
    highlight: string;
    growth: string;
}
