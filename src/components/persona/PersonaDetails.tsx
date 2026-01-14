import { Persona } from '@/types/journey';
import { User, Target, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PersonaDetailsProps {
    activePersona: Persona;
    onUpdatePersona: (persona: Persona) => void;
    onBack: () => void;
}

export const PersonaDetails = ({
    activePersona,
    onUpdatePersona,
    onBack,
}: PersonaDetailsProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPersona, setEditedPersona] = useState<Persona>(activePersona);

    useEffect(() => {
        setEditedPersona(activePersona);
    }, [activePersona]);

    const handleSavePersona = () => {
        onUpdatePersona(editedPersona);
        setIsEditing(false);
    };

    return (
        <div>
            <div className="p-4 border-b border-border flex items-center gap-3">
                <button
                    onClick={onBack}
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
                            value={editedPersona.name}
                            onChange={(e) => setEditedPersona(prev => ({ ...prev, name: e.target.value }))}
                            className="text-lg font-display font-semibold text-foreground bg-transparent border-b border-primary focus:outline-none w-full"
                            autoFocus
                        />
                    ) : (
                        <h3
                            className="text-lg font-display font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                            onClick={() => setIsEditing(true)}
                        >
                            {activePersona.name}
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
                                value={editedPersona.description}
                                onChange={(e) => setEditedPersona(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full text-sm text-foreground bg-muted/50 rounded-lg p-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                rows={3}
                            />
                        ) : (
                            <p
                                className="text-sm text-foreground cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors"
                                onClick={() => setIsEditing(true)}
                            >
                                {activePersona.description}
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
                            {activePersona.goals.map((goal, index) => (
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
                            {activePersona.painPoints.map((point, index) => (
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
    );
};
