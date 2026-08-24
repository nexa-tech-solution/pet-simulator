export type GameKind =
  | 'xo'
  | 'memory'
  | 'cups'
  | 'bubbles'
  | 'quiz'
  | 'slidingMochi'
  | 'slidingLuna'
  | 'slidingBuddy'
  | 'slidingPumpkin'
  | 'slidingSnowy'
  | 'slidingSnoopy'
  | 'slidingMiso'
  | 'maze'
  | 'differencesMochi'
  | 'differencesLuna'
  | 'differencesBuddy'
  | 'differencesPumpkin'
  | 'differencesSnowy'
  | 'differencesSnoopy'
  | 'differencesMiso';

export type MiniGameConfig = { kind: GameKind; title: string; subtitle: string; accent: string; reward: number };

export const MINI_GAMES: MiniGameConfig[] = [
  { kind: 'xo', title: 'Tic-tac-toe', subtitle: 'Make a row of 3 marks to win.', accent: 'from-fuchsia-500 to-pink-500', reward: 10 },
  { kind: 'memory', title: 'Memory match', subtitle: 'Flip the cards and find all 3 pairs.', accent: 'from-violet-500 to-indigo-500', reward: 10 },
  { kind: 'cups', title: 'Three cups', subtitle: 'Remember the ball and pick the right cup.', accent: 'from-amber-400 to-orange-500', reward: 15 },
  { kind: 'bubbles', title: 'Bubble pop', subtitle: 'Pop only the target bubbles. Avoid bombs!', accent: 'from-cyan-400 to-blue-500', reward: 20 },
  { kind: 'quiz', title: 'Quick quiz', subtitle: 'Answer correctly to earn your reward.', accent: 'from-emerald-400 to-teal-500', reward: 10 },
  { kind: 'slidingMochi', title: 'Sliding puzzle', subtitle: 'Slide the tiles to rebuild Mochi.', accent: 'from-rose-400 to-pink-500', reward: 35 },
  { kind: 'slidingLuna', title: 'Sliding puzzle', subtitle: 'Slide the tiles to rebuild Luna.', accent: 'from-rose-400 to-pink-500', reward: 35 },
  { kind: 'slidingBuddy', title: 'Sliding puzzle', subtitle: 'Slide the tiles to rebuild Buddy.', accent: 'from-rose-400 to-pink-500', reward: 35 },
  {
    kind: 'slidingPumpkin',
    title: 'Sliding puzzle',
    subtitle: 'Slide the tiles to rebuild Pumpkin.',
    accent: 'from-rose-400 to-pink-500',
    reward: 35,
  },
  { kind: 'slidingSnowy', title: 'Sliding puzzle', subtitle: 'Slide the tiles to rebuild Snowy.', accent: 'from-rose-400 to-pink-500', reward: 35 },
  { kind: 'slidingSnoopy', title: 'Sliding puzzle', subtitle: 'Slide the tiles to rebuild Snoopy.', accent: 'from-rose-400 to-pink-500', reward: 35 },
  { kind: 'slidingMiso', title: 'Sliding puzzle', subtitle: 'Slide the tiles to rebuild Miso.', accent: 'from-rose-400 to-pink-500', reward: 35 },
  { kind: 'maze', title: 'Maze run', subtitle: 'Guide Mochi through the maze to the star.', accent: 'from-emerald-400 to-teal-500', reward: 40 },
  {
    kind: 'differencesMochi',
    title: 'Find the difference',
    subtitle: 'Find all 3 differences in Mochi’s scene.',
    accent: 'from-sky-400 to-indigo-500',
    reward: 30,
  },
  {
    kind: 'differencesLuna',
    title: 'Find the difference',
    subtitle: 'Find all 3 differences in Luna’s scene.',
    accent: 'from-sky-400 to-indigo-500',
    reward: 30,
  },
  {
    kind: 'differencesBuddy',
    title: 'Find the difference',
    subtitle: 'Find all 3 differences in Buddy’s scene.',
    accent: 'from-sky-400 to-indigo-500',
    reward: 30,
  },
  {
    kind: 'differencesPumpkin',
    title: 'Find the difference',
    subtitle: 'Find all 3 differences in Pumpkin’s scene.',
    accent: 'from-sky-400 to-indigo-500',
    reward: 30,
  },
  {
    kind: 'differencesSnowy',
    title: 'Find the difference',
    subtitle: 'Find all 3 differences in Snowy’s scene.',
    accent: 'from-sky-400 to-indigo-500',
    reward: 30,
  },
  {
    kind: 'differencesSnoopy',
    title: 'Find the difference',
    subtitle: 'Find all 3 differences in Snoopy’s scene.',
    accent: 'from-sky-400 to-indigo-500',
    reward: 30,
  },
  {
    kind: 'differencesMiso',
    title: 'Find the difference',
    subtitle: 'Find all 3 differences in Miso’s scene.',
    accent: 'from-sky-400 to-indigo-500',
    reward: 30,
  },
];

export const MINI_GAME_KINDS = MINI_GAMES.map(({ kind }) => kind);

export const getMiniGame = (kind: GameKind) => MINI_GAMES.find((game) => game.kind === kind) ?? MINI_GAMES[0];
