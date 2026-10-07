export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Subject {
  id: number;
  name: string;
  description?: string | null;
  color: string;
  isActive?: boolean;
  topicsCount?: number;
  createdAt: string;
}
export interface SubjectInput {
  name: string;
  description?: string;
  color?: string;
}
export interface SubjectStats {
  totalSubjects: number;
  activeSubjects: number;
}

export interface Topic {
  id: number;
  name: string;
  description?: string | null;
  subjectId: number;
  createdAt: string;
}
export interface TopicInput {
  name: string;
  description?: string;
  subjectId: number;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReviewedAt?: string | null;
  subjectId?: number | null;
  topicId?: number | null;
  subject?: { id: number; name: string; color: string } | null;
  topic?: { id: number; name: string } | null;
  // Campos "achatados" preenchidos pelo flashcardService (o que os componentes consomem)
  nextReviewDate?: string;
  subjectName?: string;
  subjectColor?: string;
  topicName?: string;
  createdAt: string;
}
export interface FlashcardInput {
  front: string;
  back: string;
  subjectId?: number;
  topicId?: number;
}
export interface FlashcardStats {
  totalCards: number;
  dueForReview: number;
  newCards: number;
  masteredCards: number;
}

export interface PomodoroSession {
  id: number;
  startTime: string;
  endTime?: string | null;
  duration: number;
  breakTime: number;
  completed: boolean;
  topicId?: number | null;
}
export interface PomodoroStats {
  totalMinutes: number;
  totalSessions: number;
  completedSessions: number;
}

export type GoalType = 'daily' | 'weekly' | 'monthly' | 'custom';
// 'active' é o que o backend devolve; 'pending'/'in_progress' ficam aceitos por compatibilidade.
export type GoalStatus = 'pending' | 'in_progress' | 'active' | 'completed' | 'failed';
export interface Goal {
  id: number;
  title: string;
  description?: string | null;
  type: GoalType;
  targetMinutes: number;
  currentMinutes: number;
  progress: number;
  status: GoalStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
}
export interface GoalInput {
  title: string;
  description?: string;
  type: GoalType;
  targetMinutes: number;
  startDate: string;
  endDate: string;
}
export interface GoalStats {
  totalGoals: number;
  completedGoals: number;
  failedGoals: number;
  activeGoals: number;
  completionRate: number;
  totalMinutesCompleted: number;
}

export interface MindMap {
  id: number;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt?: string;
  topicId?: number | null;
  topicName?: string | null;
  nodesCount: number;
}
export interface MindMapInput {
  title: string;
  description?: string;
  topicId?: number;
}
export interface MindMapNode {
  id: number;
  content: string;
  level: number;
  parentId?: number | null;
  positionX: number;
  positionY: number;
  backgroundColor?: string;
  textColor?: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  mindMapId: number;
}
