export type PetType = {
  imageUrl: any;
  name: string;
  stateMachines?: string;
  imageType?: 'lottie' | 'rive' | 'image';
  sleep?: PetType;
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
