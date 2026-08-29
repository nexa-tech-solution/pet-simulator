'use client';

import CAT_FOOD_CHICKEN_PUMPKIN from '@/assets/images/cat-food-chicken-pumpkin.png';
import CAT_FOOD_CHICKEN_EGG from '@/assets/images/cat-food-chicken-egg.png';
import CAT_FOOD_COD_GREENS from '@/assets/images/cat-food-cod-greens.png';
import CAT_DRINK_MILK from '@/assets/images/cat-drink-milk.png';
import CAT_DRINK_SALMON_BROTH from '@/assets/images/cat-drink-salmon-broth.png';
import CAT_FOOD_DUCK_PUMPKIN from '@/assets/images/cat-food-duck-pumpkin.png';
import CAT_FOOD_SARDINES from '@/assets/images/cat-food-sardines.png';
import CAT_FOOD_SPRITE from '@/assets/images/cat-food-sprite.png';
import CAT_FOOD_SAUSAGE_BITES from '@/assets/images/cat-food-sausage-bites.png';
import CAT_FOOD_TUNA_BROTH from '@/assets/images/cat-food-tuna-broth.png';
import DOG_FOOD_BEEF_STEW from '@/assets/images/dog-food-beef-stew.png';
import DOG_DRINK_BERRY_WATER from '@/assets/images/dog-drink-berry-water.png';
import DOG_DRINK_PUMPKIN_BROTH from '@/assets/images/dog-drink-pumpkin-broth.png';
import DOG_FOOD_LAMB_STEW from '@/assets/images/dog-food-lamb-stew.png';
import DOG_FOOD_SALMON_RICE from '@/assets/images/dog-food-salmon-rice.png';
import DOG_FOOD_SAUSAGE_PLATE from '@/assets/images/dog-food-sausage-plate.png';
import DOG_FOOD_SPRITE from '@/assets/images/dog-food-sprite.png';
import DOG_FOOD_CHICKEN_BROTH from '@/assets/images/dog-food-chicken-broth.png';
import DOG_FOOD_TURKEY_VEGETABLES from '@/assets/images/dog-food-turkey-vegetables.png';
import DOG_FOOD_TURKEY_RICE from '@/assets/images/dog-food-turkey-rice.png';
import { PET_ENUM } from '@/utils/enums/pet.enum';
import { PetIdType } from '@/utils/types/pet.type';
import { LoaderCircle, LockKeyhole, X } from 'lucide-react';
import { StaticImageData } from 'next/image';
import { useState } from 'react';

type FoodSprite = 'cat' | 'dog';
type MenuCategory = 'food' | 'drink';

const UNLOCK_START_INDEX = 4;

export type PetFood = {
  id: string;
  name: string;
  description: string;
  hunger: number;
  sprite: FoodSprite;
  spriteIndex: 0 | 1 | 2;
  category?: MenuCategory;
  artwork?: StaticImageData;
};

