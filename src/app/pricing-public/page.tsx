import { PublicLayout } from '@/components/layout/public-layout';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for trying BrainBoost and light studying.',
    cta: 'Get Started Free',
    href: '/signup',
    popular: false,
    features: [
      { text: '3 decks', included: true },
      { text: '10 AI explanations/day', included: true },
      { text: 'Basic quiz mode', included: true },
      { text: 'FSRS spaced repetition', included: true },
      { text: 'Progress dashboard', included: true },
      { text: 'Unlimited decks', included: false },
      { text: 'AI tutor chat', included: false },
      { text: 'Timed exam mode', included: false },
      { text: 'Calendar sync', included: false },
      { text: 'Anki export', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$8',
    period: '/month',
    desc: 'For serious students who want the full AI advantage.',
    cta: 'Start Pro Trial',
    href: '/signup',
    popular: true,
    features: [
      { text: 'Unlimited decks', included: true },
      { text: 'Unlimited AI explanations', included: true },
      { text: 'All quiz modes', included: true },
      { text: 'FSRS spaced repetition', included: true },
      { text: 'Progress dashboard', included: true },
      { text: 'AI tutor chat (unlimited)', included: true },
      { text: 'Timed exam simulation', included: true },
      { text: 'Calendar sync (iCal/Google)', included: true },
      { text: 'Export to Anki', included: true },
      { text: 'Priority PDF processing', included: true },
    ],
  },
  {
    name: 'Teams',
    price: '$5',
    period: '/user/month',
    desc: 'For study groups, tutors, and classrooms.',
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Collaborative study rooms', included: true },
      { text: 'Shared decks', included: true },
      { text: 'Group leaderboards', included: true },
      { text: 'Educator dashboard', included: true },
      { text: 'Admin controls', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding', included: true },
      { text: 'API access', included: true },
      { text: 'SSO integration', included: true },
    ],
  },
];

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel your subscription anytime from your account settings. You\'ll keep access until the end of your billing period.' },
  { q: 'Is there a student discount?', a: 'Yes! Email us with your .edu address and we\'ll apply a 20% discount to Pro.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards via Stripe. Secure and encrypted.' },
];

export default function PricingPublicPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent <span className="text-primary">pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Start free. Upgrade when you&apos;re ready for unlimited AI power.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-5 sm:p-6 lg:p-7 relative flex flex-col ${
                plan.popular ? 'border-primary shadow-lg' : 'border-border'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                  Most Popular
                </span>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-2 mb-2">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    {f.included ? (
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={f.included ? '' : 'text-muted-foreground/50'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-colors flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'border border-border hover:bg-secondary'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ mini */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Pricing FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-card border border-border rounded-xl p-5">
                <p className="font-medium mb-1">{faq.q}</p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">Reach out to our team — we&apos;re happy to help.</p>
        <Link href="/contact" className="text-primary font-medium hover:underline">Contact us</Link>
      </section>
    </PublicLayout>
  );
}
