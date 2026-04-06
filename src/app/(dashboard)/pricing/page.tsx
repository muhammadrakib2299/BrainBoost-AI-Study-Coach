'use client';

import { useState } from 'react';
import { PLANS } from '@/lib/stripe';

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(plan: 'pro' | 'teams') {
    setLoading(plan);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const result = await response.json();

      if (result.success && result.data.url) {
        window.location.href = result.data.url;
      }
    } catch {
      // Handle error
    } finally {
      setLoading(null);
    }
  }

  const plans = [
    {
      key: 'free' as const,
      name: PLANS.free.name,
      price: '$0',
      period: 'forever',
      features: PLANS.free.features,
      cta: 'Current Plan',
      disabled: true,
    },
    {
      key: 'pro' as const,
      name: PLANS.pro.name,
      price: '$8',
      period: '/month',
      features: PLANS.pro.features,
      cta: 'Upgrade to Pro',
      disabled: false,
      popular: true,
    },
    {
      key: 'teams' as const,
      name: PLANS.teams.name,
      price: '$5',
      period: '/user/month',
      features: PLANS.teams.features,
      cta: 'Get Teams',
      disabled: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold mb-2">Choose your plan</h1>
        <p className="text-muted-foreground">Upgrade to unlock unlimited AI features.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`border rounded-lg p-6 relative ${
              plan.popular ? 'border-primary shadow-md' : 'border-border'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => !plan.disabled && plan.key !== 'free' && handleUpgrade(plan.key as 'pro' | 'teams')}
              disabled={plan.disabled || loading === plan.key}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-opacity ${
                plan.popular
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'border border-border hover:bg-secondary'
              } disabled:opacity-50`}
            >
              {loading === plan.key ? 'Loading...' : plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
