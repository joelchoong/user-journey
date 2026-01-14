import { Project } from '@/types/journey';
import {
    FolderOpen,
    Plus,
    ChevronLeft,
    ChevronRight,
    Check,
    Trash2,
    Pencil,
    Search,
    LayoutDashboard,
    Settings,
    LogOut
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SidebarProps {
    projects: Project[];
    activeProject: Project | null;
    onSelectProject: (projectId: string) => void;
    onCreateProject: () => void;
    onDeleteProject: (projectId: string) => void;
    onRenameProject: (projectId: string, name: string) => void;
}

export const Sidebar = ({
    projects,
    activeProject,
    onSelectProject,
    onCreateProject,
    onDeleteProject,
    onRenameProject,
}: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

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

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? '64px' : '280px' }}
            className="h-screen bg-card border-r border-border flex flex-col relative z-40 transition-all duration-300 ease-in-out print:hidden"
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-sm"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                    <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                )}
            </button>

            {/* Header */}
            <div className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
                </div>
                {!isCollapsed && (
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-display font-bold truncate"
                    >
                        Journey Map
                    </motion.h1>
                )}
            </div>

            {/* Search & Actions */}
            {!isCollapsed && (
                <div className="px-4 mb-4 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm bg-muted/50 border border-transparent focus:border-primary/30 rounded-lg focus:outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={onCreateProject}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                </div>
            )}

            {isCollapsed && (
                <div className="flex flex-col items-center gap-4 mb-4">
                    <button
                        onClick={onCreateProject}
                        className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                        title="New Project"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Project List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
                {!isCollapsed && (
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">
                        Your Projects
                    </p>
                )}

                <div className="space-y-1">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => onSelectProject(project.id)}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${project.id === activeProject?.id
                                ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <FolderOpen className={`w-4 h-4 flex-shrink-0 ${project.id === activeProject?.id ? 'text-primary' : ''
                                }`} />

                            {!isCollapsed && (
                                <div className="flex-1 min-w-0 flex items-center justify-between">
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
                                            className="flex-1 text-sm bg-transparent border-b border-primary focus:outline-none py-0.5"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span className="text-sm font-medium truncate">
                                            {project.name}
                                        </span>
                                    )}

                                    {!editingId && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-2">
                                            <button
                                                onClick={(e) => handleStartEdit(project, e)}
                                                className="p-1 rounded-md hover:bg-white/50 transition-all"
                                                title="Rename"
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                            {projects.length > 1 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteProject(project.id);
                                                    }}
                                                    className="p-1 rounded-md hover:bg-destructive/10 hover:text-destructive transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / User Info */}
            <div className="p-4 border-t border-border relative">
                <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className={`w-full flex items-center gap-3 hover:bg-muted p-2 rounded-xl transition-all ${profileMenuOpen ? 'bg-muted ring-1 ring-border' : ''
                        } ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs ring-2 ring-background flex-shrink-0">
                        JC
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium text-foreground truncate">Joel Choong</p>
                            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter font-bold">Premium Plan</p>
                        </div>
                    )}
                </button>

                <AnimatePresence>
                    {profileMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute bottom-full mb-2 z-50 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden ${isCollapsed ? 'left-4' : 'left-4 right-4'
                                    }`}
                            >
                                <div className="p-3 border-b border-border bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                                            JC
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-foreground text-sm truncate">Joel Choong</p>
                                            <p className="text-xs text-muted-foreground truncate">joel@example.com</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-1">
                                    <button
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            toast.info("Profile settings coming soon!");
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-muted-foreground" />
                                        Profile Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            toast.info("Sign out coming soon!");
                                        }}
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
        </motion.aside>
    );
};
