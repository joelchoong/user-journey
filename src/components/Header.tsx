import { Layers } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Layers className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-display font-bold text-foreground">Upstack Story</h1>
          <p className="text-xs text-muted-foreground">User Journey Mapping</p>
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
