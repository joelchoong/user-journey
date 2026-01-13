export type CardTag = 'user' | 'system' | 'admin' | 'edge';

export interface JourneyCard {
  id: string;
  title: string;
  description?: string;
  tags: CardTag[];
}

export interface Workflow {
  id: string;
  title: string;
  color?: string;
}

export interface JourneyColumn {
  id: string;
  title: string;
  cards: JourneyCard[];
  workflowId?: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  goals: string[];
  painPoints: string[];
  columns: JourneyColumn[];
  workflows?: Workflow[];
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
