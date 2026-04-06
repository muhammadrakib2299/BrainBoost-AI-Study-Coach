import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const features = [
  {
    title: 'PDF & Image Upload',
    desc: 'Upload PDFs, paste text, or images. AI extracts key concepts — even from diagrams and handwriting.',
    icon: '📄',
  },
  {
    title: 'AI Flashcards',
    desc: 'Auto-generate Q&A flashcards from your content. Edit, regenerate, or export to Anki.',
    icon: '🃏',
  },
  {
    title: 'Smart Quizzes',
    desc: 'Multiple choice, essay, and timed exams with instant AI grading and explanations.',
    icon: '✍️',
  },
  {
    title: 'FSRS Spaced Repetition',
    desc: 'Next-gen algorithm schedules reviews so you remember more with less effort.',
    icon: '🔁',
  },
  {
    title: 'AI Tutor Chat',
    desc: 'Ask follow-ups, get analogies, or say "explain like I\'m 5" — per topic.',
    icon: '💬',
  },
  {
    title: 'Exam Readiness Score',
    desc: 'Track mastery, streaks, and get a predicted readiness score before your exam.',
    icon: '📊',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">BrainBoost</span>
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.login}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href={ROUTES.signup}
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Study smarter, not harder
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Upload your notes, PDFs, or textbook chapters. BrainBoost&apos;s AI extracts key concepts,
          generates flashcards and quizzes, and builds a personalized study schedule — all powered by
          spaced repetition.
        </p>
        <div className="flex gap-4">
          <Link
            href={ROUTES.signup}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
          >
            Get started for free
          </Link>
          <Link
            href="#features"
            className="border border-border px-6 py-3 rounded-lg text-base font-medium hover:bg-secondary transition-colors"
          >
            See features
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-12">Everything you need to ace your exams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to boost your grades?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of students studying smarter with AI-powered tools.
        </p>
        <Link
          href={ROUTES.signup}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
        >
          Start studying now
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} BrainBoost. All rights reserved.
      </footer>
    </div>
  );
}
