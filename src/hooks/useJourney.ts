import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { AppState, Project, Persona, JourneyColumn, Workflow, CardTag, UserProfile } from '@/types/journey';
import { initialAppState, createEmptyProject, createEmptyPersona } from '@/data/initialBoard';

const STORAGE_KEY = 'upstack-story-app';

export const useJourney = () => {
    const [appState, setAppState] = useState<AppState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsedState = JSON.parse(saved);
                // Merge with initialAppState to ensure all required fields exist
                // This handles backward compatibility when new fields are added
                return {
                    ...initialAppState,
                    ...parsedState,
                    user: parsedState.user || initialAppState.user, // Ensure user field exists
                };
            } catch {
                return initialAppState;
            }
        }
        return initialAppState;
    });

    const [filterTag, setFilterTag] = useState<CardTag | 'all'>('all');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    }, [appState]);

    const activeProject = appState.projects.find(p => p.id === appState.activeProjectId) || null;
    const activePersona = activeProject?.personas.find(p => p.id === activeProject.activePersonaId) || null;

    // Filter columns based on selected tag
    const filteredColumns = useMemo(() => {
        if (!activePersona) return [];
        if (filterTag === 'all') return activePersona.columns;

        return activePersona.columns.map(col => ({
            ...col,
            cards: col.cards.filter(card => card.tags.includes(filterTag))
        }));
    }, [activePersona, filterTag]);

    // Project handlers
    const handleSelectProject = useCallback((projectId: string) => {
        setAppState(prev => ({ ...prev, activeProjectId: projectId }));
    }, []);

    const handleCreateProject = useCallback(() => {
        const { project } = createEmptyProject(`Project ${appState.projects.length + 1}`);
        setAppState(prev => ({
            ...prev,
            projects: [...prev.projects, project],
            activeProjectId: project.id,
        }));
    }, [appState.projects.length]);

    const handleDeleteProject = useCallback((projectId: string) => {
        setAppState(prev => {
            const newProjects = prev.projects.filter(p => p.id !== projectId);
            const newActiveId = prev.activeProjectId === projectId
                ? newProjects[0]?.id || null
                : prev.activeProjectId;
            return { ...prev, projects: newProjects, activeProjectId: newActiveId };
        });
    }, []);

    const handleRenameProject = useCallback((projectId: string, name: string) => {
        setAppState(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === projectId ? { ...p, name } : p),
        }));
    }, []);

    // Persona handlers
    const handleSelectPersona = useCallback((personaId: string) => {
        if (!activeProject) return;
        setAppState(prev => ({
            ...prev,
            projects: prev.projects.map(p =>
                p.id === activeProject.id ? { ...p, activePersonaId: personaId } : p
            ),
        }));
    }, [activeProject]);

    const handleCreatePersona = useCallback(() => {
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
    }, [activeProject]);

    const handleDeletePersona = useCallback((personaId: string) => {
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
    }, [activeProject]);

    const handleUpdatePersona = useCallback((updatedPersona: Persona) => {
        if (!activeProject) return;
        setAppState(prev => ({
            ...prev,
            projects: prev.projects.map(p =>
                p.id === activeProject.id
                    ? { ...p, personas: p.personas.map(per => per.id === updatedPersona.id ? updatedPersona : per) }
                    : p
            ),
        }));
    }, [activeProject]);

    // Column handlers
    const handleColumnsChange = useCallback((columns: JourneyColumn[]) => {
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
    }, [activeProject, activePersona]);

    // Workflow handlers
    const handleAddWorkflow = useCallback((title: string, color: string) => {
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
    }, [activeProject, activePersona]);

    const handleUpdateWorkflow = useCallback((workflowId: string, updates: Partial<Workflow>) => {
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
    }, [activeProject, activePersona]);

    // Import columns (append to existing)
    const handleImportColumns = useCallback((newColumns: JourneyColumn[]) => {
        if (!activeProject || !activePersona) return;
        const existingColumns = activePersona.columns;
        handleColumnsChange([...existingColumns, ...newColumns]);
    }, [activeProject, activePersona, handleColumnsChange]);

    // User handlers
    const handleUpdateUserProfile = useCallback((updates: Partial<UserProfile>) => {
        setAppState(prev => ({
            ...prev,
            user: { ...prev.user, ...updates }
        }));
    }, []);

    // Save as PDF
    const handleSaveAsPDF = useCallback(() => {
        if (!activeProject || !activePersona) {
            toast.error('No journey to export');
            return;
        }

        const originalTitle = document.title;
        document.title = `${activeProject.name} - ${activePersona.name} - User Journey`;

        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.title = originalTitle;
            }, 1000);
            toast.success('Print dialog opened');
        }, 100);
    }, [activeProject, activePersona]);

    return {
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
        handleUpdateUserProfile,
        handleSaveAsPDF,
    };
};
