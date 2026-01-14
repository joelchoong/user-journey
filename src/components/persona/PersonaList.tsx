import { Persona } from '@/types/journey';
import { User, Plus, Check, Trash2, Pencil } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface PersonaListProps {
    personas: Persona[];
    activePersona: Persona | null;
    onSelectPersona: (personaId: string) => void;
    onCreatePersona: () => void;
    onDeletePersona: (personaId: string) => void;
    onUpdatePersona: (persona: Persona) => void;
    onViewDetails: () => void;
}

export const PersonaList = ({
    personas,
    activePersona,
    onSelectPersona,
    onCreatePersona,
    onDeletePersona,
    onUpdatePersona,
    onViewDetails,
}: PersonaListProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    const handleStartEdit = (persona: Persona, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(persona.id);
        setEditName(persona.name);
    };

    const handleSaveEdit = (personaId: string) => {
        if (editName.trim()) {
            const persona = personas.find(p => p.id === personaId);
            if (persona) {
                onUpdatePersona({ ...persona, name: editName.trim() });
            }
        }
        setEditingId(null);
    };

    return (
        <>
            <div className="p-2 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1">
                    Personas
                </p>
            </div>

            <div className="max-h-[300px] overflow-y-auto scrollbar-thin p-1">
                {personas.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No personas yet</p>
                ) : (
                    personas.map((persona) => (
                        <div
                            key={persona.id}
                            className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${persona.id === activePersona?.id ? 'bg-primary/10' : 'hover:bg-muted'
                                }`}
                            onClick={() => {
                                if (editingId !== persona.id) {
                                    onSelectPersona(persona.id);
                                }
                            }}
                        >
                            {persona.id === activePersona?.id && (
                                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                            {persona.id !== activePersona?.id && <div className="w-4" />}

                            {editingId === persona.id ? (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEdit(persona.id);
                                        if (e.key === 'Escape') setEditingId(null);
                                    }}
                                    onBlur={() => handleSaveEdit(persona.id)}
                                    className="flex-1 text-sm bg-transparent border-b border-primary focus:outline-none"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span className="flex-1 text-sm truncate">
                                    {persona.name}
                                </span>
                            )}

                            {editingId !== persona.id && (
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={(e) => handleStartEdit(persona, e)}
                                        className="p-1 rounded hover:bg-muted transition-all"
                                        title="Rename"
                                    >
                                        <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                    </button>
                                    {personas.length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeletePersona(persona.id);
                                            }}
                                            className="p-1 rounded hover:bg-destructive/10 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="p-2 border-t border-border space-y-1">
                {activePersona && (
                    <button
                        onClick={onViewDetails}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        <User className="w-4 h-4" />
                        View Details
                    </button>
                )}
                <button
                    onClick={onCreatePersona}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Persona
                </button>
            </div>
        </>
    );
};
