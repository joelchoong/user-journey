import { Layers } from 'lucide-react';
import { Project, Persona } from '@/types/journey';
import { ProjectSelector } from './ProjectSelector';
import { PersonaSelector } from './PersonaSelector';

interface HeaderProps {
  projects: Project[];
  activeProject: Project | null;
  activePersona: Persona | null;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, name: string) => void;
  onSelectPersona: (personaId: string) => void;
  onCreatePersona: () => void;
  onDeletePersona: (personaId: string) => void;
  onUpdatePersona: (persona: Persona) => void;
}

export const Header = ({
  projects,
  activeProject,
  activePersona,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
  onSelectPersona,
  onCreatePersona,
  onDeletePersona,
  onUpdatePersona,
}: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-4">
        {/* App Logo & Name */}
        <div className="flex items-center gap-3 pr-4 border-r border-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">Upstack Story</h1>
            <p className="text-xs text-muted-foreground">User Journey Mapping</p>
          </div>
        </div>

        {/* Project Selector */}
        <ProjectSelector
          projects={projects}
          activeProject={activeProject}
          onSelectProject={onSelectProject}
          onCreateProject={onCreateProject}
          onDeleteProject={onDeleteProject}
          onRenameProject={onRenameProject}
        />

        {/* Persona Selector */}
        {activeProject && (
          <PersonaSelector
            personas={activeProject.personas}
            activePersona={activePersona}
            onSelectPersona={onSelectPersona}
            onCreatePersona={onCreatePersona}
            onDeletePersona={onDeletePersona}
            onUpdatePersona={onUpdatePersona}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          Auto-saved
        </span>
      </div>
    </header>
  );
};
