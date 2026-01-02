'use client';
import { isSleeping } from '@/store/pet.store';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export default function AppMetaDataProvider() {
  const [sleeping] = useAtom(isSleeping);

  useEffect(() => {
    document.documentElement.dataset.sleep = sleeping ? 'true' : 'false';
  }, [sleeping]);

  return null;
}
