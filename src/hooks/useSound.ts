// hooks/useSound.ts
import { useCallback, useRef } from "react";

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playCorrect = useCallback(() => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      const ctx = ctxRef.current;

      // A gentle two-note chime: C5 → E5
      const notes = [523.25, 659.25];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const start = ctx.currentTime + i * 0.12;
        const end = start + 0.35;

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.10, start + 0.02); // soft attack
        gain.gain.exponentialRampToValueAtTime(0.001, end);     // natural decay

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(end);
      });
    } catch {
      // AudioContext blocked (e.g. SSR or permission denied) — silently skip
    }
  }, []);

  return { playCorrect };
}