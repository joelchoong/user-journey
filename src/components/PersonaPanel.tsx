import { Persona } from '@/types/journey';
import { User, Target, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonaPanelProps {
  persona: Persona;
  onUpdate: (persona: Persona) => void;
}

export const PersonaPanel = ({ persona, onUpdate }: PersonaPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
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
    <div className="bg-card border-b border-border">
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPersona.name}
                  onChange={(e) => setEditedPersona({ ...editedPersona, name: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="text-lg font-display font-semibold text-foreground bg-transparent border-b border-primary focus:outline-none"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-lg font-display font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {persona.name}
                </h2>
              )}
              <p className="text-sm text-muted-foreground">Persona</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Description */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  {isEditing ? (
                    <textarea
                      value={editedPersona.description}
                      onChange={(e) => setEditedPersona({ ...editedPersona, description: e.target.value })}
                      onKeyDown={handleKeyDown}
                      className="w-full text-sm text-foreground bg-muted/50 rounded-lg p-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      rows={3}
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
                    <Target className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Goals</p>
                  </div>
                  <ul className="space-y-1">
                    {persona.goals.map((goal, index) => (
                      <li key={index} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pain Points */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-accent" />
                    <p className="text-sm font-medium text-muted-foreground">Pain Points</p>
                  </div>
                  <ul className="space-y-1">
                    {persona.painPoints.map((point, index) => (
                      <li key={index} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
