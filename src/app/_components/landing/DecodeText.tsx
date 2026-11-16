'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Nucleotide alphabet, so the scramble reads like a sequence being resolved.
const BASES = 'ACGTU';

function scramble(text: string, revealed: number, seed: number) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (i < revealed || ch === ' ' || ch === '!' || ch === '.' || ch === ',') out += ch;
    else out += BASES[(i * 7 + seed) % BASES.length];
  }
  return out;
}

/**
 * Text that starts as a scrambled base sequence and resolves left to right.
 * Hovering or focusing it runs the decode again. Screen readers get the real
 * text through aria-label from the start.
 */
export function DecodeText({
  text,
  delay = 0,
  speed = 38,
  className = '',
  replayOnHover = true,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  replayOnHover?: boolean;
}) {
  const [shown, setShown] = useState(text);
  const timer = useRef<number | null>(null);
  const running = useRef(false);

  const run = useCallback(
    (startDelay: number) => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setShown(text);
        return;
      }
      if (running.current) return;
      running.current = true;
      let revealed = 0;
      let seed = 0;
      setShown(scramble(text, 0, 0));
      const step = () => {
        seed++;
        if (seed % 2 === 0) revealed++;
        setShown(scramble(text, revealed, seed));
        if (revealed < text.length) {
          timer.current = window.setTimeout(step, speed);
        } else {
          running.current = false;
        }
      };
      timer.current = window.setTimeout(step, startDelay);
    },
    [text, speed],
  );

  useEffect(() => {
    run(delay);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      running.current = false;
    };
  }, [run, delay]);

  return (
    <span
      aria-label={text}
      className={`relative inline-block ${className}`}
      onMouseEnter={replayOnHover ? () => run(0) : undefined}
    >
      {/* The real text reserves the layout so the scramble never reflows the line */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-pre">
        {shown}
      </span>
    </span>
  );
}
