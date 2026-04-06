import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
});

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['3 decks', '10 AI explanations/day', 'Basic quiz mode'],
  },
  pro: {
    name: 'Pro',
    price: 800, // $8.00 in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited decks',
      'Unlimited AI tutor chat',
      'Timed exam mode',
      'Calendar sync',
      'Priority PDF processing',
      'Export to Anki',
    ],
  },
  teams: {
    name: 'Teams',
    price: 500, // $5.00/user in cents
    priceId: process.env.STRIPE_TEAMS_PRICE_ID,
    features: [
      'Collaborative study rooms',
      'Shared decks',
      'Group leaderboards',
      'Educator dashboard',
    ],
  },
} as const;
