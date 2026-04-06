import { NextRequest, NextResponse } from 'next/server';
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
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check AI usage limit
    const aiLimit = await checkAiLimit(user.id);
    if (!aiLimit.allowed) {
      return NextResponse.json({ success: false, error: aiLimit.message }, { status: 403 });
    }

    const { deckId, message } = await request.json();

    if (!deckId || !message) {
      return NextResponse.json(
        { success: false, error: 'Deck ID and message required' },
        { status: 400 }
      );
    }

    const deck = await db.deck.findFirst({
      where: { id: deckId, userId: user.id },
    });

    if (!deck) {
      return NextResponse.json({ success: false, error: 'Deck not found' }, { status: 404 });
    }

    // Save user message
    await db.chatMessage.create({
      data: {
        deckId,
        userId: user.id,
        role: 'USER',
        content: message,
      },
    });

    // Fetch recent conversation history
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

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    const assistantMessage = textBlock && textBlock.type === 'text' ? textBlock.text : 'I couldn\'t generate a response. Please try again.';

    // Save assistant message
    const saved = await db.chatMessage.create({
      data: {
        deckId,
        userId: user.id,
        role: 'ASSISTANT',
        content: assistantMessage,
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: saved },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get response' },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('deckId');

    if (!deckId) {
      return NextResponse.json({ success: false, error: 'Deck ID required' }, { status: 400 });
    }

    const messages = await db.chatMessage.findMany({
      where: { deckId, userId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
