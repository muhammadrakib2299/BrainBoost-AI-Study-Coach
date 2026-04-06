import { anthropic } from './claude';

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

export async function extractTextFromImage(
  base64Data: string,
  mediaType: ImageMediaType
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data,
            },
          },
          {
            type: 'text',
            text: 'Extract all text, data, and key information from this image. If it contains a diagram, chart, or table, describe its contents and structure in detail. Return the extracted content as clean, well-structured text.',
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : '';
}
