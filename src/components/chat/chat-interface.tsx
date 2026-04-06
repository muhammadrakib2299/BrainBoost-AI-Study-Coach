'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

const quickActions = [
  { label: 'Explain like I\'m 5', prompt: 'Can you explain this topic like I\'m 5 years old?' },
  { label: 'Give me an analogy', prompt: 'Can you give me a helpful analogy to understand this better?' },
  { label: 'Show an example', prompt: 'Can you show me a concrete example of this concept?' },
  { label: 'Summarize key points', prompt: 'Can you summarize the key points I should remember?' },
];

export function ChatInterface({ deckId, deckTitle }: { deckId: string; deckTitle: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch(`/api/chat?deckId=${deckId}`);
        const result = await response.json();
        if (result.success) {
          setMessages(result.data);
        }
      } catch {
        // Silently fail
      } finally {
        setHistoryLoaded(true);
      }
    }
    loadHistory();
  }, [deckId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId, message: content }),
      });

      const result = await response.json();

      if (result.success) {
        setMessages((prev) => [...prev, result.data.message]);
      }
    } catch {
      // Show error as assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'ASSISTANT',
          content: 'Sorry, something went wrong. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="font-semibold">AI Tutor</h2>
        <p className="text-sm text-muted-foreground">Studying: {deckTitle}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto space-y-4 mb-4">
        {!historyLoaded ? (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2">Ask me anything about this topic!</p>
            <p className="text-sm text-muted-foreground mb-6">
              I can explain concepts, give analogies, or help you understand tricky parts.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  className="text-sm border border-border px-3 py-1.5 rounded-full hover:bg-secondary transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'USER'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary px-4 py-2.5 rounded-lg text-sm text-muted-foreground">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions (when conversation is active) */}
      {messages.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.prompt)}
              disabled={loading}
              className="text-xs border border-border px-2.5 py-1 rounded-full hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          placeholder="Ask your AI tutor anything..."
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
