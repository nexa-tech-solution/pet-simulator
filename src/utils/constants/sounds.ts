/**
 * One voice clip per pet, wired to each pet via the `sound` field in `PETS`.
 *
 * `new URL(..., import.meta.url)` is the bundler-native way to reference a non-code
 * asset: Turbopack emits the file and hands back its served URL. Paths must stay
 * inline string literals for that detection to work.
 */
export const SOUNDS = {
  BUDDY: new URL('../../assets/sound/buddy-sound.mp3', import.meta.url).href,
  LUNA: new URL('../../assets/sound/luna-sound.mp3', import.meta.url).href,
  MISO: new URL('../../assets/sound/miso-sound.mp3', import.meta.url).href,
  MOCHI: new URL('../../assets/sound/mochi-sound.mp3', import.meta.url).href,
  PUMPKIN: new URL('../../assets/sound/pumpkin-sound.mp3', import.meta.url).href,
  SNOOPY: new URL('../../assets/sound/snoopy-sound.mp3', import.meta.url).href,
  SNOWY: new URL('../../assets/sound/snowy-sound.mp3', import.meta.url).href,
};

/** Default playback volume before the user changes it. */
export const DEFAULT_VOLUME = 0.7;
