'use client';

import { Bomb } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { isSoundEnabled, soundVolume } from '@/store/settings.store';

type BubbleColor = 'pink' | 'blue' | 'yellow' | 'purple';

const bubbleColors: Record<BubbleColor, { label: string; value: string; glow: string }> = {
  pink: { label: 'PINK', value: '#f472b6', glow: 'rgba(244,114,182,.5)' },
  blue: { label: 'BLUE', value: '#60a5fa', glow: 'rgba(96,165,250,.5)' },
  yellow: { label: 'YELLOW', value: '#fbbf24', glow: 'rgba(251,191,36,.5)' },
  purple: { label: 'PURPLE', value: '#a78bfa', glow: 'rgba(167,139,250,.5)' },
};

const bubbleLayout: Array<{
  id: number;
  color: BubbleColor;
  left: number;
  delay: number;
  duration: number;
  size: number;
  bomb?: boolean;
  speedBoost?: boolean;
}> = [
  { id: 0, color: 'pink', left: 5, delay: -1.2, duration: 4.8, size: 48 },
  { id: 1, color: 'blue', left: 24, delay: -3.4, duration: 5.4, size: 58 },
  { id: 2, color: 'pink', left: 48, delay: -2.1, duration: 4.5, size: 52 },
  { id: 3, color: 'yellow', left: 71, delay: -4.2, duration: 5.6, size: 46 },
  { id: 4, color: 'pink', left: 82, delay: -0.6, duration: 4.9, size: 56 },
  { id: 5, color: 'purple', left: 36, delay: -4.6, duration: 5.1, size: 44 },
  { id: 6, color: 'pink', left: 15, delay: -2.8, duration: 5.7, size: 50 },
  { id: 7, color: 'blue', left: 62, delay: -1.5, duration: 4.7, size: 48 },
  { id: 8, color: 'yellow', left: 88, delay: -3, duration: 5.3, size: 42 },
  { id: 9, color: 'purple', left: 53, delay: -0.9, duration: 5, size: 44, bomb: true },
  { id: 10, color: 'purple', left: 30, delay: -0.4, duration: 5.5, size: 48, speedBoost: true },
  { id: 11, color: 'blue', left: 75, delay: -2.5, duration: 4.6, size: 46, speedBoost: true },
];

let audioContext: AudioContext | null = null;

const playEffect = (effect: 'pop' | 'boost' | 'bomb' | 'miss', volume: number) => {
  if (typeof window === 'undefined') return;
  try {
    audioContext ??= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    const config = {
      pop: { start: 620, end: 920, duration: 0.11, type: 'sine' as OscillatorType },
      boost: { start: 520, end: 1240, duration: 0.18, type: 'triangle' as OscillatorType },
      bomb: { start: 180, end: 60, duration: 0.32, type: 'sawtooth' as OscillatorType },
      miss: { start: 220, end: 140, duration: 0.16, type: 'triangle' as OscillatorType },
    }[effect];
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(config.end, now + config.duration);
    gain.gain.setValueAtTime(Math.min(0.16, Math.max(0, volume * 0.16)), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + config.duration);
  } catch {
    // Web Audio is optional; the dart animation still shows the interaction.
  }
};