const catFoods = (pet: string, labels: string[]): PetFood[] => [
  { id: `${pet}-fish`, name: labels[0], description: 'A little everyday treat', hunger: 18, sprite: 'cat', spriteIndex: 0 },
  { id: `${pet}-pate`, name: labels[1], description: 'Creamy and filling', hunger: 30, sprite: 'cat', spriteIndex: 1 },
  { id: `${pet}-feast`, name: labels[2], description: 'A chef-made special meal', hunger: 48, sprite: 'cat', spriteIndex: 2 },
  {
    id: `${pet}-chicken-pumpkin`,
    name: 'Chicken & pumpkin',
    description: 'A nourishing warm bowl',
    hunger: 36,
    sprite: 'cat',
    spriteIndex: 0,
    artwork: CAT_FOOD_CHICKEN_PUMPKIN,
  },
  {
    id: `${pet}-sardines`,
    name: 'Sardine supper',
    description: 'Omega-rich fish and greens',
    hunger: 42,
    sprite: 'cat',
    spriteIndex: 0,
    artwork: CAT_FOOD_SARDINES,
  },
  {
    id: `${pet}-cod-greens`,
    name: 'Cod & greens',
    description: 'A wholesome catch of the day',
    hunger: 48,
    sprite: 'cat',
    spriteIndex: 0,
    artwork: CAT_FOOD_COD_GREENS,
  },
  {
    id: `${pet}-chicken-egg`,
    name: 'Chicken & egg',
    description: 'A protein-packed dinner',
    hunger: 54,
    sprite: 'cat',
    spriteIndex: 0,
    artwork: CAT_FOOD_CHICKEN_EGG,
  },
  {
    id: `${pet}-duck-pumpkin`,
    name: 'Duck & pumpkin',
    description: 'A cozy autumn supper',
    hunger: 60,
    sprite: 'cat',
    spriteIndex: 0,
    artwork: CAT_FOOD_DUCK_PUMPKIN,
  },
  {
    id: `${pet}-sausage-bites`,
    name: 'Sausage bites',
    description: 'Grilled chicken snack coins',
    hunger: 38,
    sprite: 'cat',
    spriteIndex: 0,
    artwork: CAT_FOOD_SAUSAGE_BITES,
  },
  {
    id: `${pet}-tuna-broth`,
    name: 'Tuna broth',
    description: 'A warm, hydrating sip',
    hunger: 14,
    sprite: 'cat',
    spriteIndex: 0,
    category: 'drink',
    artwork: CAT_FOOD_TUNA_BROTH,
  },
  {
    id: `${pet}-cat-milk`,
    name: 'Cat milk',
    description: 'A smooth lactose-free sip',
    hunger: 12,
    sprite: 'cat',
    spriteIndex: 0,
    category: 'drink',
    artwork: CAT_DRINK_MILK,
  },
  {
    id: `${pet}-salmon-broth`,
    name: 'Salmon broth',
    description: 'A savory, hydrating sip',
    hunger: 16,
    sprite: 'cat',
    spriteIndex: 0,
    category: 'drink',
    artwork: CAT_DRINK_SALMON_BROTH,
  },
];

const dogFoods = (pet: string, labels: string[]): PetFood[] => [
  { id: `${pet}-kibble`, name: labels[0], description: 'Crunchy daily fuel', hunger: 18, sprite: 'dog', spriteIndex: 0 },
  { id: `${pet}-bone`, name: labels[1], description: 'A tail-wagging treat', hunger: 30, sprite: 'dog', spriteIndex: 1 },
  { id: `${pet}-dinner`, name: labels[2], description: 'A delicious dinner plate', hunger: 48, sprite: 'dog', spriteIndex: 2 },
  {
    id: `${pet}-turkey-rice`,
    name: 'Turkey & rice',
    description: 'A balanced hearty bowl',
    hunger: 36,
    sprite: 'dog',
    spriteIndex: 0,
    artwork: DOG_FOOD_TURKEY_RICE,
  },
  {
    id: `${pet}-beef-stew`,
    name: 'Beef & sweet potato',
    description: 'A comforting power meal',
    hunger: 42,
    sprite: 'dog',
    spriteIndex: 0,
    artwork: DOG_FOOD_BEEF_STEW,
  },
  {
    id: `${pet}-lamb-stew`,
    name: 'Lamb & sweet potato',
    description: 'A rich and satisfying supper',
    hunger: 48,
    sprite: 'dog',
    spriteIndex: 0,
    artwork: DOG_FOOD_LAMB_STEW,
  },
  {
    id: `${pet}-salmon-rice`,
    name: 'Salmon & rice',
    description: 'A shiny-coat supper',
    hunger: 54,
    sprite: 'dog',
    spriteIndex: 0,
    artwork: DOG_FOOD_SALMON_RICE,
  },
  {
    id: `${pet}-turkey-vegetables`,
    name: 'Turkey & vegetables',
    description: 'A wholesome tail-wagging bowl',
    hunger: 60,
    sprite: 'dog',
    spriteIndex: 0,
    artwork: DOG_FOOD_TURKEY_VEGETABLES,
  },
  {
    id: `${pet}-sausage-plate`,
    name: 'Sausage plate',
    description: 'Turkey sausage and mash',
    hunger: 38,
    sprite: 'dog',
    spriteIndex: 0,
    artwork: DOG_FOOD_SAUSAGE_PLATE,
  },
  {
    id: `${pet}-chicken-broth`,
    name: 'Chicken broth',
    description: 'A warm, hydrating sip',
    hunger: 14,
    sprite: 'dog',
    spriteIndex: 0,
    category: 'drink',
    artwork: DOG_FOOD_CHICKEN_BROTH,
  },
  {
    id: `${pet}-berry-water`,
    name: 'Berry water',
    description: 'A refreshing hydration boost',
    hunger: 8,
    sprite: 'dog',
    spriteIndex: 0,
    category: 'drink',
    artwork: DOG_DRINK_BERRY_WATER,
  },
  {
    id: `${pet}-pumpkin-broth`,
    name: 'Pumpkin broth',
    description: 'A cozy, hydrating sip',
    hunger: 16,
    sprite: 'dog',
    spriteIndex: 0,
    category: 'drink',
    artwork: DOG_DRINK_PUMPKIN_BROTH,
  },
];

