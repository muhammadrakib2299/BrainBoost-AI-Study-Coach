'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { Mail, MessageSquare, Clock, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@brainboost.app', href: 'mailto:support@brainboost.app' },
  { icon: MessageSquare, label: 'Response Time', value: 'Within 24 hours', href: null },
  { icon: Clock, label: 'Support Hours', value: 'Mon-Fri, 9am-6pm EST', href: null },
  { icon: MapPin, label: 'Location', value: 'Remote-first team', href: null },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    // Simulate sending (replace with real API)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSending(false);
  }

  return (
    <PublicLayout>
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Have a question, feedback, or need help? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4 p-4 rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="font-medium text-primary hover:underline text-sm">{info.value}</a>
                    ) : (
                      <p className="font-medium text-sm">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="border border-border rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1.5">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1.5">Subject</label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Question</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1.5">Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                    placeholder="How can we help?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
