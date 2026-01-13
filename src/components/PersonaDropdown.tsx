import { Persona } from '@/types/journey';
import { User, Target, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonaDropdownProps {
  persona: Persona;
  onUpdate: (persona: Persona) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PersonaDropdown = ({ persona, onUpdate, isOpen, onClose }: PersonaDropdownProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPersona, setEditedPersona] = useState(persona);

  const handleSave = () => {
    onUpdate(editedPersona);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditedPersona(persona);
      setIsEditing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 w-[600px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPersona.name}
                    onChange={(e) => setEditedPersona({ ...editedPersona, name: e.target.value })}
                    onKeyDown={handleKeyDown}
                    className="text-lg font-display font-semibold text-foreground bg-transparent border-b border-primary focus:outline-none w-full"
                    autoFocus
                  />
                ) : (
                  <h3
                    className="text-lg font-display font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {persona.name}
                  </h3>
                )}
                <p className="text-sm text-muted-foreground">Persona</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Description */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</p>
                  {isEditing ? (
                    <textarea
                      value={editedPersona.description}
                      onChange={(e) => setEditedPersona({ ...editedPersona, description: e.target.value })}
                      onKeyDown={handleKeyDown}
                      className="w-full text-sm text-foreground bg-muted/50 rounded-lg p-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      rows={4}
                    />
                  ) : (
                    <p
                      className="text-sm text-foreground cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors"
                      onClick={() => setIsEditing(true)}
                    >
                      {persona.description}
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
                    {persona.goals.map((goal, index) => (
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
                    {persona.painPoints.map((point, index) => (
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
                      setEditedPersona(persona);
                      setIsEditing(false);
                    }}
                    className="px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
