'use client';

import { Stack } from '@mantine/core';
import Rive from '@rive-app/react-canvas';

export default function PetSection() {
  return (
    <Stack flex={1} align='center' justify='center' className='relative'>
      <Rive src='/rive/cat.riv' stateMachines='State Machine 1' className='w-[60vw] h-[50vh] md:w-[60vw] md:h-[60vh] lg:w-[70vw] lg:h-[70vh]' />
    </Stack>
  );
}
