import { PET_ENUM } from '../enums/pet.enum';
import { PetType } from '../types/pet.type';

export const PETS = new Map<PET_ENUM, PetType>([
  [PET_ENUM.BLACK_CAT, { imageUrl: '/rive/cat.riv', name: 'Black Cat', stateMachines: 'State Machine 1' }],
  [PET_ENUM.GREY_CAT, { imageUrl: '/rive/grey_cat.riv', name: 'Grey Cat', stateMachines: 'State Machine 1' }],
]);
