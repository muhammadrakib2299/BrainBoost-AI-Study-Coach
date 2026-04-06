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
- [ ] Build file upload UI (drag & drop + file picker)
- [ ] Implement PDF text extraction with pdf-parse
- [ ] Implement image/diagram OCR using Claude Vision API
- [ ] Handle paste-text input
- [ ] Handle URL input (fetch and extract page content)
- [ ] Store raw extracted content in database
- [ ] Show upload progress and extraction status
- [ ] Add file size and type validation

---

## Week 2 — AI Flashcard Generation + Tutor Chat

### Flashcard Generation
- [ ] Design Claude API prompt for concept extraction
- [ ] Design Claude API prompt for Q&A pair generation
- [ ] Build API route: POST /api/flashcards/generate
- [ ] Create flashcard deck view UI
- [ ] Add card flip animation (Framer Motion)
- [ ] Implement edit card functionality
- [ ] Implement delete card functionality
- [ ] Add "regenerate card" with Claude API
- [ ] Add manual card creation
- [ ] Implement deck management (create, rename, delete decks)

### AI Tutor Chat
- [ ] Build chat UI component (per topic/deck)
- [ ] Build API route: POST /api/chat
- [ ] Design Claude API system prompt for tutor persona
- [ ] Implement conversation history storage in DB
- [ ] Add "explain like I'm 5" quick action
- [ ] Add "give me an analogy" quick action
- [ ] Add "show me an example" quick action
- [ ] Stream AI responses for better UX

---

## Week 3 — Quiz Mode + Active Recall + Scoring

### Quiz Engine
- [ ] Build API route: POST /api/quiz/generate
- [ ] Design Claude prompt for multiple choice question generation
- [ ] Design Claude prompt for true/false question generation
- [ ] Design Claude prompt for fill-in-the-blank generation
- [ ] Design Claude prompt for essay-type question generation
- [ ] Build quiz UI — question display + answer selection
- [ ] Implement answer validation and scoring
- [ ] Add AI explanation on wrong answers (Claude API)
- [ ] Build quiz results summary page

### Timed Exam Mode
- [ ] Add countdown timer component
- [ ] Implement configurable time limits
- [ ] Auto-submit on timer expiry
- [ ] Show time-per-question stats in results

### Active Recall Writing
- [ ] Build writing prompt UI (topic displayed, textarea for response)
- [ ] Build API route: POST /api/recall/evaluate
- [ ] Design Claude prompt to compare response vs source material
- [ ] Display completeness score + missed concepts
- [ ] Save recall attempts to progress history

### Weak Spot Analysis
- [ ] Track wrong answers by topic/concept
- [ ] Build API route: GET /api/analytics/weak-spots
- [ ] Identify mistake patterns (confused terms, missed edge cases)
- [ ] Store weak spot data per user per deck

---

## Week 4 — FSRS Spaced Repetition Engine

### FSRS Algorithm
- [ ] Implement FSRS core algorithm (stability, difficulty, retrievability)
- [ ] Build card rating UI: Again / Hard / Good / Easy buttons
- [ ] Calculate next review date based on rating
- [ ] Build API route: POST /api/review/rate
- [ ] Build API route: GET /api/review/due (fetch today's due cards)
- [ ] Create review session UI (card queue)
- [ ] Show cards due count on dashboard
- [ ] Handle new cards vs review cards scheduling

### Weak Spot Drills
- [ ] Build API route: POST /api/drills/generate
- [ ] Design Claude prompt to generate targeted drills from weak spot data
- [ ] Create drill session UI
- [ ] Track drill performance and update weak spot scores

---

## Week 5 — Dashboard + Schedule + Calendar Sync

### Progress Dashboard
- [ ] Build dashboard layout page
- [ ] Implement topic mastery percentage chart (Recharts)
- [ ] Implement daily study streak tracker
- [ ] Implement quiz score history chart
- [ ] Implement time studied chart
- [ ] Add cards reviewed today / this week stats
- [ ] Build exam readiness score algorithm
- [ ] Display predicted readiness score prominently

### Study Schedule
- [ ] Build exam date input UI
- [ ] Design Claude prompt to generate day-by-day study plan
- [ ] Build API route: POST /api/schedule/generate
- [ ] Display study plan in calendar/list view
- [ ] Allow manual adjustments to the plan
- [ ] Auto-prioritize weak topics in the schedule

### Calendar Sync
- [ ] Implement Google Calendar API integration
- [ ] Implement iCal (.ics) export
- [ ] Build API route: POST /api/calendar/sync
- [ ] Add study block events to external calendar
- [ ] Handle calendar re-sync on schedule changes

---

## Week 6 — Polish + Launch

### Summary Generator
- [ ] Build API route: POST /api/summary/generate
- [ ] Design Claude prompts for brief / medium / deep summaries
- [ ] Design Claude prompt for Cornell Notes format output
- [ ] Design Claude prompt for mind map structured output
- [ ] Build summary display UI with format toggle

### Payments (Stripe)
- [ ] Set up Stripe account and API keys
- [ ] Create Free and Pro product/price in Stripe
- [ ] Build API route: POST /api/stripe/checkout
- [ ] Build API route: POST /api/stripe/webhook
- [ ] Implement subscription status check middleware
- [ ] Build pricing page UI
- [ ] Add upgrade prompts on free tier limits (3 decks, 10 AI/day)
- [ ] Handle subscription cancellation

### Email Reminders (Resend)
- [ ] Set up Resend account and API key
- [ ] Build daily study reminder email template
- [ ] Build API route or cron: send reminder emails
- [ ] Add email preference settings in user profile
- [ ] Send streak-at-risk notifications

### Polish + Responsive
- [ ] Mobile responsive — all pages
- [ ] Loading states and skeleton screens
- [ ] Error handling and toast notifications
- [ ] Empty states for decks, quizzes, dashboard
- [ ] SEO: meta tags, Open Graph, favicon
- [ ] Landing page with feature showcase
- [ ] 404 and error pages

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
