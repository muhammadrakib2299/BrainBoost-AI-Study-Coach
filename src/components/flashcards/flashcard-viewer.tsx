'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FlashcardViewerProps {
  question: string;
  answer: string;
  explanation?: string | null;
  index: number;
  total: number;
}

export function FlashcardViewer({ question, answer, explanation, index, total }: FlashcardViewerProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground text-center mb-3">
        Card {index + 1} of {total}
      </p>
      <div
        className="relative w-full min-h-[180px] sm:min-h-[240px] cursor-pointer perspective-1000"
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="w-full min-h-[180px] sm:min-h-[240px] border border-border rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {!flipped ? (
            <>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Question</p>
              <p className="text-lg font-medium">{question}</p>
              <p className="text-xs text-muted-foreground mt-4">Click to reveal answer</p>
            </>
          ) : (
            <div style={{ transform: 'rotateY(180deg)' }}>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Answer</p>
              <p className="text-lg font-medium mb-3">{answer}</p>
              {explanation && (
                <p className="text-sm text-muted-foreground border-t border-border pt-3 mt-3">
                  {explanation}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-4">Click to see question</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
