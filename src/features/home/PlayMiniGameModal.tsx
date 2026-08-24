'use client';

import { Check, Shuffle, Sparkles, Trophy, X } from 'lucide-react';
import { useState } from 'react';
import { FindDifferenceGame, MazeRunGame, SlidingPuzzleGame } from './AdvancedMiniGames';
import { BubbleGame } from './mini-games/BubbleGame';
import { ClassicMiniGames } from './mini-games/ClassicMiniGames';
import { GameKind, getMiniGame } from './mini-games/game-config';
import { PET_ENUM } from '@/utils/enums/pet.enum';

export type { GameKind } from './mini-games/game-config';
export { MINI_GAME_KINDS } from './mini-games/game-config';

type PlayMiniGameModalProps = {
  onClose: () => void;
  onWin: (coins: number) => void;
  initialGame: GameKind;
  onRequestNextGame: () => GameKind;
};

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

const AdvancedGame = ({ kind, onWin }: { kind: GameKind; onWin: () => void }) => {
  if (kind === 'bubbles') return <BubbleGame onWin={onWin} />;
  if (kind === 'slidingMochi') return <SlidingPuzzleGame petId={PET_ENUM.BLACK_CAT} onWin={onWin} />;
  if (kind === 'slidingLuna') return <SlidingPuzzleGame petId={PET_ENUM.GREY_CAT} onWin={onWin} />;
  if (kind === 'slidingBuddy') return <SlidingPuzzleGame petId={PET_ENUM.HAPPY_DOG} onWin={onWin} />;
  if (kind === 'slidingPumpkin') return <SlidingPuzzleGame petId={PET_ENUM.ORANGE_CAT} onWin={onWin} />;
  if (kind === 'slidingSnowy') return <SlidingPuzzleGame petId={PET_ENUM.WHITE_PUPPY} onWin={onWin} />;
  if (kind === 'slidingSnoopy') return <SlidingPuzzleGame petId={PET_ENUM.SNOOPY} onWin={onWin} />;
  if (kind === 'slidingMiso') return <SlidingPuzzleGame petId={PET_ENUM.LAZY_CAT} onWin={onWin} />;
  if (kind === 'maze') return <MazeRunGame onWin={onWin} />;
  if (kind === 'differencesMochi') return <FindDifferenceGame petId={PET_ENUM.BLACK_CAT} onWin={onWin} />;
  if (kind === 'differencesLuna') return <FindDifferenceGame petId={PET_ENUM.GREY_CAT} onWin={onWin} />;
  if (kind === 'differencesBuddy') return <FindDifferenceGame petId={PET_ENUM.HAPPY_DOG} onWin={onWin} />;
  if (kind === 'differencesPumpkin') return <FindDifferenceGame petId={PET_ENUM.ORANGE_CAT} onWin={onWin} />;
  if (kind === 'differencesSnowy') return <FindDifferenceGame petId={PET_ENUM.WHITE_PUPPY} onWin={onWin} />;
  if (kind === 'differencesSnoopy') return <FindDifferenceGame petId={PET_ENUM.SNOOPY} onWin={onWin} />;
  if (kind === 'differencesMiso') return <FindDifferenceGame petId={PET_ENUM.LAZY_CAT} onWin={onWin} />;
  return <ClassicMiniGames kind={kind} onWin={onWin} />;
};

export const PlayMiniGameModal = ({ onClose, onWin, initialGame, onRequestNextGame }: PlayMiniGameModalProps) => {
  const [game, setGame] = useState(() => getMiniGame(initialGame));
  const [won, setWon] = useState(false);
  const finish = (reward: number = game.reward) => {
    if (won) return;
    setWon(true);
    onWin(reward);
  };
  const changeGame = () => {
    setWon(false);
    setGame(getMiniGame(onRequestNextGame()));
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='Mini game'
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm sm:p-5'
    >
      <div className='w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900'>
        <div className={cx('relative bg-linear-to-r px-5 py-4 text-white', game.accent)}>
          <button
            type='button'
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className='absolute right-3 top-3 z-20 rounded-full bg-white/20 p-2 transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/80'
            aria-label='Close game'
          >
            <X size={17} />
          </button>
          <div className='relative flex items-center gap-2.5'>
            <span className='rounded-lg bg-white/20 p-2.5'>
              <Sparkles size={21} />
            </span>
            <div>
              <p className='text-[10px] font-black tracking-[0.16em] text-white/75'>PLAY & WIN</p>
              <h2 className='text-xl font-black'>{game.title}</h2>
            </div>
          </div>
        </div>
        <div className='p-4 sm:p-5'>
          <p className='mb-4 text-center text-sm font-medium text-slate-600 dark:text-slate-300'>{game.subtitle}</p>
          <AdvancedGame key={game.kind} kind={game.kind} onWin={finish} />
          <div className='mt-4 flex gap-2'>
            <button
              type='button'
              onClick={changeGame}
              className='flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2.5 text-xs font-black text-violet-700 transition hover:bg-violet-100 active:scale-[0.98] dark:bg-violet-950/50 dark:text-violet-200'
            >
              <Shuffle size={15} /> New game
            </button>
            <div className='flex flex-[1.35] items-center justify-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'>
              <Trophy size={17} /> Win {game.reward} coins
            </div>
          </div>
          {won && (
            <div className='mt-3 flex items-center justify-center gap-2 text-sm font-black text-emerald-600'>
              <Check size={18} /> Reward collected!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
