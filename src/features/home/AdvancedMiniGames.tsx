'use client';

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, PawPrint, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { IMAGES } from '@/utils/constants/images';
import { PETS } from '@/utils/constants/pet.constant';
import { PET_ENUM } from '@/utils/enums/pet.enum';

type AdvancedGameProps = { onWin: () => void };

const isAdjacent = (a: number, b: number) => {
  const sameRow = Math.floor(a / 3) === Math.floor(b / 3);
  return (sameRow && Math.abs(a - b) === 1) || Math.abs(a - b) === 3;
};

export const SlidingPuzzleGame = ({ onWin, petId }: AdvancedGameProps & { petId: PET_ENUM }) => {
  const [tiles, setTiles] = useState([0, 3, 2, 4, 1, 5, 6, 7, 8]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const pet = PETS.get(petId);
  const petImage = pet?.sleep;
  const imageSource = petImage?.imageType === 'image' ? petImage.imageUrl.src : IMAGES.MOCHI_SLEEP.src;

  const move = (index: number) => {
    if (isComplete) return;
    const empty = tiles.indexOf(0);
    if (!isAdjacent(index, empty)) return;
    const next = [...tiles];
    [next[index], next[empty]] = [next[empty], next[index]];
    setTiles(next);
    setMoves((value) => value + 1);
    if (next.every((tile, tileIndex) => tile === tileIndex)) {
      setIsComplete(true);
      window.setTimeout(onWin, 260);
    }
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between text-[11px] font-black tracking-[0.1em] text-rose-500'>
        <span>SLIDE TO REBUILD {pet?.name?.toUpperCase() ?? 'MOCHI'}</span>
        <span>{moves} MOVES</span>
      </div>
      <div className='mx-auto grid aspect-square w-full max-w-[300px] grid-cols-3 grid-rows-3 gap-1.5 rounded-xl bg-rose-100 p-1.5 dark:bg-rose-950/40'>
        {tiles.map((tile, index) => (
          <button
            key={`${tile}-${index}`}
            type='button'
            onClick={() => move(index)}
            disabled={tile === 0 || isComplete}
            aria-label={tile === 0 ? 'Empty space' : `Move tile ${tile}`}
            className={`relative min-h-0 overflow-hidden rounded-md transition active:scale-95 ${tile === 0 ? 'bg-rose-50/60 dark:bg-slate-900/40' : 'cursor-pointer bg-rose-50 shadow-[0_2px_5px_rgba(190,24,93,.18)]'}`}
          >
            {tile !== 0 && (
              <span
                className='absolute block bg-contain bg-center bg-no-repeat'
                style={{
                  width: '300%',
                  height: '300%',
                  left: `-${(tile % 3) * 100}%`,
                  top: `-${Math.floor(tile / 3) * 100}%`,
                  backgroundImage: `url(${imageSource})`,
                }}
              />
            )}
          </button>
        ))}
      </div>
      {isComplete && (
        <p className='flex items-center justify-center gap-1.5 text-sm font-black text-emerald-600' role='status'>
          <Check size={17} /> You win! Puzzle complete.
        </p>
      )}
    </div>
  );
};

const mazeWalls = new Set(['1,0', '1,1', '1,3', '1,5', '2,3', '3,1', '3,2', '3,3', '3,5', '4,1', '4,5', '5,3', '5,4', '5,5']);
const mazeSize = 7;

export const MazeRunGame = ({ onWin }: AdvancedGameProps) => {
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [steps, setSteps] = useState(0);

  const move = (x: number, y: number) => {
    const next = { x: player.x + x, y: player.y + y };
    if (next.x < 0 || next.y < 0 || next.x >= mazeSize || next.y >= mazeSize || mazeWalls.has(`${next.x},${next.y}`)) return;
    setPlayer(next);
    setSteps((value) => value + 1);
    if (next.x === 6 && next.y === 6) window.setTimeout(onWin, 260);
  };

  const directionClass =
    'flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-[0_3px_0_rgb(4,120,87)] transition active:translate-y-0.5 active:shadow-none';
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between text-[11px] font-black tracking-[0.1em] text-emerald-600'>
        <span>GUIDE MOCHI TO THE STAR</span>
        <span>{steps} STEPS</span>
      </div>
      <div className='mx-auto grid w-[252px] grid-cols-7 gap-1 rounded-lg bg-emerald-100 p-1 dark:bg-emerald-950/40'>
        {Array.from({ length: mazeSize * mazeSize }, (_, index) => {
          const x = index % mazeSize;
          const y = Math.floor(index / mazeSize);
          const isWall = mazeWalls.has(`${x},${y}`);
          const hasPlayer = player.x === x && player.y === y;
          const isGoal = x === 6 && y === 6;
          return (
            <div
              key={index}
              className={`flex aspect-square items-center justify-center rounded-sm ${isWall ? 'bg-emerald-700 dark:bg-emerald-800' : 'bg-white/85 dark:bg-slate-800'}`}
            >
              {hasPlayer && <PawPrint size={17} className='text-rose-500' fill='currentColor' />}
              {isGoal && <Star size={17} className='text-amber-400' fill='currentColor' />}
            </div>
          );
        })}
      </div>
      <div className='mx-auto grid w-[140px] grid-cols-3 gap-2'>
        <span />
        <button type='button' onClick={() => move(0, -1)} className={directionClass} aria-label='Move up'>
          <ArrowUp size={21} />
        </button>
        <span />
        <button type='button' onClick={() => move(-1, 0)} className={directionClass} aria-label='Move left'>
          <ArrowLeft size={21} />
        </button>
        <button type='button' onClick={() => move(0, 1)} className={directionClass} aria-label='Move down'>
          <ArrowDown size={21} />
        </button>
        <button type='button' onClick={() => move(1, 0)} className={directionClass} aria-label='Move right'>
          <ArrowRight size={21} />
        </button>
      </div>
    </div>
  );
};

