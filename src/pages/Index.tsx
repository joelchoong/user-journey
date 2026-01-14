import { Header } from '@/components/Header';
import { Sidebar } from '@/components/layout/Sidebar';
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
    filteredColumns,
    filterTag,
    setFilterTag,
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

  return (
    <div className="h-screen flex bg-background overflow-hidden font-sans">
      <Sidebar
        projects={appState.projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onRenameProject={handleRenameProject}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeProject={activeProject}
          activePersona={activePersona}
          filterTag={filterTag}
          onFilterChange={setFilterTag}
          onSelectPersona={handleSelectPersona}
          onCreatePersona={handleCreatePersona}
          onDeletePersona={handleDeletePersona}
          onUpdatePersona={handleUpdatePersona}
          onImportColumns={handleImportColumns}
          onSaveAsPDF={handleSaveAsPDF}
        />

        <main className="flex-1 bg-muted/30 relative flex flex-col overflow-hidden">
          {!activeProject ? (
            <div className="flex-1 h-full flex items-center justify-center bg-muted/5">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center line-pulse">
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">No project selected</h3>
                <p className="text-sm text-muted-foreground mb-4">Select or create a project from the sidebar to start</p>
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
          ) : !activePersona ? (
            <div className="flex-1 h-full flex items-center justify-center bg-muted/5">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center line-pulse">
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">No personas found</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first persona to start mapping their journey</p>
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
          ) : (
            <>
              <JourneyBoard
                columns={filteredColumns}
                workflows={activePersona.workflows || []}
                onColumnsChange={handleColumnsChange}
                onAddWorkflow={handleAddWorkflow}
                onUpdateWorkflow={handleUpdateWorkflow}
              />
              {/* Printable Journey - Hidden, only shows when printing */}
              <PrintableJourney
                columns={filteredColumns}
                persona={activePersona}
                projectName={activeProject.name}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
