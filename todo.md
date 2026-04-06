# BrainBoost — AI Study Coach: Build TODO

## Week 1 — Upload + Parse + Image OCR

### Project Setup
- [x] Initialize Next.js 14 project with App Router
- [x] Configure Tailwind CSS + Framer Motion
- [x] Set up Prisma ORM with PostgreSQL
- [ ] Set up Supabase project (Auth + File Storage)
- [x] Configure environment variables (.env.local)
- [x] Set up project folder structure
- [x] Set up ESLint + Prettier

### Authentication
- [x] Integrate Supabase Auth (email/password)
- [x] Add Google OAuth sign-in
- [x] Create sign-up / login pages
- [x] Build auth middleware for protected routes
- [x] Create user profile page

### Database Schema
- [x] Design and create Users table
- [x] Design and create Decks table
- [x] Design and create Flashcards table
- [x] Design and create Quizzes / QuizAttempts tables
- [x] Design and create StudyProgress table
- [x] Design and create ChatMessages table (for AI tutor)
- [ ] Run initial Prisma migration

### File Upload + Parsing
- [x] Build file upload UI (drag & drop + file picker)
- [x] Implement PDF text extraction with pdf-parse
- [x] Implement image/diagram OCR using Claude Vision API
- [x] Handle paste-text input
- [x] Handle URL input (fetch and extract page content)
- [x] Store raw extracted content in database
- [x] Show upload progress and extraction status
- [x] Add file size and type validation

---

## Week 2 — AI Flashcard Generation + Tutor Chat

### Flashcard Generation
- [x] Design Claude API prompt for concept extraction
- [x] Design Claude API prompt for Q&A pair generation
- [x] Build API route: POST /api/flashcards/generate
- [x] Create flashcard deck view UI
- [x] Add card flip animation (Framer Motion)
- [x] Implement edit card functionality
- [x] Implement delete card functionality
- [x] Add "regenerate card" with Claude API
- [x] Add manual card creation
- [x] Implement deck management (create, rename, delete decks)

### AI Tutor Chat
- [x] Build chat UI component (per topic/deck)
- [x] Build API route: POST /api/chat
- [x] Design Claude API system prompt for tutor persona
- [x] Implement conversation history storage in DB
- [x] Add "explain like I'm 5" quick action
- [x] Add "give me an analogy" quick action
- [x] Add "show me an example" quick action
- [ ] Stream AI responses for better UX

---

## Week 3 — Quiz Mode + Active Recall + Scoring

### Quiz Engine
- [x] Build API route: POST /api/quiz/generate
- [x] Design Claude prompt for multiple choice question generation
- [x] Design Claude prompt for true/false question generation
- [x] Design Claude prompt for fill-in-the-blank generation
- [x] Design Claude prompt for essay-type question generation
- [x] Build quiz UI — question display + answer selection
- [x] Implement answer validation and scoring
- [x] Add AI explanation on wrong answers (Claude API)
- [x] Build quiz results summary page

### Timed Exam Mode
- [x] Add countdown timer component
- [x] Implement configurable time limits
- [x] Auto-submit on timer expiry
- [x] Show time-per-question stats in results

### Active Recall Writing
- [x] Build writing prompt UI (topic displayed, textarea for response)
- [x] Build API route: POST /api/recall/evaluate
- [x] Design Claude prompt to compare response vs source material
- [x] Display completeness score + missed concepts
- [x] Save recall attempts to progress history

### Weak Spot Analysis
- [x] Track wrong answers by topic/concept
- [x] Build API route: GET /api/analytics/weak-spots
- [x] Identify mistake patterns (confused terms, missed edge cases)
- [x] Store weak spot data per user per deck

---

## Week 4 — FSRS Spaced Repetition Engine

### FSRS Algorithm
- [x] Implement FSRS core algorithm (stability, difficulty, retrievability)
- [x] Build card rating UI: Again / Hard / Good / Easy buttons
- [x] Calculate next review date based on rating
- [x] Build API route: POST /api/review/rate
- [x] Build API route: GET /api/review/due (fetch today's due cards)
- [x] Create review session UI (card queue)
- [x] Show cards due count on dashboard
- [x] Handle new cards vs review cards scheduling

### Weak Spot Drills
- [x] Build API route: POST /api/drills/generate
- [x] Design Claude prompt to generate targeted drills from weak spot data
- [x] Create drill session UI
- [x] Track drill performance and update weak spot scores

---

## Week 5 — Dashboard + Schedule + Calendar Sync

### Progress Dashboard
- [x] Build dashboard layout page
- [x] Implement topic mastery percentage chart (Recharts)
- [x] Implement daily study streak tracker
- [x] Implement quiz score history chart
- [x] Implement time studied chart
- [x] Add cards reviewed today / this week stats
- [x] Build exam readiness score algorithm
- [x] Display predicted readiness score prominently

### Study Schedule
- [x] Build exam date input UI
- [x] Design Claude prompt to generate day-by-day study plan
- [x] Build API route: POST /api/schedule/generate
- [x] Display study plan in calendar/list view
- [ ] Allow manual adjustments to the plan
- [x] Auto-prioritize weak topics in the schedule

### Calendar Sync
- [ ] Implement Google Calendar API integration
- [x] Implement iCal (.ics) export
- [x] Build API route: POST /api/calendar/sync
- [x] Add study block events to external calendar
- [ ] Handle calendar re-sync on schedule changes

---

## Week 6 — Polish + Launch

### Summary Generator
- [x] Build API route: POST /api/summary/generate
- [x] Design Claude prompts for brief / medium / deep summaries
- [x] Design Claude prompt for Cornell Notes format output
- [x] Design Claude prompt for mind map structured output
- [ ] Build summary display UI with format toggle

### Payments (Stripe)
- [x] Set up Stripe account and API keys
- [x] Create Free and Pro product/price in Stripe
- [x] Build API route: POST /api/stripe/checkout
- [x] Build API route: POST /api/stripe/webhook
- [ ] Implement subscription status check middleware
- [x] Build pricing page UI
- [ ] Add upgrade prompts on free tier limits (3 decks, 10 AI/day)
- [x] Handle subscription cancellation

### Email Reminders (Resend)
- [x] Set up Resend account and API key
- [x] Build daily study reminder email template
- [x] Build API route or cron: send reminder emails
- [ ] Add email preference settings in user profile
- [x] Send streak-at-risk notifications

### Polish + Responsive
- [ ] Mobile responsive — all pages
- [x] Loading states and skeleton screens
- [ ] Error handling and toast notifications
- [x] Empty states for decks, quizzes, dashboard
- [x] SEO: meta tags, Open Graph, favicon
- [x] Landing page with feature showcase
- [x] 404 and error pages

### Deploy
- [ ] Configure Vercel project
- [ ] Set environment variables on Vercel
- [ ] Set up PostgreSQL production database
- [ ] Set up Redis production instance
- [ ] Configure Supabase production project
- [ ] Test full flow in production
- [ ] Connect custom domain (if applicable)

---

## Post-MVP (Phase 2)
- [ ] Collaborative study rooms (real-time with WebSockets)
- [ ] Concept map / knowledge graph visualization
- [ ] Voice input / audio notes (Whisper API)
- [ ] Multi-format export (Anki .apkg, PDF sheets, shareable links)
- [ ] Teams tier with educator dashboard
- [ ] API access for third-party integrations
