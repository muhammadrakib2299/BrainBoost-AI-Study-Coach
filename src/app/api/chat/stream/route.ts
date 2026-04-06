import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/claude';
import { db } from '@/lib/db';
import { TUTOR_SYSTEM_PROMPT } from '@/lib/prompts';
import { checkAiLimit } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const aiLimit = await checkAiLimit(user.id);
    if (!aiLimit.allowed) {
      return new Response(JSON.stringify({ error: aiLimit.message }), { status: 403 });
    }

    const { deckId, message } = await request.json();

    if (!deckId || !message) {
      return new Response(JSON.stringify({ error: 'Deck ID and message required' }), { status: 400 });
    }

    const deck = await db.deck.findFirst({
      where: { id: deckId, userId: user.id },
    });

    if (!deck) {
      return new Response(JSON.stringify({ error: 'Deck not found' }), { status: 404 });
    }

    // Save user message
    await db.chatMessage.create({
      data: { deckId, userId: user.id, role: 'USER', content: message },
    });

    // Get history
    const history = await db.chatMessage.findMany({
      where: { deckId, userId: user.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const systemPrompt =
      TUTOR_SYSTEM_PROMPT + (deck.sourceContent?.slice(0, 8000) || 'No content available.');

    const messages = history.map((msg) => ({
      role: msg.role === 'USER' ? ('user' as const) : ('assistant' as const),
      content: msg.content,
    }));

    // Stream response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();
    let fullResponse = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const text = event.delta.text;
              fullResponse += text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }

          // Save complete assistant message
          await db.chatMessage.create({
            data: { deckId, userId: user.id, role: 'ASSISTANT', content: fullResponse },
          });

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat stream error:', error);
    return new Response(JSON.stringify({ error: 'Failed to stream response' }), { status: 500 });
  }
}
