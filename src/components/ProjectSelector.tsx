import { Project } from '@/types/journey';
import { FolderOpen, Plus, ChevronDown, Check, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectSelectorProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, name: string) => void;
}

export const ProjectSelector = ({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
}: ProjectSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleStartEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
  };

  const handleSaveEdit = (projectId: string) => {
    if (editName.trim()) {
      onRenameProject(projectId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
          isOpen
            ? 'bg-secondary border-border text-foreground'
            : 'border-transparent hover:bg-secondary text-foreground'
        }`}
      >
        <FolderOpen className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium max-w-[150px] truncate">
          {activeProject?.name || 'Select Project'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 z-50 w-64 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-2 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1">
                  Projects
                </p>
              </div>

              <div className="max-h-[300px] overflow-y-auto scrollbar-thin p-1">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                      project.id === activeProject?.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      if (editingId !== project.id) {
                        onSelectProject(project.id);
                        setIsOpen(false);
                      }
                    }}
                  >
                    {project.id === activeProject?.id && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    {project.id !== activeProject?.id && <div className="w-4" />}

                    {editingId === project.id ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(project.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        onBlur={() => handleSaveEdit(project.id)}
                        className="flex-1 text-sm bg-transparent border-b border-primary focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className="flex-1 text-sm truncate"
                        onDoubleClick={(e) => handleStartEdit(project, e)}
                      >
                        {project.name}
                      </span>
                    )}

                    {projects.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-border">
                <button
                  onClick={() => {
                    onCreateProject();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
