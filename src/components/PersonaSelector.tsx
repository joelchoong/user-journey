import { Persona } from '@/types/journey';
import { User, Plus, ChevronDown, Check, Trash2, Target, AlertTriangle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonaSelectorProps {
  personas: Persona[];
  activePersona: Persona | null;
  onSelectPersona: (personaId: string) => void;
  onCreatePersona: () => void;
  onDeletePersona: (personaId: string) => void;
  onUpdatePersona: (persona: Persona) => void;
}

export const PersonaSelector = ({
  personas,
  activePersona,
  onSelectPersona,
  onCreatePersona,
  onDeletePersona,
  onUpdatePersona,
}: PersonaSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPersona, setEditedPersona] = useState<Persona | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowDetails(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activePersona) {
      setEditedPersona(activePersona);
    }
  }, [activePersona]);

  const handleSavePersona = () => {
    if (editedPersona) {
      onUpdatePersona(editedPersona);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowDetails(false);
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
          isOpen
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'border-border hover:bg-muted text-muted-foreground hover:text-foreground'
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium max-w-[120px] truncate">
          {activePersona?.name || 'Add Persona'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setShowDetails(false); }} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
              style={{ width: showDetails ? '500px' : '240px' }}
            >
              {!showDetails ? (
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
                          className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                            persona.id === activePersona?.id ? 'bg-primary/10' : 'hover:bg-muted'
                          }`}
                          onClick={() => {
                            onSelectPersona(persona.id);
                          }}
                        >
                          {persona.id === activePersona?.id && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                          {persona.id !== activePersona?.id && <div className="w-4" />}

                          <span className="flex-1 text-sm truncate">{persona.name}</span>

                          {personas.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeletePersona(persona.id);
                              }}
                              className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-border space-y-1">
                    {activePersona && (
                      <button
                        onClick={() => setShowDetails(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        View Details
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onCreatePersona();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      New Persona
                    </button>
                  </div>
                </>
              ) : (
                /* Persona Details View */
                <div>
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ←
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedPersona?.name || ''}
                          onChange={(e) => setEditedPersona(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="text-lg font-display font-semibold text-foreground bg-transparent border-b border-primary focus:outline-none w-full"
                          autoFocus
                        />
                      ) : (
                        <h3
                          className="text-lg font-display font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                          onClick={() => setIsEditing(true)}
                        >
                          {activePersona?.name}
                        </h3>
                      )}
                      <p className="text-sm text-muted-foreground">Persona</p>
                    </div>
                  </div>

                  <div className="p-4 max-h-[350px] overflow-y-auto scrollbar-thin">
                    <div className="space-y-4">
                      {/* Description */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</p>
                        {isEditing ? (
                          <textarea
                            value={editedPersona?.description || ''}
                            onChange={(e) => setEditedPersona(prev => prev ? { ...prev, description: e.target.value } : null)}
                            className="w-full text-sm text-foreground bg-muted/50 rounded-lg p-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            rows={3}
                          />
                        ) : (
                          <p
                            className="text-sm text-foreground cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors"
                            onClick={() => setIsEditing(true)}
                          >
                            {activePersona?.description}
                          </p>
                        )}
                      </div>

                      {/* Goals */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-primary" />
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Goals</p>
                        </div>
                        <ul className="space-y-1.5">
                          {activePersona?.goals.map((goal, index) => (
                            <li key={index} className="text-sm text-foreground flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pain Points */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-accent" />
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pain Points</p>
                        </div>
                        <ul className="space-y-1.5">
                          {activePersona?.painPoints.map((point, index) => (
                            <li key={index} className="text-sm text-foreground flex items-start gap-2">
                              <span className="text-accent mt-0.5">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-4 flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditedPersona(activePersona);
                            setIsEditing(false);
                          }}
                          className="px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSavePersona}
                          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
