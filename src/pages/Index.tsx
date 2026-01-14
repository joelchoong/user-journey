import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { JourneyBoard } from '@/components/JourneyBoard';
import { PrintableJourney } from '@/components/PrintableJourney';
import { AppState, Project, Persona, JourneyColumn, Workflow } from '@/types/journey';
import { initialAppState, createEmptyProject, createEmptyPersona } from '@/data/initialBoard';
import { Inbox, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const STORAGE_KEY = 'upstack-story-app';

const Index = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialAppState;
      }
    }
    return initialAppState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const activeProject = appState.projects.find(p => p.id === appState.activeProjectId) || null;
  const activePersona = activeProject?.personas.find(p => p.id === activeProject.activePersonaId) || null;

  // Project handlers
  const handleSelectProject = (projectId: string) => {
    setAppState(prev => ({ ...prev, activeProjectId: projectId }));
  };

  const handleCreateProject = () => {
    const { project } = createEmptyProject(`Project ${appState.projects.length + 1}`);
    setAppState(prev => ({
      ...prev,
      projects: [...prev.projects, project],
      activeProjectId: project.id,
    }));
  };

  const handleDeleteProject = (projectId: string) => {
    setAppState(prev => {
      const newProjects = prev.projects.filter(p => p.id !== projectId);
      const newActiveId = prev.activeProjectId === projectId
        ? newProjects[0]?.id || null
        : prev.activeProjectId;
      return { ...prev, projects: newProjects, activeProjectId: newActiveId };
    });
  };

  const handleRenameProject = (projectId: string, name: string) => {
    setAppState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, name } : p),
    }));
  };

  // Persona handlers
  const handleSelectPersona = (personaId: string) => {
    if (!activeProject) return;
    setAppState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === activeProject.id ? { ...p, activePersonaId: personaId } : p
      ),
    }));
  };

  const handleCreatePersona = () => {
    if (!activeProject) return;
    const newPersona = createEmptyPersona(`Persona ${activeProject.personas.length + 1}`);
    setAppState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === activeProject.id
          ? { ...p, personas: [...p.personas, newPersona], activePersonaId: newPersona.id }
          : p
      ),
    }));
  };

  const handleDeletePersona = (personaId: string) => {
    if (!activeProject) return;
    setAppState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== activeProject.id) return p;
        const newPersonas = p.personas.filter(per => per.id !== personaId);
        const newActivePersonaId = p.activePersonaId === personaId
          ? newPersonas[0]?.id || null
          : p.activePersonaId;
        return { ...p, personas: newPersonas, activePersonaId: newActivePersonaId };
      }),
    }));
  };

  const handleUpdatePersona = (updatedPersona: Persona) => {
    if (!activeProject) return;
    setAppState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === activeProject.id
          ? { ...p, personas: p.personas.map(per => per.id === updatedPersona.id ? updatedPersona : per) }
          : p
      ),
    }));
  };

  // Column handlers
  const handleColumnsChange = (columns: JourneyColumn[]) => {
    if (!activeProject || !activePersona) return;
    setAppState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === activeProject.id
          ? {
            ...p,
            personas: p.personas.map(per =>
              per.id === activePersona.id ? { ...per, columns } : per
            ),
          }
          : p
      ),
    }));
  };

  // Workflow handlers
  const handleAddWorkflow = (title: string, color: string) => {
    if (!activeProject || !activePersona) return;
    const newWorkflow: Workflow = {
      id: `wf-${Math.random().toString(36).substr(2, 9)}`,
      title,
      color,
    };

    setAppState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === activeProject.id
          ? {
            ...p,
            personas: p.personas.map(per =>
              per.id === activePersona.id
                ? { ...per, workflows: [...(per.workflows || []), newWorkflow] }
                : per
            ),
          }
          : p
      ),
    }));
    return newWorkflow.id;
  };

  const handleUpdateWorkflow = (workflowId: string, updates: Partial<Workflow>) => {
    if (!activeProject || !activePersona) return;
    setAppState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === activeProject.id
          ? {
            ...p,
            personas: p.personas.map(per =>
              per.id === activePersona.id
                ? {
                  ...per,
                  workflows: per.workflows?.map(wf =>
                    wf.id === workflowId ? { ...wf, ...updates } : wf
                  )
                }
                : per
            ),
          }
          : p
      ),
    }));
  };

  // Import columns (append to existing)
  const handleImportColumns = (newColumns: JourneyColumn[]) => {
    if (!activeProject || !activePersona) return;
    const existingColumns = activePersona.columns;
    handleColumnsChange([...existingColumns, ...newColumns]);
  };

  // Save as PDF
  const handleSaveAsPDF = useCallback(() => {
    if (!activePersona) {
      toast.error('No journey to export');
      return;
    }
    window.print();
    toast.success('Print dialog opened');
  }, [activePersona]);

  // Empty state for no project
  if (!activeProject) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <Header
          projects={appState.projects}
          activeProject={null}
          activePersona={null}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
          onDeleteProject={handleDeleteProject}
          onRenameProject={handleRenameProject}
          onSelectPersona={handleSelectPersona}
          onCreatePersona={handleCreatePersona}
          onDeletePersona={handleDeletePersona}
          onUpdatePersona={handleUpdatePersona}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first project to get started</p>
            <motion.button
              onClick={handleCreateProject}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state for no persona
  if (!activePersona) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <Header
          projects={appState.projects}
          activeProject={activeProject}
          activePersona={null}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
          onDeleteProject={handleDeleteProject}
          onRenameProject={handleRenameProject}
          onSelectPersona={handleSelectPersona}
          onCreatePersona={handleCreatePersona}
          onDeletePersona={handleDeletePersona}
          onUpdatePersona={handleUpdatePersona}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">No personas yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create a persona to start mapping their journey</p>
            <motion.button
              onClick={handleCreatePersona}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Persona
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header
        projects={appState.projects}
        activeProject={activeProject}
        activePersona={activePersona}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onRenameProject={handleRenameProject}
        onSelectPersona={handleSelectPersona}
        onCreatePersona={handleCreatePersona}
        onDeletePersona={handleDeletePersona}
        onUpdatePersona={handleUpdatePersona}
        onImportColumns={handleImportColumns}
        onSaveAsPDF={handleSaveAsPDF}
      />
      <JourneyBoard
        columns={activePersona.columns}
        workflows={activePersona.workflows}
        onColumnsChange={handleColumnsChange}
        onAddWorkflow={handleAddWorkflow}
        onUpdateWorkflow={handleUpdateWorkflow}
      />

      {/* Printable Journey - Hidden, only shows when printing */}
      <PrintableJourney
        columns={activePersona.columns}
        persona={activePersona}
        projectName={activeProject.name}
      />
    </div>
  );
};

export default Index;
