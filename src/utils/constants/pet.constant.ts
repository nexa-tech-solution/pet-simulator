import { PET_ENUM } from '../enums/pet.enum';
import { PetType } from '../types/pet.type';
import { IMAGES, LOTTIES, RIVES } from './images';

export const PETS = new Map<PET_ENUM, PetType>([
  [
    PET_ENUM.BLACK_CAT,
    {
      imageUrl: RIVES.CAT,
      name: 'Black Cat',
      stateMachines: 'State Machine 1',
      imageType: 'rive',
      sleep: {
        imageUrl: LOTTIES.GREY_CAT_SLEEP,
        name: 'Black Cat',
        imageType: 'lottie',
      },
    },
  ],
  [
    PET_ENUM.GREY_CAT,
    {
      imageUrl: RIVES.GREY_CAT,
      name: 'Grey Cat',
      stateMachines: 'State Machine 1',
      imageType: 'rive',
      sleep: {
        imageUrl: LOTTIES.GREY_CAT_SLEEP,
        name: 'Grey Cat',
        imageType: 'lottie',
      },
    },
  ],
  [
    PET_ENUM.HAPPY_DOG,
    {
      imageUrl: RIVES.HAPPY_DOG,
      name: 'Happy Dog',
      stateMachines: 'State Machine 1',
      imageType: 'rive',
      sleep: {
        imageUrl: IMAGES.HAPPY_DOG_SLEEP,
        name: 'Happy Dog',
        imageType: 'image',
      },
    },
  ],
  [
    PET_ENUM.ORANGE_CAT,
    {
      imageUrl: LOTTIES.ORANGE_CAT,
      name: 'Orange Cat',
      stateMachines: '',
      imageType: 'lottie',
      sleep: {
        imageUrl: LOTTIES.GENERAL_SLEEPING,
        name: 'Orange Cat',
        imageType: 'lottie',
      },
    },
  ],
  [
    PET_ENUM.WHITE_PUPPY,
    {
      imageUrl: LOTTIES.WHITE_PUPPY,
      name: 'White Puppy',
      stateMachines: '',
      imageType: 'lottie',
      sleep: {
        imageUrl: IMAGES.WHITE_PUPPY_SLEEP,
        name: 'White Puppy',
        imageType: 'image',
      },
    },
  ],
  [
    PET_ENUM.SNOOPY,
    {
      imageUrl: LOTTIES.SNOOPY,
      name: 'Snoopy',
      stateMachines: '',
      imageType: 'lottie',
      sleep: {
        imageUrl: IMAGES.SNOOPY_SLEEP,
        name: 'Snoopy',
        imageType: 'image',
      },
    },
  ],
  [
    PET_ENUM.LAZY_CAT,
    {
      imageUrl: LOTTIES.LAZY_CAT,
      name: 'Lazy Cat',
      stateMachines: '',
      imageType: 'lottie',
      sleep: {
        imageUrl: LOTTIES.GREY_CAT_SLEEP,
        name: 'Lazy Cat',
        imageType: 'lottie',
      },
    },
  ],
]);
