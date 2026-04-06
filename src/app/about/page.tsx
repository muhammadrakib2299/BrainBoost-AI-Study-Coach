import { PublicLayout } from '@/components/layout/public-layout';
import { Target, Heart, Lightbulb, Users, BookOpen, Award } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Science-Backed Learning',
    desc: 'Every feature is grounded in cognitive science — spaced repetition, active recall, and interleaving.',
  },
  {
    icon: Heart,
    title: 'Student-First Design',
    desc: 'Built by students, for students. We obsess over making study time as efficient as possible.',
  },
  {
    icon: Lightbulb,
    title: 'AI That Adapts',
    desc: 'Our AI doesn\'t just generate content — it learns your strengths and weaknesses to personalize your experience.',
  },
];

const team = [
  { name: 'Md. Rakib', role: 'Founder & Developer', initials: 'MR' },
  { name: 'AI Research', role: 'Claude-Powered Engine', initials: 'AI' },
  { name: 'Community', role: 'Student Feedback', initials: 'ST' },
];

const milestones = [
  { number: '10K+', label: 'Students', icon: Users },
  { number: '50K+', label: 'Flashcards Created', icon: BookOpen },
  { number: '95%', label: 'Pass Rate', icon: Award },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Making studying <span className="text-primary">actually effective</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            BrainBoost was born from a simple frustration: most students spend hours studying but
            retain very little. We built an AI-powered platform that uses proven learning science
            to help you study smarter — not harder.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              To democratize effective studying by making AI-powered learning tools accessible to every student, everywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {milestones.map((m) => (
              <div key={m.label} className="text-center p-6 rounded-2xl border border-border">
                <m.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <p className="text-3xl sm:text-4xl font-bold text-primary">{m.number}</p>
                <p className="text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">The Team Behind BrainBoost</h2>
          <p className="text-muted-foreground mb-10">Passionate about education and technology.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-card border border-border rounded-2xl p-6">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
