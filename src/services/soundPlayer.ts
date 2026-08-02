'use client';

/**
 * Plays pet voice clips.
 *
 * One shared `Audio` element is reused for every clip: retriggering restarts the sound
 * instead of layering copies on top of each other, and nothing accumulates in memory.
 */

let audio: HTMLAudioElement | null = null;

const clampVolume = (volume: number): number => Math.min(1, Math.max(0, volume));

/** Plays a clip at the given volume. Safe to call during SSR or with an empty src. */
export const playSound = (src: string, volume: number): void => {
  if (typeof window === 'undefined' || !src) return;

  if (!audio) audio = new Audio();

  audio.pause();
  if (audio.src !== src) audio.src = src;
  audio.volume = clampVolume(volume);
  audio.currentTime = 0;

  // Usually an autoplay block or a rapid retrigger aborting the previous play() —
  // neither is worth surfacing to the user, but a decode error would otherwise vanish.
  void audio.play().catch((error) => console.debug('[soundPlayer] playback skipped:', error));
};

/** Stops whatever is currently playing. */
export const stopSound = (): void => {
  audio?.pause();
};
