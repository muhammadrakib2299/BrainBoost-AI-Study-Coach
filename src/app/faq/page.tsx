'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqCategories = [
  {
    category: 'Getting Started',
    questions: [
      { q: 'What is BrainBoost?', a: 'BrainBoost is an AI-powered study coach that turns your notes, PDFs, and textbook chapters into flashcards, quizzes, and personalized study schedules using spaced repetition science.' },
      { q: 'Is BrainBoost free?', a: 'Yes! The free plan includes 3 decks, 10 AI explanations per day, basic quiz mode, and FSRS spaced repetition. Upgrade to Pro for unlimited access.' },
      { q: 'What file types can I upload?', a: 'You can upload PDFs, images (JPG, PNG, GIF, WebP), paste text directly, or provide a URL. Our AI can extract text from images, diagrams, and even handwritten notes.' },
      { q: 'Do I need to install anything?', a: 'No. BrainBoost is a web app that works in your browser on desktop, tablet, and mobile. No download required.' },
    ],
  },
  {
    category: 'AI Features',
    questions: [
      { q: 'How does the AI generate flashcards?', a: 'We use Claude AI to analyze your uploaded material, identify key concepts, definitions, and relationships, then generate question-and-answer pairs. You can edit or regenerate any card.' },
      { q: 'What is the AI Tutor?', a: 'The AI Tutor is a persistent chat per topic where you can ask follow-up questions, request analogies, or say "explain like I\'m 5." It knows your study material and adapts to your level.' },
      { q: 'How accurate is the AI?', a: 'Claude AI is highly capable, but we always recommend reviewing generated content. You can edit any flashcard, quiz question, or summary to ensure accuracy.' },
      { q: 'What quiz types are available?', a: 'Multiple choice, true/false, fill-in-the-blank, and essay questions. The AI generates questions based on your flashcards and grades essay responses.' },
    ],
  },
  {
    category: 'Spaced Repetition',
    questions: [
      { q: 'What is FSRS?', a: 'FSRS (Free Spaced Repetition Scheduler) is a next-generation algorithm that replaced SM-2. It\'s more accurate at predicting when you\'ll forget something, so you review at the perfect time.' },
      { q: 'How does spaced repetition work?', a: 'After reviewing a card, you rate it (Again, Hard, Good, Easy). The algorithm calculates when you\'re most likely to forget and schedules the next review. Hard cards come back sooner, easy cards later.' },
      { q: 'Can I use it without spaced repetition?', a: 'Absolutely. You can review cards manually, take quizzes, or use the AI tutor without following the spaced repetition schedule.' },
    ],
  },
  {
    category: 'Account & Billing',
    questions: [
      { q: 'Can I cancel my subscription?', a: 'Yes, cancel anytime from your profile settings. You\'ll keep access until the end of your current billing period.' },
      { q: 'Is there a student discount?', a: 'Yes! Email us from your .edu address and we\'ll apply a 20% discount to Pro plans.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex) via Stripe. All payments are secure and encrypted.' },
      { q: 'Can I export my data?', a: 'Pro users can export flashcard decks to Anki (.apkg) format or printable PDFs. You always own your data.' },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/50 transition-colors"
      >
        <span className="font-medium text-sm sm:text-base pr-4">{q}</span>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <PublicLayout>
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">Everything you need to know about BrainBoost.</p>
          </div>

          <div className="space-y-10">
            {faqCategories.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-lg font-bold mb-4 text-primary">{cat.category}</h2>
                <div className="space-y-3">
                  {cat.questions.map((faq) => (
                    <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
