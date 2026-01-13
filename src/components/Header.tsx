import { Layers, Share2, Link, FileDown, Check } from 'lucide-react';
import { Project, Persona } from '@/types/journey';
import { ProjectSelector } from './ProjectSelector';
import { PersonaSelector } from './PersonaSelector';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

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
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsPDF = () => {
    window.print();
    setIsShareOpen(false);
    toast.success('Print dialog opened');
  };

  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between relative z-50 print:hidden">
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

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsShareOpen(!isShareOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
            isShareOpen
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'border-border hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </button>

        <AnimatePresence>
          {isShareOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsShareOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 z-50 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-1">
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Link className="w-4 h-4 text-muted-foreground" />
                    )}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={handleSaveAsPDF}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <FileDown className="w-4 h-4 text-muted-foreground" />
                    Save as PDF
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
