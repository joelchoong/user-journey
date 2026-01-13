import { JourneyColumn as JourneyColumnType, JourneyCard, Workflow } from '@/types/journey';
import { JourneyColumn } from './JourneyColumn';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Plus, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface JourneyBoardProps {
  columns: JourneyColumnType[];
  workflows?: Workflow[];
  onColumnsChange: (columns: JourneyColumnType[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const JourneyBoard = ({ columns, workflows, onColumnsChange }: JourneyBoardProps) => {
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Reordering columns
    if (type === 'column') {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      onColumnsChange(newColumns);
      return;
    }

    // Moving cards
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find((col) => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    if (sourceColumn.id === destColumn.id) {
      // Moving within the same column
      const newCards = Array.from(sourceColumn.cards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) =>
        col.id === sourceColumn.id ? { ...col, cards: newCards } : col
      );
      onColumnsChange(newColumns);
    } else {
      // Moving between columns
      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [removed] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) => {
        if (col.id === sourceColumn.id) return { ...col, cards: sourceCards };
        if (col.id === destColumn.id) return { ...col, cards: destCards };
        return col;
      });
      onColumnsChange(newColumns);
    }
  };

  const addColumn = () => {
    const newColumn: JourneyColumnType = {
      id: generateId(),
      title: 'New Step',
      cards: [],
    };
    onColumnsChange([...columns, newColumn]);
  };

  const updateColumn = (columnId: string, updatedColumn: JourneyColumnType) => {
    const newColumns = columns.map((col) =>
      col.id === columnId ? updatedColumn : col
    );
    onColumnsChange(newColumns);
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = columns.filter((col) => col.id !== columnId);
    onColumnsChange(newColumns);
  };

  const addCard = (columnId: string) => {
    const newCard: JourneyCard = {
      id: generateId(),
      title: 'New action',
      tags: ['user'],
    };
    const newColumns = columns.map((col) =>
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
    );
    onColumnsChange(newColumns);
  };

  const updateCard = (columnId: string, cardId: string, updatedCard: JourneyCard) => {
    const newColumns = columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.map((c) => (c.id === cardId ? updatedCard : c)) }
        : col
    );
    onColumnsChange(newColumns);
  };

  const deleteCard = (columnId: string, cardId: string) => {
    const newColumns = columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
        : col
    );
    onColumnsChange(newColumns);
  };

  const workflowGroups = useMemo(() => {
    const groups: { workflowId?: string; start: number; end: number }[] = [];
    let currentGroup: { workflowId?: string; start: number; end: number } | null = null;

    columns.forEach((col, index) => {
      // Grid lines are 1-based. Column 0 is at grid line 1.
      if (currentGroup && currentGroup.workflowId === col.workflowId) {
        currentGroup.end = index + 2;
      } else {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = {
          workflowId: col.workflowId,
          start: index + 1,
          end: index + 2
        };
      }
    });
    if (currentGroup) groups.push(currentGroup);
    return groups;
  }, [columns]);

  if (columns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">No journey steps yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start building your user journey by adding steps</p>
          <motion.button
            onClick={addColumn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Step
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin">
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-rows-[auto_1fr] gap-x-4 gap-y-0 p-6 min-h-full"
              style={{
                gridTemplateColumns: `repeat(${columns.length}, 18rem) 18rem`,
                minWidth: 'fit-content'
              }}
            >
              {/* Workflow Headers */}
              {workflowGroups.map((group, i) => {
                const workflow = workflows?.find(w => w.id === group.workflowId);
                if (!workflow && !group.workflowId) return null;

                return (
                  <div
                    key={`wf-group-${i}`}
                    style={{ gridColumn: `${group.start} / ${group.end}`, gridRow: 1 }}
                    className="mb-2 px-1"
                  >
                    <div
                      className="text-xs font-semibold px-3 py-1.5 rounded-t-lg border-t border-x border-border/50 truncate flex items-center gap-2"
                      style={{ backgroundColor: workflow?.color || '#f3f4f6', color: '#1f2937' }}
                    >
                      {workflow?.title || 'Unassigned Steps'}
                    </div>
                    <div className="h-1 w-full" style={{ backgroundColor: workflow?.color || '#e5e7eb' }}></div>
                  </div>
                );
              })}

              {columns.map((column, index) => (
                <div
                  key={column.id}
                  style={{ gridColumn: index + 1, gridRow: 2 }}
                  className="h-full"
                >
                  <JourneyColumn
                    column={column}
                    index={index}
                    workflows={workflows}
                    onUpdateColumn={(updated) => updateColumn(column.id, updated)}
                    onDeleteColumn={() => deleteColumn(column.id)}
                    onAddCard={() => addCard(column.id)}
                    onUpdateCard={(cardId, card) => updateCard(column.id, cardId, card)}
                    onDeleteCard={(cardId) => deleteCard(column.id, cardId)}
                  />
                </div>
              ))}
              {provided.placeholder}

              {/* Add Column Button */}
              <div style={{ gridColumn: columns.length + 1, gridRow: 2 }}>
                <motion.button
                  onClick={addColumn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-72 h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Step</span>
                </motion.button>
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
