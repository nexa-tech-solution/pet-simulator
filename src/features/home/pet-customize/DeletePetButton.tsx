'use client';

import { Trash2, X } from 'lucide-react';
import { useState } from 'react';

type DeletePetButtonProps = {
  onDelete: () => void;
};

export const DeletePetButton = ({ onDelete }: DeletePetButtonProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div className='flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={onDelete}
          className='h-10 px-3 rounded-xl bg-red-500 text-white text-sm font-bold flex items-center gap-2 hover:bg-red-600 transition'
        >
          <Trash2 size={16} /> Delete
        </button>
        <button
          type='button'
          onClick={() => setIsConfirming(false)}
          className='h-10 px-3 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white text-sm font-bold flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-500 transition'
        >
          <X size={16} /> Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type='button'
      onClick={() => setIsConfirming(true)}
      className='h-10 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-sm font-bold flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/50 transition'
    >
      <Trash2 size={16} /> Delete Pet
    </button>
  );
};
