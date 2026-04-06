import Stripe from 'stripe';

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(key, {
    typescript: true,
  });
}

// Lazy initialization — only created when actually used at runtime
let _stripe: Stripe | null = null;
export function getStripe() {
  if (!_stripe) _stripe = getStripeClient();
  return _stripe;
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['3 decks', '10 AI explanations/day', 'Basic quiz mode'],
  },
  pro: {
    name: 'Pro',
    price: 800,
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
    price: 500,
    priceId: process.env.STRIPE_TEAMS_PRICE_ID,
    features: [
      'Collaborative study rooms',
      'Shared decks',
      'Group leaderboards',
      'Educator dashboard',
    ],
  },
} as const;