const PET_FOOD_SETS: Record<PET_ENUM, PetFood[]> = {
  [PET_ENUM.BLACK_CAT]: catFoods('mochi', ['Tuna flakes', 'Creamy pâté', 'Salmon feast']),
  [PET_ENUM.GREY_CAT]: catFoods('luna', ['Silver fish', 'Shrimp pâté', 'Luna’s sushi set']),
  [PET_ENUM.ORANGE_CAT]: catFoods('pumpkin', ['Fishy nibble', 'Pumpkin pâté', 'Royal salmon bowl']),
  [PET_ENUM.LAZY_CAT]: catFoods('miso', ['Sleepy snack', 'Chicken pâté', 'Midnight sushi']),
  [PET_ENUM.HAPPY_DOG]: dogFoods('buddy', ['Kibble bowl', 'Chicken bone', 'Buddy’s big dinner']),
  [PET_ENUM.WHITE_PUPPY]: dogFoods('snowy', ['Tiny kibble', 'Milk bone', 'Snowy’s supper']),
  [PET_ENUM.SNOOPY]: dogFoods('snoopy', ['Crunchy kibble', 'Sausage bone', 'Gentleman’s dinner']),
};

export const getFoodsForPet = (petId: PetIdType) => PET_FOOD_SETS[petId as PET_ENUM] ?? PET_FOOD_SETS[PET_ENUM.BLACK_CAT];

type FoodPickerSheetProps = {
  petId: PetIdType;
  petName: string;
  unlockedFoodIds: string[];
  /** The dish currently waiting on its ad, if any. */
  unlockingFoodId?: string | null;
  /** Explains an unlock that did not happen; nothing is shown when null. */
  notice?: string | null;
  onClose: () => void;
  onChooseFood: (food: PetFood) => void;
  onUnlockFood: (food: PetFood) => void;
};

const FoodArtwork = ({ food }: { food: PetFood }) => {
  const artwork: StaticImageData = food.artwork ?? (food.sprite === 'cat' ? CAT_FOOD_SPRITE : DOG_FOOD_SPRITE);
  const position = `${food.spriteIndex * 50}% 50%`;

  return (
    <span
      aria-hidden='true'
      className='absolute inset-[9%] rounded-2xl'
      style={{
        backgroundImage: `url(${artwork.src})`,
        backgroundPosition: food.artwork ? 'center' : position,
        backgroundRepeat: 'no-repeat',
        backgroundSize: food.artwork ? 'contain' : '300% 100%',
      }}
    />
  );
};

