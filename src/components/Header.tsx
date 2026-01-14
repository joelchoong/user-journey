import { Upload } from "lucide-react";
import { Project, Persona, JourneyColumn } from "@/types/journey";
import { ProjectSelector } from "./project/ProjectSelector";
import { PersonaSelector } from "./persona/PersonaSelector";
import { ImportSpreadsheet } from "./import/ImportSpreadsheet";
import { useState } from "react";
import { ProfileDropdown } from "./header/ProfileDropdown";
import { ShareDropdown } from "./header/ShareDropdown";

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
  onImportColumns?: (columns: JourneyColumn[]) => void;
  onSaveAsPDF?: () => void;
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
  onImportColumns,
  onSaveAsPDF,
}: HeaderProps) => {
  const [isImportOpen, setIsImportOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between relative z-50 print:hidden">
      <div className="flex items-center gap-4">
        {/* Profile Avatar */}
        <ProfileDropdown />

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
        {/* Import Button */}
        {activePersona && onImportColumns && (
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Import</span>
          </button>
        )}

        {/* Share Dropdown */}
        <ShareDropdown onSaveAsPDF={onSaveAsPDF} />
      </div>

      {/* Import Dialog */}
      {onImportColumns && (
        <ImportSpreadsheet isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onImport={onImportColumns} />
      )}
    </header>
  );
};
