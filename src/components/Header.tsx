import { Layers, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Persona } from '@/types/journey';
import { PersonaDropdown } from './PersonaDropdown';

interface HeaderProps {
  projectName: string;
  persona: Persona;
  onPersonaUpdate: (persona: Persona) => void;
}

export const Header = ({ projectName, persona, onPersonaUpdate }: HeaderProps) => {
  const [showPersona, setShowPersona] = useState(false);

  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">{projectName}</h1>
            <p className="text-xs text-muted-foreground">User Journey Mapping</p>
          </div>
        </div>

        {/* Persona Button */}
        <div className="relative">
          <button
            onClick={() => setShowPersona(!showPersona)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
              showPersona
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'border-border hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{persona.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPersona ? 'rotate-180' : ''}`} />
          </button>
          
          <PersonaDropdown
            persona={persona}
            onUpdate={onPersonaUpdate}
            isOpen={showPersona}
            onClose={() => setShowPersona(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          Auto-saved
        </span>
      </div>
    </header>
  );
};
