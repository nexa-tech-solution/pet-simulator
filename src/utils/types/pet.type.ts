import { PET_ENUM } from '../enums/pet.enum';

export type PetIdType = PET_ENUM | string;

export type PetImageType = {
  imageUrl: any;
  stateMachines?: string;
  imageType?: 'lottie' | 'rive' | 'image';
};

export type PetType = {
  id: PetIdType;
  name: string;
  sleep?: PetImageType;
  wakeup?: PetImageType;
  description?: string;
  personality?: string;
  greeting?: string;
};

export type StatisticsType = {
  happiness: number;
  hunger: number;
  energy: number;
  coins: number;
};

export type PetCustomizationType = {
  name?: string;
};

export type PetProfilesType = Partial<Record<PetIdType, PetCustomizationType>>;

export type CustomPetType = {
  id: string;
  name: string;
  imageUrl: string;
  personality?: string;
  createdAt: number;
};

export type CustomPetsType = Record<string, CustomPetType>;

export type FeedbackType = {
  id: number;
  text: string;
  color: string;
  x: string; // CSS position string (e.g., '50%')
  y: string; // CSS position string (e.g., '40%')
};
