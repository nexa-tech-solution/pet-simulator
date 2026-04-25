'use client';

import { Image as ImageIcon, Upload } from 'lucide-react';
import { ChangeEvent } from 'react';

type ImageControlsProps = {
  imageUrl: string;
  setImageUrl: (imageUrl: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setSavedText: (text: string) => void;
};

export const ImageControls = ({ imageUrl, setImageUrl, fileInputRef, handleFileChange, setSavedText }: ImageControlsProps) => (
  <div className='flex flex-col gap-2'>
    <label className='flex flex-col gap-2'>
      <span className='text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5'>
        <ImageIcon size={14} /> Image URL
      </span>
      <input
        value={imageUrl}
        onChange={(event) => {
          setImageUrl(event.target.value);
          setSavedText('');
        }}
        placeholder='https://example.com/pet.png'
        className='w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400'
      />
    </label>
    <button
      type='button'
      onClick={() => fileInputRef.current?.click()}
      className='h-10 w-fit px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-sm font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition'
    >
      <Upload size={16} /> Upload
    </button>
    <input ref={fileInputRef} type='file' accept='image/png,image/jpeg,image/webp,image/gif' onChange={handleFileChange} className='hidden' />
  </div>
);
