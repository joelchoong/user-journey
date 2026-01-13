export type CardTag = 'user' | 'system' | 'admin' | 'edge';

export interface JourneyCard {
  id: string;
  title: string;
  description?: string;
  tags: CardTag[];
}

export interface JourneyColumn {
  id: string;
  title: string;
  cards: JourneyCard[];
}

export interface Persona {
  name: string;
  description: string;
  goals: string[];
  painPoints: string[];
}

export interface JourneyBoard {
  persona: Persona;
  columns: JourneyColumn[];
}
