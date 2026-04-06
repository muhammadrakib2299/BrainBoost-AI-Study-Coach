export const APP_NAME = 'BrainBoost';
export const APP_DESCRIPTION =
  'AI-powered study coach — upload notes, generate flashcards, take quizzes, and study smarter with spaced repetition.';

export const FREE_TIER_LIMITS = {
  maxDecks: 3,
  maxAiExplanationsPerDay: 10,
  maxCardsPerDeck: 50,
};

export const FSRS_DEFAULTS = {
  initialStability: 1,
  initialDifficulty: 5,
  requestRetention: 0.9,
};

export const QUIZ_DEFAULTS = {
  questionsPerQuiz: 10,
  timedModeSeconds: 600, // 10 minutes
};

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  decks: '/decks',
  quiz: '/quiz',
  review: '/review',
  schedule: '/schedule',
  chat: '/chat',
} as const;
