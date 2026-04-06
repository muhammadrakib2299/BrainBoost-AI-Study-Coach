import { PublicLayout } from '@/components/layout/public-layout';

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10">Last updated: April 6, 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
                <li><strong>Study Content:</strong> PDFs, notes, and other materials you upload for processing.</li>
                <li><strong>Usage Data:</strong> Quiz scores, review history, study progress, and feature interactions.</li>
                <li><strong>Payment Information:</strong> Processed securely through Stripe. We never store your card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                <li>To provide and improve BrainBoost&apos;s AI-powered study features.</li>
                <li>To generate flashcards, quizzes, and summaries from your uploaded content.</li>
                <li>To personalize your study schedule using spaced repetition algorithms.</li>
                <li>To send you study reminders and streak notifications (with your permission).</li>
                <li>To process payments and manage your subscription.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. AI Processing</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Your uploaded study materials are processed using Anthropic&apos;s Claude AI to generate flashcards, quizzes, summaries, and tutor responses. Your content is sent to the AI API for processing but is not used to train AI models. We retain your content only for the purpose of providing study features within your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Data Storage & Security</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Your data is stored securely in encrypted databases (PostgreSQL via Supabase). We use industry-standard security measures including HTTPS encryption, secure authentication, and regular security audits. We never sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed text-sm mb-3">We only share your data with:</p>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                <li><strong>Anthropic (Claude AI):</strong> To process your study content for AI features.</li>
                <li><strong>Supabase:</strong> For authentication and file storage.</li>
                <li><strong>Stripe:</strong> For payment processing (Pro/Teams plans).</li>
                <li><strong>Resend:</strong> For email notifications (reminders, alerts).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Your Rights</h2>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                <li><strong>Access:</strong> Request a copy of your personal data at any time.</li>
                <li><strong>Delete:</strong> Delete your account and all associated data from your profile settings.</li>
                <li><strong>Export:</strong> Export your flashcard decks and study data.</li>
                <li><strong>Opt-out:</strong> Disable email notifications from your profile preferences.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We use essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@brainboost.app" className="text-primary hover:underline">privacy@brainboost.app</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
