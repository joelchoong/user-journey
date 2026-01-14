import { JourneyColumn as JourneyColumnType, JourneyCard as JourneyCardType, Workflow } from '@/types/journey';
import { JourneyCard } from './JourneyCard';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JourneyColumnProps {
  column: JourneyColumnType;
  index: number;
  workflows?: Workflow[];
  onUpdateColumn: (column: JourneyColumnType) => void;
  onDeleteColumn: () => void;
  onAddCard: () => void;
  onUpdateCard: (cardId: string, card: JourneyCardType) => void;
  onDeleteCard: (cardId: string) => void;
  onAddWorkflow?: (title: string, color: string) => string;
}

export const JourneyColumn = ({
  column,
  index,
  workflows,
  onUpdateColumn,
  onDeleteColumn,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onAddWorkflow,
}: JourneyColumnProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [isAddingWorkflow, setIsAddingWorkflow] = useState(false);
  const [newWorkflowTitle, setNewWorkflowTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const workflowInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
    if (isAddingWorkflow && workflowInputRef.current) {
      workflowInputRef.current.focus();
    }
  }, [isEditingTitle, isAddingWorkflow]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateColumn({ ...column, title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    }
    if (e.key === 'Escape') {
      setEditedTitle(column.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <Draggable draggableId={`column-${column.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex-shrink-0 w-72 h-full bg-column rounded-xl column-shadow flex flex-col transition-transform ${snapshot.isDragging ? 'rotate-1 scale-105' : ''
            }`}
          style={{
            ...provided.draggableProps.style,
            maxHeight: 'calc(100vh - 140px)',
          }}
        >
          {/* Column Header */}
          <div className="p-3 flex items-center gap-2">
            <div
              {...provided.dragHandleProps}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveTitle}
                  className="w-full text-sm font-semibold text-column-header bg-transparent border-b border-primary focus:outline-none font-display"
                />
              ) : (
                <h3
                  onClick={() => setIsEditingTitle(true)}
                  className="text-sm font-semibold text-column-header cursor-pointer hover:text-primary transition-colors truncate font-display"
                >
                  {column.title}
                </h3>
              )}
            </div>

            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {column.cards.length}
            </span>

            {/* Add Card Button */}
            <button
              onClick={onAddCard}
              className="p-1.5 rounded hover:bg-primary/10 hover:text-primary transition-colors"
              title="Add card"
            >
              <Plus className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </button>

            {/* Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1 z-10 bg-popover border border-border rounded-lg shadow-lg p-1 min-w-[160px]"
                  >
                    {/* Workflow Selection */}
                    <div className="px-2 py-1.5 border-b border-border/50 mb-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">Workflow</p>
                      <select
                        className="w-full text-xs bg-muted/50 border-input rounded h-7 px-1"
                        value={column.workflowId || ''}
                        onChange={(e) => onUpdateColumn({ ...column, workflowId: e.target.value || undefined })}
                      >
                        <option value="">No Workflow</option>
                        {workflows?.map((wf) => (
                          <option key={wf.id} value={wf.id}>
                            {wf.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Create New Workflow */}
                    <div className="px-2 py-1.5 border-b border-border/50 mb-1">
                      {isAddingWorkflow ? (
                        <div className="flex gap-1">
                          <input
                            ref={workflowInputRef}
                            type="text"
                            placeholder="Workflow name..."
                            className="flex-1 text-xs bg-muted/50 border-input rounded h-7 px-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            value={newWorkflowTitle}
                            onChange={(e) => setNewWorkflowTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newWorkflowTitle.trim() && onAddWorkflow) {
                                const newId = onAddWorkflow(newWorkflowTitle.trim(), '#F3F4F6');
                                onUpdateColumn({ ...column, workflowId: newId });
                                setIsAddingWorkflow(false);
                                setNewWorkflowTitle('');
                                setShowMenu(false);
                              }
                              if (e.key === 'Escape') {
                                setIsAddingWorkflow(false);
                                setNewWorkflowTitle('');
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsAddingWorkflow(true)}
                          className="w-full text-left text-xs font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Create New Workflow
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onDeleteColumn();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Column
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Cards Container - Scrollable */}
          <Droppable droppableId={column.id} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 px-2 pb-2 overflow-y-auto scrollbar-thin transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''
                  }`}
                style={{ minHeight: 60 }}
              >
                <AnimatePresence>
                  {column.cards.map((card, cardIndex) => (
                    <JourneyCard
                      key={card.id}
                      card={card}
                      index={cardIndex}
                      onUpdate={(updatedCard) => onUpdateCard(card.id, updatedCard)}
                      onDelete={() => onDeleteCard(card.id)}
                    />
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
