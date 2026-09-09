// src/components/ui/ConfettiCelebration.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { playReplayBurst, triggerSemifinalCelebration } from './useConfettiBlast';

interface ConfettiCelebrationProps {
  /**
   * Whether to auto-play the celebration sequence on mount. Defaults to true.
   */
  active?: boolean;
  /**
   * How long the celebration sequence should run, in ms. Used to auto-hide the
   * floating "Replay" pill once the initial burst settles. Defaults to 4200.
   */
  duration?: number;
  /**
   * Legacy knob kept for call-site compatibility — the particle count is
   * governed inside the canvas-confetti engine, so this is intentionally unused.
   */
  count?: number;
  /**
   * Show the floating "Replay Celebration" pill. Defaults to true.
   */
  showReplay?: boolean;
  /**
   * Optional external handler fired instead of the default replay burst.
   */
  onReplay?: () => void;
}

/**
 * Physics-driven celebration for qualified semifinalists. Delegates every
 * particle to the battle-tested `canvas-confetti` engine (a dedicated global
 * canvas, so there are no static DOM elements). On mount it runs the multi-stage
 * routine built in `useConfettiBlast`:
 *
 *   1. Initial center explosion
 *   2. Oscillating left/right side cannons
 *
 * A compact floating "Replay Celebration 🎉" pill is offered so the team can
 * re-trigger the burst on demand.
 */
export function ConfettiCelebration({
  active = true,
  duration = 4200,
  showReplay = true,
  onReplay,
}: ConfettiCelebrationProps) {
  const [pillVisible, setPillVisible] = useState(showReplay);
  const timersRef = useRef<number[]>([]);
  const hideTimer = useRef<number | null>(null);

  // Auto-play the celebration sequence on mount (or when `active` toggles).
  useEffect(() => {
    if (!active) return;

    // Cancel any previous run before starting a fresh one.
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = triggerSemifinalCelebration();

    // Auto-hide the replay pill once the initial burst has settled.
    setPillVisible(showReplay);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(
      () => setPillVisible(false),
      duration + 1200,
    );

    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [active, duration, showReplay]);

  const handleReplay = () => {
    if (onReplay) {
      onReplay();
    } else {
      playReplayBurst();
    }
    // Nudge the pill one more time after a manual replay.
    setPillVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setPillVisible(false), 3000);
  };

  return (
    <>
      {/* canvas-confetti owns its own overlay canvas; a plain sentinel keeps the
          node in the tree so replayKey can re-run the mount effect. */}
      <div aria-hidden="true" className="hidden" data-confetti-celebration />

      {pillVisible && (
        <button
          type="button"
          onClick={handleReplay}
          aria-label="Replay celebration confetti"
          title="Replay Celebration"
          className="pointer-events-auto fixed bottom-5 right-5 z-[9990] flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(168,85,247,0.15)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-purple-400/50 hover:bg-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95"
        >
          <span className="animate-twinkle text-base">🎉</span>
          <span>Replay Celebration</span>
        </button>
      )}
    </>
  );
}