import { PublicLayout } from '@/components/layout/public-layout';
import Link from 'next/link';
import {
  Upload,
  Brain,
  PenTool,
  RefreshCw,
  BarChart3,
  CalendarDays,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Upload Your Study Material',
    desc: 'Drop a PDF, paste your notes, link a webpage, or upload an image of your textbook. Our AI reads and understands everything — text, diagrams, tables, even handwriting.',
    icon: Upload,
    features: ['PDF parsing', 'Image OCR via Claude Vision', 'URL content extraction', 'Copy-paste notes'],
  },
  {
    step: '02',
    title: 'AI Generates Your Study Tools',
    desc: 'Within seconds, BrainBoost creates a full set of flashcards, quizzes, and summaries from your material. Every card is editable — you\'re always in control.',
    icon: Brain,
    features: ['Auto-generated Q&A flashcards', 'Multiple quiz types', 'Summaries in 3 detail levels', 'Cornell Notes & mind maps'],
  },
  {
    step: '03',
    title: 'Study with Smart Quizzes',
    desc: 'Test yourself with multiple choice, true/false, fill-in-the-blank, and essay questions. Get instant AI explanations when you get something wrong.',
    icon: PenTool,
    features: ['4 question types', 'Timed exam simulation', 'Instant AI explanations', 'Score tracking'],
  },
  {
    step: '04',
    title: 'Review with Spaced Repetition',
    desc: 'Our FSRS algorithm tracks what you know and schedules reviews at the optimal time. Hard cards come back sooner, easy cards later. You remember more with less effort.',
    icon: RefreshCw,
    features: ['FSRS algorithm (next-gen)', 'Again / Hard / Good / Easy ratings', 'Automatic scheduling', 'Weak spot detection'],
  },
  {
    step: '05',
    title: 'Chat with Your AI Tutor',
    desc: 'Stuck on something? Ask your AI tutor to explain it differently, give an analogy, or break it down like you\'re 5. It knows your study material inside out.',
    icon: MessageCircle,
    features: ['Persistent per-topic chat', 'Streaming responses', 'Quick actions', 'Context-aware answers'],
  },
  {
    step: '06',
    title: 'Track Progress & Plan',
    desc: 'See your mastery grow with detailed dashboards. Set your exam date and get an AI-generated day-by-day study plan that prioritizes your weak spots.',
    icon: BarChart3,
    features: ['Exam readiness score', 'Topic mastery charts', 'Daily streak tracking', 'Calendar sync (iCal/Google)'],
  },
];

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            How <span className="text-primary">BrainBoost</span> Works
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From upload to exam day — here&apos;s exactly how BrainBoost turns your study material into an optimized learning experience.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="max-w-4xl mx-auto space-y-16">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className={`flex flex-col md:flex-row gap-8 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <span className="text-xs font-bold text-primary tracking-widest">STEP {step.step}</span>
                <h3 className="text-xl sm:text-2xl font-bold mt-1 mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{step.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {step.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/30 text-center">
        <div className="max-w-2xl mx-auto">
          <CalendarDays className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">Create your free account and upload your first notes in under 2 minutes.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-primary/90 transition-colors"
          >
            Start studying for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
