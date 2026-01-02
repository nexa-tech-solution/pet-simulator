export type PetImageType = {
  imageUrl: any;
  stateMachines?: string;
  imageType?: 'lottie' | 'rive' | 'image';
};

export type PetType = {
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

export type FeedbackType = {
  id: number;
  text: string;
  color: string;
  x: string; // CSS position string (e.g., '50%')
  y: string; // CSS position string (e.g., '40%')
};
