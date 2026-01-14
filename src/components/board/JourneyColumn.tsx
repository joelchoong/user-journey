import { JourneyColumn as JourneyColumnType, JourneyCard as JourneyCardType, Workflow } from '@/types/journey';
import { JourneyCard } from './JourneyCard';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColumnHeader } from './ColumnHeader';

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
  return (
    <Draggable draggableId={`column-${column.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          data-column="true"
          className={`flex-shrink-0 w-72 h-full bg-column rounded-xl column-shadow flex flex-col transition-transform ${snapshot.isDragging ? 'rotate-1 scale-105' : ''
            }`}
          style={{
            ...provided.draggableProps.style,
            maxHeight: 'calc(100vh - 140px)',
          }}
        >
          <ColumnHeader
            column={column}
            dragHandleProps={provided.dragHandleProps}
            workflows={workflows}
            onUpdateColumn={onUpdateColumn}
            onDeleteColumn={onDeleteColumn}
            onAddCard={onAddCard}
            onAddWorkflow={onAddWorkflow}
          />

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
