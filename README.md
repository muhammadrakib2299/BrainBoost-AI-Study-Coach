# BrainBoost — AI Study Coach

Upload any notes, PDF, or textbook chapter — even images and diagrams. The AI extracts key concepts, generates flashcards and quizzes, acts as a personal tutor, tracks what you know, and builds a smart daily study schedule using spaced repetition — so you study smarter, not harder.

## Core Features (MVP)

- **PDF / Note Upload + Image OCR** — Upload PDFs, paste text, or link a URL. AI parses text, diagrams, tables, and handwritten notes using Claude's vision.
- **AI Flashcard Generator** — Auto-creates Q&A flashcards from your content. Edit, regenerate, or export to Anki (.apkg) or printable PDF.
- **Smart Quiz Mode** — Multiple choice, true/false, fill-in-the-blank, and essay-type quizzes with AI grading. Includes timed mode for exam simulation.
- **FSRS Spaced Repetition** — FSRS algorithm (successor to SM-2) schedules reviews based on how well you know each card. Hard cards come back sooner.
- **Study Schedule + Calendar Sync** — Set your exam date. AI builds a day-by-day plan prioritizing weak topics. Syncs to Google Calendar / iCal.
- **Progress Dashboard + Exam Readiness** — Track mastery per topic, daily streaks, quiz scores, and time studied. Predicted exam readiness score.
- **AI Tutor Chat** — Persistent AI chat per topic — ask follow-up questions, request analogies, or say "explain like I'm 5."
- **Summary Generator** — One-click summaries in multiple formats — brief/medium/deep, Cornell Notes, or visual mind map.
- **Active Recall Writing** — Write what you remember from memory. AI compares your response against source material and scores completeness.
- **Weak Spot Drills** — AI analyzes mistake patterns and generates targeted drill sets that attack specific weaknesses.

## Post-MVP Features (Phase 2)

- **Collaborative Study Rooms** — Share decks, quiz each other in real-time, group leaderboards.
- **Concept Map / Knowledge Graph** — Auto-generated visual map showing how concepts relate and where gaps exist.
- **Voice Input / Audio Notes** — Record lectures, Whisper API transcribes, AI generates cards. Audio-based review on the go.
- **Multi-format Export** — Export to Anki (.apkg), printable PDF study sheets, or shareable links.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router + SSR), React 18, Tailwind CSS, Framer Motion |
| **AI / Backend** | Claude API + Vision, PDF.js / pdf-parse, Next.js API Routes, FSRS Algorithm |
| **Data** | PostgreSQL, Prisma ORM, Supabase (Auth + Storage), Redis |
| **DevOps / Tools** | Vercel, Stripe, Recharts, Resend |

## MVP Build Roadmap

| Week | Milestone | Details |
|---|---|---|
| 1 | Upload + Parse + Image OCR | File upload UI, PDF extraction, Claude Vision for diagrams/tables, Supabase auth |
| 2 | AI Flashcard Generation + Tutor Chat | Claude API prompts, Q&A generation, flashcard CRUD, persistent tutor chat |
| 3 | Quiz Mode + Active Recall + Scoring | Multiple quiz types, timed mode, active recall writing, weak spot analysis |
| 4 | FSRS Spaced Repetition Engine | FSRS algorithm, card rating system, review scheduling, weak spot drills |
| 5 | Dashboard + Schedule + Calendar Sync | Progress charts, exam readiness score, AI study plan, Google Calendar / iCal sync |
| 6 | Polish + Launch | Stripe payments (free/pro tiers), email reminders, summary generator, mobile responsiveness, deploy to Vercel |

## Monetization

| Tier | Price | Includes |
|---|---|---|
| **Free** | $0 | 3 decks, 10 AI explanations/day, basic quiz mode |
| **Pro** | $8/mo | Unlimited decks, unlimited AI tutor, timed exams, calendar sync, Anki export |
| **Teams** | $5/user/mo | Study rooms, shared decks, group leaderboards, educator dashboard |
| **API** | Custom | Programmatic flashcard generation and progress tracking |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/muhammadrakib2299/BrainBoost-AI-Study-Coach.git
cd BrainBoost-AI-Study-Coach

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Claude API key, Supabase credentials, Stripe keys, etc.

# Run the development server
npm run dev
```

## License

MIT
