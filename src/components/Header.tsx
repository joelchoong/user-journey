import { Upload, Filter, Check } from "lucide-react";
import { Project, Persona, JourneyColumn, CardTag } from "@/types/journey";
import { PersonaSelector } from "./persona/PersonaSelector";
import { ImportSpreadsheet } from "./import/ImportSpreadsheet";
import { useState } from "react";
import { ShareDropdown } from "./header/ShareDropdown";
import { TagBadge } from "./board/TagBadge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HeaderProps {
  activeProject: Project | null;
  activePersona: Persona | null;
  filterTag: CardTag | 'all';
  onFilterChange: (tag: CardTag | 'all') => void;
  onSelectPersona: (personaId: string) => void;
  onCreatePersona: () => void;
  onDeletePersona: (personaId: string) => void;
  onUpdatePersona: (persona: Persona) => void;
  onImportColumns?: (columns: JourneyColumn[]) => void;
}

export const Header = ({
  activeProject,
  activePersona,
  filterTag,
  onFilterChange,
  onSelectPersona,
  onCreatePersona,
  onDeletePersona,
  onUpdatePersona,
  onImportColumns,
}: HeaderProps) => {
  const [isImportOpen, setIsImportOpen] = useState(false);

  const roleTags: CardTag[] = ['user', 'system', 'admin', 'edge'];
  const releaseTags: CardTag[] = ['mvp', 'v1', 'v2', 'out-of-scope'];

  const getFilterLabel = () => {
    if (filterTag === 'all') return 'All Tags';
    return <TagBadge tag={filterTag} />;
  };

  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between relative z-50 print:hidden">
      <div className="flex items-center gap-4">
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
        {/* Tag Filter */}
        {activePersona && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors h-[38px]">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter:</span>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  {getFilterLabel()}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-3">
                <button
                  onClick={() => onFilterChange('all')}
                  className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center justify-between ${filterTag === 'all' ? 'bg-muted/50' : ''}`}
                >
                  <span className="font-medium text-foreground">View All Tags</span>
                  {filterTag === 'all' && <Check className="w-3 h-3 text-primary" />}
                </button>

                <div className="h-px bg-border mx-1" />

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">Role</p>
                  <div className="space-y-0.5">
                    {roleTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => onFilterChange(tag)}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center justify-between ${filterTag === tag ? 'bg-muted/50' : ''}`}
                      >
                        <TagBadge tag={tag} />
                        {filterTag === tag && <Check className="w-3 h-3 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">Release</p>
                  <div className="space-y-0.5">
                    {releaseTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => onFilterChange(tag)}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center justify-between ${filterTag === tag ? 'bg-muted/50' : ''}`}
                      >
                        <TagBadge tag={tag} />
                        {filterTag === tag && <Check className="w-3 h-3 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

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
        <ShareDropdown />
      </div>

      {/* Import Dialog */}
      {onImportColumns && (
        <ImportSpreadsheet isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onImport={onImportColumns} />
      )}
    </header>
  );
};
