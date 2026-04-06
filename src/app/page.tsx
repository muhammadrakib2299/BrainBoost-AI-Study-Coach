import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  FileText,
  Brain,
  PenTool,
  RefreshCw,
  MessageCircle,
  BarChart3,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    title: 'Smart Upload',
    desc: 'Upload PDFs, images, or paste notes. AI extracts key concepts — even from diagrams and handwriting.',
    icon: FileText,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'AI Flashcards',
    desc: 'Auto-generate Q&A flashcards from any content. Edit, regenerate, or export to Anki.',
    icon: Brain,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    title: 'Smart Quizzes',
    desc: 'Multiple choice, essay, and timed exams with instant AI grading and detailed explanations.',
    icon: PenTool,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'FSRS Repetition',
    desc: 'Next-gen spaced repetition algorithm schedules reviews so you remember more with less effort.',
    icon: RefreshCw,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    title: 'AI Tutor Chat',
    desc: 'Ask follow-ups, get analogies, or say "explain like I\'m 5" — persistent chat per topic.',
    icon: MessageCircle,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
  {
    title: 'Exam Readiness',
    desc: 'Track mastery, streaks, and get a predicted readiness score before your exam day.',
    icon: BarChart3,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
];

const stats = [
  { value: '10x', label: 'Faster studying', icon: Zap },
  { value: '95%', label: 'Retention rate', icon: Target },
  { value: '50K+', label: 'Cards generated', icon: BookOpen },
  { value: '24/7', label: 'AI tutor access', icon: Clock },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">BrainBoost</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.login}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Log in
            </Link>
            <Link
              href={ROUTES.signup}
              className="text-sm bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Study Coach
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Study smarter with{' '}
            <span className="text-primary">AI that adapts</span>
            {' '}to you
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your notes and let AI generate flashcards, quizzes, and a personalized study
            schedule. Powered by spaced repetition science.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={ROUTES.signup}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-primary/90 transition-colors"
            >
              Start studying for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 border border-border bg-card px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-secondary transition-colors"
            >
              See how it works
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Free to start</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> AI-powered</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-5 rounded-2xl bg-card border border-border">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to <span className="text-primary">ace your exams</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From upload to exam day — BrainBoost handles the heavy lifting so you can focus on learning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 card-hover"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">Three steps to smarter studying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload your material',
                desc: 'Drop a PDF, paste notes, or snap a photo. AI extracts every key concept.',
                icon: FileText,
              },
              {
                step: '2',
                title: 'AI generates study tools',
                desc: 'Get flashcards, quizzes, and summaries instantly. Edit anything you want.',
                icon: Brain,
              },
              {
                step: '3',
                title: 'Study with smart scheduling',
                desc: 'FSRS tracks what you know and schedules reviews at the perfect time.',
                icon: Target,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mt-1 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl bg-primary p-8 sm:p-12 lg:p-16">
            <Shield className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to boost your grades?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Join thousands of students studying smarter with AI.
            </p>
            <Link
              href={ROUTES.signup}
              className="inline-flex items-center gap-2 bg-white text-foreground px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-white/90 transition-colors"
            >
              Start studying now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold">BrainBoost</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BrainBoost. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
