import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { extractTextFromPDF } from '@/lib/parse-pdf';
import { extractTextFromImage } from '@/lib/parse-image';
import { db } from '@/lib/db';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_PDF = ['application/pdf'];
const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const textContent = formData.get('text') as string | null;
    const urlContent = formData.get('url') as string | null;
    const title = (formData.get('title') as string) || 'Untitled Deck';

    let extractedText = '';
    let sourceType: 'PDF' | 'TEXT' | 'URL' | 'IMAGE' = 'TEXT';

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: 'File size exceeds 10MB limit' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (ALLOWED_PDF.includes(file.type)) {
        sourceType = 'PDF';
        extractedText = await extractTextFromPDF(buffer);
      } else if (ALLOWED_IMAGES.includes(file.type)) {
        sourceType = 'IMAGE';
        const base64 = buffer.toString('base64');
        extractedText = await extractTextFromImage(
          base64,
          file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
        );
      } else {
        return NextResponse.json(
          { success: false, error: 'Unsupported file type. Use PDF, JPG, PNG, GIF, or WebP.' },
          { status: 400 }
        );
      }
    } else if (textContent) {
      sourceType = 'TEXT';
      extractedText = textContent;
    } else if (urlContent) {
      sourceType = 'URL';
      const response = await fetch(urlContent);
      extractedText = await response.text();
      // Strip HTML tags for basic text extraction
      extractedText = extractedText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    } else {
      return NextResponse.json(
        { success: false, error: 'No content provided. Upload a file, paste text, or provide a URL.' },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Could not extract any text from the provided content.' },
        { status: 400 }
      );
    }

    // Create deck in database
    const deck = await db.deck.create({
      data: {
        userId: user.id,
        title,
        sourceType,
        sourceContent: extractedText,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        deckId: deck.id,
        title: deck.title,
        sourceType: deck.sourceType,
        contentLength: extractedText.length,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
