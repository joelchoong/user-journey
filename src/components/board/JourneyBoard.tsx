import { JourneyColumn as JourneyColumnType, Workflow } from '@/types/journey';
import { JourneyColumn } from './JourneyColumn';
import { WorkflowHeader } from './WorkflowHeader';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBoard } from '@/hooks/useBoard';

interface JourneyBoardProps {
  columns: JourneyColumnType[];
  workflows?: Workflow[];
  onColumnsChange: (columns: JourneyColumnType[]) => void;
  onUpdateWorkflow?: (workflowId: string, updates: Partial<Workflow>) => void;
  onAddWorkflow?: (title: string, color: string) => string;
}

export const JourneyBoard = ({ columns, workflows, onColumnsChange, onUpdateWorkflow, onAddWorkflow }: JourneyBoardProps) => {
  const {
    workflowGroups,
    handleDragEnd,
    addColumn,
    updateColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
    handleSetColumnWorkflow,
  } = useBoard({ columns, workflows, onColumnsChange });

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
                  <WorkflowHeader
                    key={`wf-group-${i}`}
                    workflow={workflow}
                    group={group}
                    totalColumns={columns.length}
                    onExtendLeft={() => handleSetColumnWorkflow(group.start - 2, group.workflowId)}
                    onExtendRight={() => handleSetColumnWorkflow(group.end - 1, group.workflowId)}
                    onRetractLeft={() => handleSetColumnWorkflow(group.start - 1, undefined)}
                    onRetractRight={() => handleSetColumnWorkflow(group.end - 2, undefined)}
                    onUpdate={(updates) => onUpdateWorkflow?.(workflow.id, updates)}
                  />
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
                    onAddWorkflow={onAddWorkflow}
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
