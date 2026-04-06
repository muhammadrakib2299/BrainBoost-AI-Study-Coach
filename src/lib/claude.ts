import Anthropic from '@anthropic-ai/sdk';

let _anthropic: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }
  return _anthropic;
}

// Lazy getter — doesn't initialize at import time
export const anthropic = {
  get messages() {
    return getAnthropic().messages;
  },
};
