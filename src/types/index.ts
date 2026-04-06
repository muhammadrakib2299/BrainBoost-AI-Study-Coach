// ==========================================
// BrainBoost — Core Type Definitions
// ==========================================

// --- User ---
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: 'free' | 'pro' | 'teams';
  createdAt: Date;
  updatedAt: Date;
}

// --- Deck ---
export interface Deck {
  id: string;
  userId: string;
  title: string;
  description?: string;
  sourceType: 'pdf' | 'text' | 'url' | 'image';
  sourceContent?: string;
  cardCount: number;
  masteryPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

// --- Flashcard ---
export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  explanation?: string;
  // FSRS fields
  stability: number;
  difficulty: number;
  dueDate: Date;
  lastReviewDate?: Date;
  reviewCount: number;
  lapseCount: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
  createdAt: Date;
  updatedAt: Date;
}

export type CardRating = 'again' | 'hard' | 'good' | 'easy';

// --- Quiz ---
export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  deckId: string;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  timeTakenSeconds?: number;
  createdAt: Date;
}

// --- Study Schedule ---
export interface StudySchedule {
  id: string;
  userId: string;
  examDate: Date;
  dailyPlans: DailyPlan[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyPlan {
  date: Date;
  deckIds: string[];
  topics: string[];
  estimatedMinutes: number;
  completed: boolean;
}

// --- Chat ---
export interface ChatMessage {
  id: string;
  deckId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// --- Progress ---
export interface StudyProgress {
  id: string;
  userId: string;
  date: Date;
  cardsReviewed: number;
  cardsLearned: number;
  quizScore?: number;
  minutesStudied: number;
  streak: number;
}

// --- Weak Spots ---
export interface WeakSpot {
  id: string;
  userId: string;
  deckId: string;
  concept: string;
  mistakeCount: number;
  mistakePattern: string;
  lastMistakeAt: Date;
}

// --- Active Recall ---
export interface RecallAttempt {
  id: string;
  userId: string;
  deckId: string;
  topic: string;
  userResponse: string;
  completenessScore: number;
  missedConcepts: string[];
  createdAt: Date;
}

// --- API Response ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