type DifferenceMarkType = 'dot' | 'sparkle' | 'ring' | 'stripe';
type Difference = { id: number; left: string; top: string; type: DifferenceMarkType };

const differenceSets: Record<PET_ENUM, Difference[]> = {
  [PET_ENUM.BLACK_CAT]: [
    { id: 0, left: '17%', top: '29%', type: 'dot' },
    { id: 1, left: '73%', top: '18%', type: 'stripe' },
    { id: 2, left: '58%', top: '76%', type: 'ring' },
  ],
  [PET_ENUM.GREY_CAT]: [
    { id: 0, left: '25%', top: '17%', type: 'sparkle' },
    { id: 1, left: '68%', top: '42%', type: 'dot' },
    { id: 2, left: '39%', top: '79%', type: 'stripe' },
  ],
  [PET_ENUM.HAPPY_DOG]: [
    { id: 0, left: '17%', top: '22%', type: 'dot' },
    { id: 1, left: '72%', top: '30%', type: 'sparkle' },
    { id: 2, left: '50%', top: '74%', type: 'ring' },
  ],
  [PET_ENUM.ORANGE_CAT]: [
    { id: 0, left: '26%', top: '32%', type: 'ring' },
    { id: 1, left: '77%', top: '21%', type: 'stripe' },
    { id: 2, left: '45%', top: '72%', type: 'dot' },
  ],
  [PET_ENUM.WHITE_PUPPY]: [
    { id: 0, left: '16%', top: '40%', type: 'sparkle' },
    { id: 1, left: '63%', top: '18%', type: 'dot' },
    { id: 2, left: '76%', top: '71%', type: 'ring' },
  ],
  [PET_ENUM.SNOOPY]: [
    { id: 0, left: '28%', top: '19%', type: 'stripe' },
    { id: 1, left: '71%', top: '48%', type: 'ring' },
    { id: 2, left: '43%', top: '77%', type: 'sparkle' },
  ],
  [PET_ENUM.LAZY_CAT]: [
    { id: 0, left: '17%', top: '28%', type: 'ring' },
    { id: 1, left: '70%', top: '20%', type: 'dot' },
    { id: 2, left: '55%', top: '73%', type: 'stripe' },
  ],
};

const DifferenceMark = ({ type }: { type: DifferenceMarkType }) => {
  if (type === 'sparkle') return <Sparkles size={11} className='text-amber-300/70' strokeWidth={2.5} />;
  if (type === 'ring') return <span className='block h-3 w-3 rounded-full border border-sky-300/70' />;
  if (type === 'stripe') return <span className='block h-px w-3 rotate-[-24deg] bg-violet-300/80' />;
  return <span className='block h-2 w-2 rounded-full bg-rose-300/70' />;
};

export const FindDifferenceGame = ({ onWin, petId }: AdvancedGameProps & { petId: PET_ENUM }) => {
  const [found, setFound] = useState<number[]>([]);
  const lastTapAt = useRef<Record<number, number>>({});
  const pet = PETS.get(petId);
  const petImage = pet?.sleep;
  const differences = differenceSets[petId];
  const find = (id: number) => {
    setFound((previous) => {
      if (previous.includes(id)) return previous;
      const next = [...previous, id];
      if (next.length === differences.length) window.setTimeout(onWin, 260);
      return next;
    });
  };

  const handleDoubleTap = (id: number, event: React.PointerEvent<HTMLButtonElement>) => {
    const now = event.timeStamp;
    const lastTap = lastTapAt.current[id] ?? 0;
    if (now - lastTap <= 420) {
      delete lastTapAt.current[id];
      find(id);
      return;
    }
    lastTapAt.current[id] = now;
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between text-[11px] font-black tracking-[0.1em] text-sky-600'>
        <span>FIND 3 DIFFERENCES</span>
        <span>{found.length}/3 FOUND</span>
      </div>
      <div className='grid grid-cols-2 gap-2'>
        {['LEFT', 'RIGHT'].map((side) => (
          <div key={side} className='relative aspect-square overflow-hidden rounded-lg bg-sky-100'>
            {petImage?.imageType === 'image' && (
              <Image
                src={petImage.imageUrl}
                alt={`${side} ${pet?.name ?? 'pet'} scene`}
                fill
                unoptimized
                sizes='150px'
                className='object-cover p-1'
              />
            )}
            {differences.map((difference) => {
              const isFound = found.includes(difference.id);
              if (side === 'LEFT') return null;
              return (
                <button
                  key={difference.id}
                  type='button'
                  onPointerUp={(event) => handleDoubleTap(difference.id, event)}
                  aria-label={`Double-tap difference ${difference.id + 1}`}
                  className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full touch-manipulation transition ${isFound ? 'bg-emerald-400/30 ring-2 ring-emerald-500' : 'bg-transparent active:bg-sky-300/25'}`}
                  style={{ left: difference.left, top: difference.top }}
                >
                  {isFound ? <Check size={18} className='text-emerald-700' strokeWidth={3} /> : <DifferenceMark type={difference.type} />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className='text-center text-xs font-medium text-slate-500'>Double-tap a difference on the right.</p>
    </div>
  );
};
