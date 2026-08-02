import { PETS } from '@/utils/constants/pet.constant';
import { SOUNDS } from '@/utils/constants/sounds';
import { PET_ENUM } from '@/utils/enums/pet.enum';
import { CustomPetsType, PetCustomizationType, PetIdType, PetProfilesType, PetType } from '@/utils/types/pet.type';

export const MAX_PET_NAME_LENGTH = 18;
export const MAX_PET_PERSONALITY_LENGTH = 240;
export const CUSTOM_PET_ID_PREFIX = 'CUSTOM_PET_';
export const DEFAULT_CUSTOM_PET_PERSONALITY =
  'You are a friendly virtual pet created by the user. You are warm, playful, affectionate, and curious. Stay in character as a sweet companion.';

export const isBuiltInPetId = (petId: PetIdType): petId is PET_ENUM => Object.values(PET_ENUM).includes(petId as PET_ENUM);

export const isCustomPetId = (petId: PetIdType): boolean => typeof petId === 'string' && petId.startsWith(CUSTOM_PET_ID_PREFIX);

export const createCustomPetId = (): string => `${CUSTOM_PET_ID_PREFIX}${Date.now()}`;

export const getPetProfile = (profiles: PetProfilesType, petId: PetIdType): PetCustomizationType => profiles[petId] ?? {};

/**
 * Resolves a pet's voice clip.
 *
 * Built-in pets have their own file. User-created pets have none, so they borrow one
 * based on their id — the same custom pet always sounds like itself, and no pet is mute.
 */
export const getPetSound = (petId: PetIdType): string => {
  const builtInSound = isBuiltInPetId(petId) ? PETS.get(petId)?.sound : undefined;

  if (builtInSound) return builtInSound;

  const pool = Object.values(SOUNDS);
  let hash = 0;

  for (let index = 0; index < String(petId).length; index++) {
    hash = (hash * 31 + String(petId).charCodeAt(index)) >>> 0;
  }

  return pool[hash % pool.length];
};

export const getCustomPetAsPet = (customPets: CustomPetsType, petId: PetIdType): PetType | null => {
  const customPet = typeof petId === 'string' ? customPets[petId] : null;

  if (!customPet) return null;

  return {
    id: customPet.id,
    name: customPet.name,
    wakeup: {
      imageUrl: customPet.imageUrl,
      imageType: 'image',
    },
    sleep: {
      imageUrl: customPet.imageUrl,
      imageType: 'image',
    },
    description: 'A custom companion created by the user.',
    personality: customPet.personality || DEFAULT_CUSTOM_PET_PERSONALITY,
    greeting: `Hi, I'm ${customPet.name}. I'm happy to be here with you.`,
  };
};

export const getPetDisplayName = (pet: PetType, profile?: PetCustomizationType): string => {
  const customName = profile?.name?.trim();

  return customName || pet.name;
};

export const normalizePetName = (name: string): string => name.trim().replace(/\s+/g, ' ').slice(0, MAX_PET_NAME_LENGTH);

export const normalizePetPersonality = (personality: string): string => personality.trim().replace(/\s+/g, ' ').slice(0, MAX_PET_PERSONALITY_LENGTH);

export const normalizePetImageUrl = (imageUrl: string): string => imageUrl.trim();

export const isValidPetImageUrl = (imageUrl: string): boolean => {
  const normalizedUrl = normalizePetImageUrl(imageUrl);

  if (!normalizedUrl) return true;
  if (normalizedUrl.startsWith('/')) return true;
  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(normalizedUrl)) return true;

  try {
    const url = new URL(normalizedUrl);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};
