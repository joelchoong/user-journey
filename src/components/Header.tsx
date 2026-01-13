import { Share2, Link, FileDown, Check, Upload, LogOut, Settings, User } from 'lucide-react';
import { Project, Persona, JourneyColumn } from '@/types/journey';
import { ProjectSelector } from './ProjectSelector';
import { PersonaSelector } from './PersonaSelector';
import { ImportSpreadsheet } from './ImportSpreadsheet';
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
  onImportColumns?: (columns: JourneyColumn[]) => void;
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
}: HeaderProps) => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Mock user data - replace with actual auth later
  const userName = 'John Doe';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(e.target as Node)) {
        setIsShareOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
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

  const handleProfileSettings = () => {
    setIsProfileOpen(false);
    toast.info('Profile settings coming soon!');
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    toast.info('Sign out coming soon!');
  };

  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between relative z-50 print:hidden">
      <div className="flex items-center gap-4">
        {/* Profile Avatar */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors ${
              isProfileOpen ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background' : ''
            }`}
          >
            {userInitials}
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 z-50 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {userInitials}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{userName}</p>
                        <p className="text-xs text-muted-foreground">john@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleProfileSettings}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
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
        <div className="relative" ref={shareDropdownRef}>
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
      </div>

      {/* Import Dialog */}
      {onImportColumns && (
        <ImportSpreadsheet
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImport={onImportColumns}
        />
      )}
    </header>
  );
};
