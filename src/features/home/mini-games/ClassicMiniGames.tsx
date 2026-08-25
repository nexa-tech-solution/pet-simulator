'use client';

import { Circle, Lightbulb, Puzzle, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import PASTEL_PINK_CUP from '@/assets/images/pastel-pink-cup.png';
import { PETS } from '@/utils/constants/pet.constant';
import { PET_ENUM } from '@/utils/enums/pet.enum';
import type { GameKind } from './game-config';

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

const getWinner = (board: Array<'x' | 'o' | null>) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return lines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c])?.map((index) => index) ?? [];
};

export const XoGame = ({ onWin }: { onWin: () => void }) => {
  const [board, setBoard] = useState<Array<'x' | 'o' | null>>(Array(9).fill(null));
  const [message, setMessage] = useState('You go first — choose a square!');
  const winner = getWinner(board);

  const play = (index: number) => {
    if (board[index] || winner.length) return;
    const next = [...board];
    next[index] = 'x';
    if (getWinner(next).length) {
      setBoard(next);
      setMessage('You win!');
      window.setTimeout(onWin, 450);
      return;
    }
    const choices = next.map((cell, cellIndex) => (cell ? -1 : cellIndex)).filter((cellIndex) => cellIndex >= 0);
    if (choices.length) next[choices[choices.length - 1]] = 'o';
    const machineWon = getWinner(next).length > 0;
    setBoard(next);
    if (machineWon || !next.some((cell) => cell === null)) {
      setMessage(machineWon ? 'The computer won — new board!' : "It's a draw — new board!");
      window.setTimeout(() => {
        setBoard(Array(9).fill(null));
        setMessage('You go first — choose a square!');
      }, 750);
      return;
    }
    setMessage('Your turn');
  };

  return (
    <div className='space-y-4'>
      <div className='mx-auto grid w-64 grid-cols-3 gap-2 rounded-xl bg-fuchsia-100 p-3 dark:bg-fuchsia-950/60'>
        {board.map((cell, index) => (
          <button
            key={index}
            type='button'
            onClick={() => play(index)}
            className={cx(
              'flex aspect-square items-center justify-center rounded-lg bg-white shadow-sm transition active:scale-95 dark:bg-slate-800',
              cell === 'x' && 'text-fuchsia-500',
              cell === 'o' && 'text-indigo-500',
            )}
            aria-label={`Square ${index + 1}`}
          >
            {cell === 'x' ? <X size={54} strokeWidth={3.2} /> : cell === 'o' ? <Circle size={49} strokeWidth={3.2} /> : null}
          </button>
        ))}
      </div>
      <p className='text-center text-sm font-bold text-slate-600 dark:text-slate-300'>{message}</p>
    </div>
  );
};

const memoryCards = [PET_ENUM.BLACK_CAT, PET_ENUM.ORANGE_CAT, PET_ENUM.SNOOPY, PET_ENUM.SNOOPY, PET_ENUM.BLACK_CAT, PET_ENUM.ORANGE_CAT];

const MemoryPetFace = ({ petId }: { petId: PET_ENUM }) => {
  const pet = PETS.get(petId);
  const image = pet?.sleep;
  if (image?.imageType === 'image')
    return <Image src={image.imageUrl} alt={pet?.name ?? 'Pet'} fill unoptimized sizes='96px' className='object-contain p-1' />;
  return <span className='text-xl font-black'>{pet?.name.slice(0, 1)}</span>;
};

