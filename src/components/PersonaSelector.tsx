import { Persona } from '@/types/journey';
import { User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonaList } from './persona/PersonaList';
import { PersonaDetails } from './persona/PersonaDetails';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowDetails(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowDetails(false);
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${isOpen
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
                <PersonaList
                  personas={personas}
                  activePersona={activePersona}
                  onSelectPersona={onSelectPersona}
                  onCreatePersona={onCreatePersona}
                  onDeletePersona={onDeletePersona}
                  onUpdatePersona={onUpdatePersona}
                  onViewDetails={() => setShowDetails(true)}
                />
              ) : (
                activePersona && (
                  <PersonaDetails
                    activePersona={activePersona}
                    onUpdatePersona={onUpdatePersona}
                    onBack={() => setShowDetails(false)}
                  />
                )
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
