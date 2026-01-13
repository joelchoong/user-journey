import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PersonaPanel } from '@/components/PersonaPanel';
import { JourneyBoard } from '@/components/JourneyBoard';
import { JourneyBoard as JourneyBoardType, Persona } from '@/types/journey';
import { initialBoard } from '@/data/initialBoard';

const STORAGE_KEY = 'upstack-story-board';

const Index = () => {
  const [board, setBoard] = useState<JourneyBoardType>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialBoard;
      }
    }
    return initialBoard;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  }, [board]);

  const handlePersonaUpdate = (persona: Persona) => {
    setBoard({ ...board, persona });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <PersonaPanel persona={board.persona} onUpdate={handlePersonaUpdate} />
      <JourneyBoard board={board} onBoardChange={setBoard} />
    </div>
  );
};

export default Index;
