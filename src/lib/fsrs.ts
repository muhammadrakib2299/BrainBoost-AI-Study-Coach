/**
 * Free Spaced Repetition Scheduler (FSRS) v4 — simplified implementation
 *
 * Based on: https://github.com/open-spaced-repetition/fsrs4anki
 * Core parameters: stability (S), difficulty (D), retrievability (R)
 */

import type { CardRating } from '@/types';

// FSRS default parameters (w0-w12)
const W = [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05];

const DECAY = -0.5;
const FACTOR = 19 / 81; // 0.9^(1/DECAY) - 1

// Desired retention rate
const REQUEST_RETENTION = 0.9;

interface CardParams {
  stability: number;
  difficulty: number;
  dueDate?: Date;
  state: 'new' | 'learning' | 'review' | 'relearning';
  reviewCount: number;
  lapseCount: number;
}

interface ReviewResult {
  stability: number;
  difficulty: number;
  dueDate: Date;
  state: 'new' | 'learning' | 'review' | 'relearning';
  lapseCount: number;
}

const RATING_MAP: Record<CardRating, number> = {
  again: 1,
  hard: 2,
  good: 3,
  easy: 4,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Calculate initial stability for a new card based on rating */
function initStability(rating: number): number {
  return Math.max(W[rating - 1], 0.1);
}

/** Calculate initial difficulty for a new card based on rating */
function initDifficulty(rating: number): number {
  return clamp(W[4] - (rating - 3) * W[5], 1, 10);
}

/** Calculate next difficulty after a review */
function nextDifficulty(d: number, rating: number): number {
  const nextD = d - W[6] * (rating - 3);
  // Mean reversion
  const meanReverted = W[7] * initDifficulty(3) + (1 - W[7]) * nextD;
  return clamp(meanReverted, 1, 10);
}

/** Calculate the interval in days from stability */
function stabilityToInterval(stability: number): number {
  return Math.max(
    1,
    Math.round(stability * FACTOR * (Math.pow(REQUEST_RETENTION, 1 / DECAY) - 1))
  );
}

/** Calculate next stability for a successful recall */
function nextRecallStability(d: number, s: number, r: number, rating: number): number {
  const hardPenalty = rating === 2 ? W[11] : 1;
  const easyBonus = rating === 4 ? W[12] : 1;

  return s * (
    1 +
    Math.exp(W[8]) *
    (11 - d) *
    Math.pow(s, -W[9]) *
    (Math.exp((1 - r) * W[10]) - 1) *
    hardPenalty *
    easyBonus
  );
}

/** Calculate next stability for a failed recall (lapse) */
function nextForgetStability(d: number, s: number, r: number): number {
  return Math.max(
    0.1,
    W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13] || 0.05) - 1) * Math.exp((1 - r) * (W[14] || 0.34))
  );
}

/** Calculate retrievability (probability of recall) */
function retrievability(stability: number, elapsedDays: number): number {
  return Math.pow(1 + FACTOR * elapsedDays / stability, DECAY);
}

/**
 * Main FSRS review function
 * Takes current card parameters and rating, returns updated parameters
 */
export function reviewCard(card: CardParams, rating: CardRating): ReviewResult {
  const ratingNum = RATING_MAP[rating];
  const now = new Date();

  // New card
  if (card.state === 'new' || card.reviewCount === 0) {
    const stability = initStability(ratingNum);
    const difficulty = initDifficulty(ratingNum);
    const interval = ratingNum === 1 ? 1 : stabilityToInterval(stability);

    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + interval);

    return {
      stability,
      difficulty,
      dueDate,
      state: ratingNum === 1 ? 'learning' : 'review',
      lapseCount: card.lapseCount,
    };
  }

  // Review card
  const elapsedDays = Math.max(1, Math.round(
    (now.getTime() - new Date(card.dueDate || now).getTime()) / (1000 * 60 * 60 * 24)
  ));
  const r = retrievability(card.stability, elapsedDays);

  let newStability: number;
  let newState: 'learning' | 'review' | 'relearning';
  let newLapseCount = card.lapseCount;

  if (ratingNum === 1) {
    // Forgot — lapse
    newStability = nextForgetStability(card.difficulty, card.stability, r);
    newState = 'relearning';
    newLapseCount += 1;
  } else {
    // Recalled
    newStability = nextRecallStability(card.difficulty, card.stability, r, ratingNum);
    newState = 'review';
  }

  const newDifficulty = nextDifficulty(card.difficulty, ratingNum);
  const interval = ratingNum === 1 ? 1 : stabilityToInterval(newStability);

  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    stability: newStability,
    difficulty: newDifficulty,
    dueDate,
    state: newState,
    lapseCount: newLapseCount,
  };
}

/** Get cards that are due for review */
export function isDue(dueDate: Date): boolean {
  return new Date(dueDate) <= new Date();
}