export const MemoryGame = ({ onWin }: { onWin: () => void }) => {
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const flip = (index: number) => {
    if (locked || open.includes(index) || matched.includes(index)) return;
    const next = [...open, index];
    setOpen(next);
    if (next.length !== 2) return;
    setLocked(true);
    const correct = memoryCards[next[0]] === memoryCards[next[1]];
    window.setTimeout(() => {
      if (correct) {
        const nextMatched = [...matched, ...next];
        setMatched(nextMatched);
        if (nextMatched.length === memoryCards.length) window.setTimeout(onWin, 220);
      }
      setOpen([]);
      setLocked(false);
    }, 550);
  };
  return (
    <div className='mx-auto max-w-[308px] rounded-xl bg-violet-50 p-3 dark:bg-violet-950/30'>
      <div className='mb-3 flex items-center justify-between px-1 text-[11px] font-black tracking-[0.08em] text-violet-500 dark:text-violet-300'>
        <span>FIND THE PAIRS</span>
        <span>{matched.length / 2}/3</span>
      </div>
      <div className='grid grid-cols-3 gap-2.5'>
        {memoryCards.map((petId, index) => {
          const visible = open.includes(index) || matched.includes(index);
          const isMatched = matched.includes(index);
          const petName = PETS.get(petId)?.name ?? 'pet';
          return (
            <button
              key={index}
              type='button'
              onClick={() => flip(index)}
              className={cx(
                'relative aspect-square overflow-hidden rounded-lg text-3xl font-black transition duration-200 active:scale-95',
                isMatched
                  ? 'bg-emerald-100 text-emerald-600 shadow-[0_7px_16px_rgba(16,185,129,.14)] dark:bg-emerald-950/60'
                  : visible
                    ? 'bg-white text-violet-600 shadow-[0_7px_16px_rgba(109,40,217,.14)] dark:bg-slate-800'
                    : 'bg-linear-to-br from-violet-500 to-indigo-600 text-white shadow-[0_8px_16px_rgba(79,70,229,.28)]',
              )}
              aria-label={visible ? `${petName} card` : 'Flip card'}
            >
              {visible ? (
                <span className='relative z-10 block h-full w-full animate-[cardFlipIn_340ms_ease-out] p-1.5'>
                  <MemoryPetFace petId={petId} />
                </span>
              ) : (
                <Puzzle className='relative z-10 mx-auto' size={25} strokeWidth={2.5} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const CupsGame = ({ onWin }: { onWin: () => void }) => {
  const [ballCup, setBallCup] = useState(() => Math.floor(Math.random() * 3));
  const [positions, setPositions] = useState([0, 1, 2]);
  const [phase, setPhase] = useState<'reveal' | 'shuffling' | 'choose'>('reveal');
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState('Remember the pink ball!');
  useEffect(() => {
    let shuffleTimer: number | null = null;
    let chooseTimer: number | null = null;
    const revealTimer = window.setTimeout(() => {
      setPhase('shuffling');
      setMessage('Watch the cups closely…');
      let swaps = 0;
      shuffleTimer = window.setInterval(() => {
        setPositions((current) => {
          const next = [...current];
          const left = Math.floor(Math.random() * 2);
          [next[left], next[left + 1]] = [next[left + 1], next[left]];
          return next;
        });
        swaps += 1;
        if (swaps === 7 && shuffleTimer) {
          window.clearInterval(shuffleTimer);
          chooseTimer = window.setTimeout(() => {
            setPhase('choose');
            setMessage('Which cup has the ball?');
          }, 300);
        }
      }, 380);
    }, 1100);
    return () => {
      window.clearTimeout(revealTimer);
      if (shuffleTimer) window.clearInterval(shuffleTimer);
      if (chooseTimer) window.clearTimeout(chooseTimer);
    };
  }, [round]);
  const guess = (cup: number) => {
    if (phase !== 'choose') return;
    if (cup === ballCup) {
      setPhase('shuffling');
      setMessage('Correct!');
      window.setTimeout(onWin, 350);
      return;
    }
    setPhase('reveal');
    setMessage('Not quite — here is the ball.');
    window.setTimeout(() => {
      setBallCup(Math.floor(Math.random() * 3));
      setPositions([0, 1, 2]);
      setMessage('Remember the pink ball!');
      setRound((value) => value + 1);
    }, 850);
  };
  return (
    <div className='space-y-5'>
      <div className='relative mx-auto h-40 max-w-[330px]'>
        {[0, 1, 2].map((cup) => (
          <button
            key={cup}
            type='button'
            onClick={() => guess(cup)}
            className={cx(
              'group absolute top-0 h-36 w-1/3 cursor-pointer transition-[left,transform] duration-300 ease-in-out active:translate-y-1',
              phase !== 'choose' && 'cursor-default',
            )}
            style={{ left: `${positions.indexOf(cup) * 33.333}%` }}
            aria-label={`Cup ${cup + 1}`}
          >
            {phase === 'reveal' && cup === ballCup && (
              <span
                aria-hidden='true'
                className='absolute bottom-2 left-1/2 z-10 h-8 w-8 -translate-x-1/2 rounded-full border-[3px] border-white bg-linear-to-br from-pink-300 via-pink-500 to-fuchsia-700 shadow-[0_4px_8px_rgba(190,24,93,.42)]'
              >
                <span className='absolute left-1 top-1 h-2 w-2 rounded-full bg-white/90' />
              </span>
            )}
            <span
              aria-hidden='true'
              className={cx(
                'absolute inset-x-0 top-0 h-36 origin-bottom transition-transform duration-300',
                phase === 'reveal' && cup === ballCup && '-translate-y-[20px]',
              )}
            >
              <Image src={PASTEL_PINK_CUP} alt='' fill unoptimized sizes='110px' className='object-contain' />
            </span>
          </button>
        ))}
      </div>
      <p className='text-center text-sm font-bold text-slate-600 dark:text-slate-300'>{message}</p>
    </div>
  );
};

const quizQuestions = [
  { question: 'A pet has 4 legs. How many legs do two pets have?', options: [6, 8, 10, 12], answer: 8 },
  { question: 'Buddy has 3 treats. You give Buddy 2 more. How many treats does Buddy have?', options: [4, 5, 6, 7], answer: 5 },
  { question: 'Which number comes next: 2, 4, 6, __?', options: [7, 8, 9, 10], answer: 8 },
  { question: 'Mochi sleeps for 2 hours in the morning and 3 hours later. How many hours is that?', options: [4, 5, 6, 7], answer: 5 },
  { question: 'There are 5 bubbles. You pop 2. How many bubbles are left?', options: [2, 3, 4, 5], answer: 3 },
  { question: 'Which shape has three sides?', options: ['Circle', 'Square', 'Triangle', 'Star'], answer: 'Triangle' },
  { question: 'Luna has 4 toy balls. She finds 4 more. How many toy balls does she have?', options: [6, 7, 8, 9], answer: 8 },
];

export const QuizGame = ({ onWin }: { onWin: () => void }) => {
  const [status, setStatus] = useState('');
  const [quiz] = useState(() => quizQuestions[Math.floor(Math.random() * quizQuestions.length)]);
  const answer = (selectedAnswer: string | number) => {
    if (selectedAnswer === quiz.answer) {
      setStatus('Correct!');
      window.setTimeout(onWin, 320);
    } else setStatus('Not quite — try another answer.');
  };
  return (
    <div className='space-y-4'>
      <div className='rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/50'>
        <Lightbulb className='mx-auto mb-1.5 text-emerald-500' size={26} />
        <p className='font-bold text-slate-800 dark:text-white'>{quiz.question}</p>
      </div>
      <div className='grid grid-cols-2 gap-2.5'>
        {quiz.options.map((option) => (
          <button
            key={option}
            type='button'
            onClick={() => answer(option)}
            className='rounded-lg border border-emerald-300 bg-white px-4 py-2.5 font-black text-emerald-700 transition hover:border-emerald-500 active:scale-95 dark:bg-slate-800 dark:text-emerald-300'
          >
            {option}
          </button>
        ))}
      </div>
      {status && <p className='text-center text-sm font-bold text-emerald-600'>{status}</p>}
    </div>
  );
};

export const ClassicMiniGames = ({ kind, onWin }: { kind: GameKind; onWin: () => void }) => {
  if (kind === 'xo') return <XoGame onWin={onWin} />;
  if (kind === 'memory') return <MemoryGame onWin={onWin} />;
  if (kind === 'cups') return <CupsGame onWin={onWin} />;
  if (kind === 'quiz') return <QuizGame onWin={onWin} />;
  return null;
};
