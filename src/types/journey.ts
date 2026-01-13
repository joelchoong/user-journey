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
  id: string;
  name: string;
  description: string;
  goals: string[];
  painPoints: string[];
  columns: JourneyColumn[];
}

export interface Project {
  id: string;
  name: string;
  personas: Persona[];
  activePersonaId: string | null;
}

export interface AppState {
  projects: Project[];
  activeProjectId: string | null;
}