export const FoodPickerSheet = ({
  petId,
  petName,
  unlockedFoodIds,
  unlockingFoodId,
  notice,
  onClose,
  onChooseFood,
  onUnlockFood,
}: FoodPickerSheetProps) => {
  const foods = getFoodsForPet(petId);
  const [selectedFoodId, setSelectedFoodId] = useState(foods[0]?.id);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('food');
  const visibleFoods = foods.map((food, index) => ({ food, index })).filter(({ food }) => (food.category ?? 'food') === activeCategory);

  return (
    <div
      className='fixed inset-0 z-[70] flex items-end bg-slate-950/45 backdrop-blur-[2px] sm:items-center sm:justify-center'
      role='dialog'
      aria-modal='true'
      aria-label={`Feed ${petName}`}
      onClick={onClose}
    >
      <section
        className='h-[70%] w-full max-w-lg animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] overflow-y-auto rounded-t-[20px] bg-[#fffdfb] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_45px_rgba(15,23,42,0.25)] sm:rounded-[20px] sm:pb-6'
        onClick={(event) => event.stopPropagation()}
      >
        <header className='relative mb-4 flex h-9 items-center justify-center'>
          <div className='h-1.5 w-10 rounded-full bg-slate-200 sm:hidden' />
          <button
            type='button'
            onClick={onClose}
            aria-label='Close food menu'
            className='absolute right-0 grid h-9 w-9 place-items-center rounded-full bg-orange-50 text-orange-500 transition hover:bg-orange-100 active:scale-95'
          >
            <X size={20} strokeWidth={2.8} />
          </button>
        </header>

        <div className='mb-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1' role='tablist' aria-label='Food category'>
          {(['food', 'drink'] as const).map((category) => {
            const isActive = activeCategory === category;
            const count = foods.filter((food) => (food.category ?? 'food') === category).length;

            return (
              <button
                key={category}
                type='button'
                role='tab'
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={`rounded-[10px] px-3 py-2 text-xs font-bold transition-all ${
                  isActive ? 'bg-white text-indigo-600 shadow-[0_2px_7px_rgba(15,23,42,0.1)]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {category === 'food' ? 'Food' : 'Drinks'} <span className='opacity-60'>({count})</span>
              </button>
            );
          })}
        </div>

        {notice && (
          <p role='status' className='mb-3 rounded-xl bg-amber-50 px-3 py-2 text-center text-[11px] font-bold leading-snug text-amber-900'>
            {notice}
          </p>
        )}

        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {visibleFoods.map(({ food, index }) => {
            const requiresUnlock = index >= UNLOCK_START_INDEX;
            const isUnlocked = !requiresUnlock || unlockedFoodIds.includes(food.id);
            // Every locked dish stands on its own: one ad, that dish. Requiring the earlier
            // ones first left all but the first card inert, which read as a broken button.
            const isBusy = unlockingFoodId === food.id;
            // One ad at a time - the rest wait rather than queueing up requests.
            const isBlockedByOtherUnlock = !isUnlocked && Boolean(unlockingFoodId) && !isBusy;
            const isSelected = selectedFoodId === food.id;

            return (
              <button
                type='button'
                key={food.id}
                aria-label={isUnlocked ? `Feed ${food.name} to ${petName}` : `Unlock ${food.name} with a video ad`}
                disabled={isBusy || isBlockedByOtherUnlock}
                onClick={() => {
                  setSelectedFoodId(food.id);
                  if (isUnlocked) onChooseFood(food);
                  else onUnlockFood(food);
                }}
                className={`relative aspect-square cursor-pointer overflow-hidden rounded-[14px] border-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-[0.96] disabled:cursor-wait ${
                  !isUnlocked
                    ? `border-amber-300 bg-amber-50 text-amber-800 shadow-[0_5px_14px_rgba(180,83,9,0.12)] ${isBlockedByOtherUnlock ? 'cursor-not-allowed opacity-75' : 'hover:bg-amber-100'}`
                    : isSelected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-none'
                      : 'border-transparent bg-white text-slate-400 shadow-[0_5px_14px_rgba(15,23,42,0.06)] hover:bg-slate-100'
                }`}
              >
                <span className='absolute inset-x-[9%] bottom-[17%] top-[7%]'>
                  <FoodArtwork food={food} />
                </span>
                <span className='absolute inset-x-2 bottom-[8%] truncate text-center text-[10px] font-bold uppercase leading-none'>{food.name}</span>
                {!isUnlocked && (
                  <span className='absolute inset-0 grid place-items-center bg-amber-950/[0.12] backdrop-blur-[1px]'>
                    <span className='flex min-w-[96px] flex-col items-center gap-1.5 rounded-xl border border-white/70 bg-[#fffaf0]/90 px-3 py-2 text-amber-950 shadow-[0_5px_16px_rgba(120,53,15,0.18)]'>
                      <span className='grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]'>
                        {isBusy ? <LoaderCircle size={18} className='animate-spin' /> : <LockKeyhole size={18} strokeWidth={2.8} />}
                      </span>
                      <span className='text-[10px] font-bold leading-none'>{isBusy ? 'Unlocking…' : 'Watch to unlock'}</span>
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