export const BubbleGame = ({ onWin }: { onWin: () => void }) => {
  const [soundEnabled] = useAtom(isSoundEnabled);
  const [volume] = useAtom(soundVolume);
  const [popped, setPopped] = useState<number[]>([]);
  const [status, setStatus] = useState<'playing' | 'lost'>('playing');
  const [isBoosted, setIsBoosted] = useState(false);
  const [shot, setShot] = useState<{ id: number; x: number; y: number; angle: number } | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const speedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetColor: BubbleColor = 'pink';
  const target = bubbleColors[targetColor];
  const targetCount = bubbleLayout.filter((bubble) => bubble.color === targetColor && !bubble.bomb).length;

  useEffect(
    () => () => {
      if (speedTimerRef.current) window.clearTimeout(speedTimerRef.current);
      if (shotTimerRef.current) window.clearTimeout(shotTimerRef.current);
    },
    [],
  );

  const retry = () => {
    setPopped([]);
    setStatus('playing');
    setIsBoosted(false);
    if (speedTimerRef.current) window.clearTimeout(speedTimerRef.current);
    if (shotTimerRef.current) window.clearTimeout(shotTimerRef.current);
  };

  const pop = (bubble: (typeof bubbleLayout)[number], event: React.MouseEvent<HTMLButtonElement>) => {
    if (status !== 'playing' || popped.includes(bubble.id)) return;
    const fieldBounds = fieldRef.current?.getBoundingClientRect();
    const bubbleBounds = event.currentTarget.getBoundingClientRect();
    if (fieldBounds) {
      const x = bubbleBounds.left + bubbleBounds.width / 2 - (fieldBounds.left + fieldBounds.width / 2);
      const y = bubbleBounds.top + bubbleBounds.height / 2 - (fieldBounds.bottom - 12);
      setShot({ id: bubble.id, x, y, angle: (Math.atan2(x, -y) * 180) / Math.PI });
    }
    if (shotTimerRef.current) window.clearTimeout(shotTimerRef.current);
    shotTimerRef.current = window.setTimeout(() => setShot(null), 420);
    if (bubble.bomb) {
      if (soundEnabled) playEffect('bomb', volume);
      setStatus('lost');
      return;
    }
    if (bubble.speedBoost) {
      if (soundEnabled) playEffect('boost', volume);
      setPopped((current) => [...current, bubble.id]);
      setIsBoosted(true);
      if (speedTimerRef.current) window.clearTimeout(speedTimerRef.current);
      speedTimerRef.current = window.setTimeout(() => setIsBoosted(false), 5000);
      return;
    }
    if (bubble.color !== targetColor) {
      if (soundEnabled) playEffect('miss', volume);
      setStatus('lost');
      return;
    }
    if (soundEnabled) playEffect('pop', volume);
    const next = [...popped, bubble.id];
    setPopped(next);
    if (next.length === targetCount) window.setTimeout(onWin, 300);
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2 dark:bg-sky-950/40'>
        <span className='text-[10px] font-black tracking-[0.12em] text-slate-500 dark:text-slate-300'>POP THE TARGET</span>
        <span className='flex items-center gap-1.5 text-xs font-black' style={{ color: target.value }}>
          <span className='h-3 w-3 rounded-full bg-current shadow-[0_0_8px_currentColor]' /> {target.label} {popped.length}/{targetCount}
        </span>
      </div>
      {isBoosted && (
        <div className='text-center text-[11px] font-black tracking-[0.12em] text-violet-600 dark:text-violet-300'>SPEED ×2 — 5 SECONDS</div>
      )}
      <div
        ref={fieldRef}
        className='relative mx-auto h-60 max-w-[320px] overflow-hidden rounded-xl bg-linear-to-b from-sky-100 via-cyan-50 to-violet-50 shadow-[inset_0_0_0_1px_rgba(125,211,252,.3)] dark:from-sky-950/70 dark:via-slate-900 dark:to-violet-950/40'
      >
        <div aria-hidden='true' className='absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-white/65 to-transparent dark:from-slate-950/30' />
        <span
          aria-hidden='true'
          className='pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 text-[8px] font-black tracking-[0.12em] text-sky-600/70'
        >
          TAP A BUBBLE TO SHOOT
        </span>
        {shot && (
          <span
            key={shot.id}
            aria-hidden='true'
            className='pointer-events-none absolute bottom-3 left-1/2 z-20 h-12 w-5 animate-[shootDart_.42s_ease-out_forwards] drop-shadow-sm'
            style={{ '--shot-x': `${shot.x}px`, '--shot-y': `${shot.y}px`, '--shot-angle': `${shot.angle}deg` } as React.CSSProperties}
          >
            <span className='absolute left-1/2 top-0 -translate-x-1/2 border-x-[6px] border-b-[12px] border-x-transparent border-b-indigo-800' />
            <span className='absolute left-1/2 top-2 h-8 w-1.5 -translate-x-1/2 rounded-full bg-linear-to-r from-sky-400 via-indigo-500 to-indigo-700' />
            <span className='absolute bottom-0 left-[2px] h-3 w-2 rotate-[-28deg] rounded-sm bg-fuchsia-400' />
            <span className='absolute bottom-0 right-[2px] h-3 w-2 rotate-[28deg] rounded-sm bg-fuchsia-400' />
          </span>
        )}
        {bubbleLayout.map(
          (bubble) =>
            !popped.includes(bubble.id) && (
              <div
                key={bubble.id}
                className='absolute bottom-[-20%]'
                style={{
                  left: `${bubble.left}%`,
                  animation: `bubbleRise ${bubble.duration / (isBoosted ? 2 : 1)}s ease-in infinite`,
                  animationDelay: `${bubble.delay}s`,
                }}
              >
                <button
                  type='button'
                  onClick={(event) => pop(bubble, event)}
                  aria-label={bubble.bomb ? 'Bomb — avoid' : bubble.speedBoost ? 'Speed ×2 bubble' : `${bubbleColors[bubble.color].label} bubble`}
                  className='relative flex items-center justify-center rounded-full transition active:scale-75'
                  style={{ width: bubble.size, height: bubble.size }}
                >
                  {bubble.bomb ? (
                    <span className='flex h-full w-full items-center justify-center rounded-full bg-slate-800 shadow-[0_5px_12px_rgba(15,23,42,.45),inset_5px_5px_10px_rgba(255,255,255,.18)]'>
                      <Bomb size={bubble.size * 0.48} className='text-slate-100' fill='#475569' />
                    </span>
                  ) : bubble.speedBoost ? (
                    <span className='flex h-full w-full items-center justify-center rounded-full border border-violet-200 bg-linear-to-br from-violet-300/80 to-indigo-400/80 text-lg font-black text-white shadow-[0_4px_12px_rgba(139,92,246,.32)]'>
                      2×
                    </span>
                  ) : (
                    <span
                      className='relative h-full w-full rounded-full border border-white/70 shadow-[0_4px_10px_var(--bubble-glow),inset_-3px_-4px_8px_rgba(255,255,255,.12)]'
                      style={
                        {
                          '--bubble-glow': bubbleColors[bubble.color].glow,
                          background: `linear-gradient(135deg, rgba(255,255,255,.48), ${bubbleColors[bubble.color].value}99 44%, ${bubbleColors[bubble.color].value}66)`,
                        } as React.CSSProperties
                      }
                    >
                      <span className='absolute left-[21%] top-[18%] h-[16%] w-[19%] rounded-full bg-white/65 blur-[1px]' />
                      <span className='absolute inset-[12%] rounded-full border border-white/30' />
                    </span>
                  )}
                </button>
              </div>
            ),
        )}
        {status === 'lost' && (
          <div className='absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/65 p-5 text-center text-white backdrop-blur-[2px]'>
            <Bomb className='mb-2 text-amber-300' size={32} />
            <p className='text-xl font-black'>You lose</p>
            <p className='mb-4 text-sm text-white/80'>Try again, or choose a different game.</p>
            <button
              type='button'
              onClick={retry}
              className='rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-800 transition active:scale-95'
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
