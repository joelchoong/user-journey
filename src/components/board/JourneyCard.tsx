import { JourneyCard as JourneyCardType, CardTag } from '@/types/journey';
import { TagBadge } from './TagBadge';
import { Draggable } from '@hello-pangea/dnd';
import { useState, useRef, useEffect } from 'react';
import { GripVertical, X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface JourneyCardProps {
  card: JourneyCardType;
  index: number;
  onUpdate: (card: JourneyCardType) => void;
  onDelete: () => void;
}

const roleTags: CardTag[] = ['user', 'system', 'admin', 'edge'];
const releaseTags: CardTag[] = ['mvp', 'v1', 'v2', 'out-of-scope'];

export const JourneyCard = ({ card, index, onUpdate, onDelete }: JourneyCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);


  const handleSave = () => {
    if (editedTitle.trim()) {
      onUpdate({
        ...card,
        title: editedTitle.trim(),
        description: editedDescription.trim() || undefined,
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditedTitle(card.title);
      setEditedDescription(card.description || '');
      setIsEditing(false);
    }
  };

  const toggleTag = (tag: CardTag) => {
    const newTags = card.tags.includes(tag)
      ? card.tags.filter((t) => t !== tag)
      : [...card.tags, tag];
    onUpdate({ ...card, tags: newTags });
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`group bg-card rounded-lg border border-border p-3 mb-2 transition-all duration-200 ${snapshot.isDragging ? 'card-shadow-hover rotate-2' : 'card-shadow hover:card-shadow-hover'
            }`}
        >
          <div className="flex items-start gap-2">
            <div
              {...provided.dragHandleProps}
              className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full text-sm font-medium text-foreground bg-transparent border-b border-primary focus:outline-none"
                    placeholder="Card title..."
                  />
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full text-xs text-muted-foreground bg-muted/50 rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
                    placeholder="Optional description..."
                    rows={2}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setEditedTitle(card.title);
                        setEditedDescription(card.description || '');
                        setIsEditing(false);
                      }}
                      className="px-2 py-1 text-xs text-muted-foreground hover:bg-muted rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={() => setIsEditing(true)} className="cursor-pointer">
                  <p className="text-sm font-medium text-foreground leading-snug">{card.title}</p>
                  {card.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.description}</p>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {card.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Plus className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">Role</p>
                        <div className="space-y-0.5">
                          {roleTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center justify-between ${card.tags.includes(tag) ? 'bg-muted/50' : ''
                                }`}
                            >
                              <TagBadge tag={tag} />
                              {card.tags.includes(tag) && <span className="text-primary text-[10px]">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">Release</p>
                        <div className="space-y-0.5">
                          {releaseTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center justify-between ${card.tags.includes(tag) ? 'bg-muted/50' : ''
                                }`}
                            >
                              <TagBadge tag={tag} />
                              {card.tags.includes(tag) && <span className="text-primary text-[10px]">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <button
              onClick={onDelete}
              className="p-1 rounded hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
};
