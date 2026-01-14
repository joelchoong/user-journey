import { Header } from '@/components/Header';
import { JourneyBoard } from '@/components/board/JourneyBoard';
import { PrintableJourney } from '@/components/board/PrintableJourney';
import { Inbox, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useJourney } from '@/hooks/useJourney';

const Index = () => {
  const {
    appState,
    activeProject,
    activePersona,
    handleSelectProject,
    handleCreateProject,
    handleDeleteProject,
    handleRenameProject,
    handleSelectPersona,
    handleCreatePersona,
    handleDeletePersona,
    handleUpdatePersona,
    handleColumnsChange,
    handleAddWorkflow,
    handleUpdateWorkflow,
    handleImportColumns,
    handleSaveAsPDF,
  } = useJourney();

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
