import { PublicLayout } from '@/components/layout/public-layout';
import Link from 'next/link';
import { Clock, ArrowRight, BookOpen, Brain, Target, Lightbulb, PenTool, RefreshCw } from 'lucide-react';

const featuredPost = {
  slug: '#',
  title: 'The Science Behind Spaced Repetition: Why FSRS Beats SM-2',
  excerpt: 'Discover how the Free Spaced Repetition Scheduler (FSRS) algorithm works and why it produces 20% better retention rates than the traditional SM-2 algorithm used by Anki.',
  category: 'Learning Science',
  readTime: '8 min read',
  date: 'April 2, 2026',
  icon: Brain,
};

const posts = [
  {
    slug: '#',
    title: 'How to Study for Finals in 2 Weeks: A Complete Guide',
    excerpt: 'A practical day-by-day breakdown for students who need to prepare for multiple exams in a short timeframe.',
    category: 'Study Tips',
    readTime: '6 min read',
    date: 'March 28, 2026',
    icon: Target,
  },
  {
    slug: '#',
    title: 'Active Recall vs Passive Reading: Which Study Method Wins?',
    excerpt: 'Research shows active recall is 150% more effective than re-reading. Here\'s how to implement it with BrainBoost.',
    category: 'Learning Science',
    readTime: '5 min read',
    date: 'March 22, 2026',
    icon: Lightbulb,
  },
  {
    slug: '#',
    title: '5 Common Study Mistakes That Are Killing Your Grades',
    excerpt: 'From highlighting everything to cramming the night before — learn what actually works according to cognitive science.',
    category: 'Study Tips',
    readTime: '4 min read',
    date: 'March 15, 2026',
    icon: PenTool,
  },
  {
    slug: '#',
    title: 'How AI is Transforming Education in 2026',
    excerpt: 'From personalized tutoring to automated assessment — a look at how AI tools like BrainBoost are changing how students learn.',
    category: 'AI & Education',
    readTime: '7 min read',
    date: 'March 10, 2026',
    icon: Brain,
  },
  {
    slug: '#',
    title: 'The Ultimate Guide to Cornell Notes (with AI)',
    excerpt: 'Learn the Cornell note-taking system and how BrainBoost can automatically convert your notes into this proven format.',
    category: 'Study Methods',
    readTime: '5 min read',
    date: 'March 5, 2026',
    icon: BookOpen,
  },
  {
    slug: '#',
    title: 'Why Your Study Streak Matters More Than You Think',
    excerpt: 'Consistency beats intensity. Here\'s the science behind daily study habits and how streaks build long-term memory.',
    category: 'Productivity',
    readTime: '4 min read',
    date: 'February 28, 2026',
    icon: RefreshCw,
  },
];

export default function BlogPage() {
  return (
    <PublicLayout>
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Blog & Resources</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Study tips, learning science, and product updates to help you study smarter.
            </p>
          </div>

          {/* Featured post */}
          <Link
            href={featuredPost.slug}
            className="block rounded-2xl border border-border bg-card p-6 sm:p-8 mb-10 card-hover"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <featuredPost.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {featuredPost.readTime}
                  </span>
                  <span className="text-xs text-muted-foreground">{featuredPost.date}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">{featuredPost.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{featuredPost.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-primary font-medium text-sm mt-3">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Post grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.title}
                href={post.slug}
                className="rounded-2xl border border-border bg-card p-5 card-hover flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <post.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="font-semibold mb-2 leading-snug">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
