export interface CreatureStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface CreatureSummary {
  id: string;
  name: string;
  thumbnail: string;
}

export interface CreatureDetail extends CreatureSummary {
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: CreatureStats;
  baseExperience: number;
}

export type AppStack = 'FEED' | 'DETAILS';