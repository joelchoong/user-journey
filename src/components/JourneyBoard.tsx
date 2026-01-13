import { JourneyColumn as JourneyColumnType, JourneyCard, JourneyBoard as JourneyBoardType } from '@/types/journey';
import { JourneyColumn } from './JourneyColumn';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyBoardProps {
  board: JourneyBoardType;
  onBoardChange: (board: JourneyBoardType) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const JourneyBoard = ({ board, onBoardChange }: JourneyBoardProps) => {
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Reordering columns
    if (type === 'column') {
      const newColumns = Array.from(board.columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      onBoardChange({ ...board, columns: newColumns });
      return;
    }

    // Moving cards
    const sourceColumn = board.columns.find((col) => col.id === source.droppableId);
    const destColumn = board.columns.find((col) => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    if (sourceColumn.id === destColumn.id) {
      // Moving within the same column
      const newCards = Array.from(sourceColumn.cards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      const newColumns = board.columns.map((col) =>
        col.id === sourceColumn.id ? { ...col, cards: newCards } : col
      );
      onBoardChange({ ...board, columns: newColumns });
    } else {
      // Moving between columns
      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [removed] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, removed);

      const newColumns = board.columns.map((col) => {
        if (col.id === sourceColumn.id) return { ...col, cards: sourceCards };
        if (col.id === destColumn.id) return { ...col, cards: destCards };
        return col;
      });
      onBoardChange({ ...board, columns: newColumns });
    }
  };

  const addColumn = () => {
    const newColumn: JourneyColumnType = {
      id: generateId(),
      title: 'New Step',
      cards: [],
    };
    onBoardChange({ ...board, columns: [...board.columns, newColumn] });
  };

  const updateColumn = (columnId: string, updatedColumn: JourneyColumnType) => {
    const newColumns = board.columns.map((col) =>
      col.id === columnId ? updatedColumn : col
    );
    onBoardChange({ ...board, columns: newColumns });
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = board.columns.filter((col) => col.id !== columnId);
    onBoardChange({ ...board, columns: newColumns });
  };

  const addCard = (columnId: string) => {
    const newCard: JourneyCard = {
      id: generateId(),
      title: 'New action',
      tags: ['user'],
    };
    const newColumns = board.columns.map((col) =>
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
    );
    onBoardChange({ ...board, columns: newColumns });
  };

  const updateCard = (columnId: string, cardId: string, updatedCard: JourneyCard) => {
    const newColumns = board.columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.map((c) => (c.id === cardId ? updatedCard : c)) }
        : col
    );
    onBoardChange({ ...board, columns: newColumns });
  };

  const deleteCard = (columnId: string, cardId: string) => {
    const newColumns = board.columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
        : col
    );
    onBoardChange({ ...board, columns: newColumns });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin">
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-4 p-6 min-h-full"
              style={{ minWidth: 'fit-content' }}
            >
              {board.columns.map((column, index) => (
                <JourneyColumn
                  key={column.id}
                  column={column}
                  index={index}
                  onUpdateColumn={(updated) => updateColumn(column.id, updated)}
                  onDeleteColumn={() => deleteColumn(column.id)}
                  onAddCard={() => addCard(column.id)}
                  onUpdateCard={(cardId, card) => updateCard(column.id, cardId, card)}
                  onDeleteCard={(cardId) => deleteCard(column.id, cardId)}
                />
              ))}
              {provided.placeholder}

              {/* Add Column Button */}
              <motion.button
                onClick={addColumn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 w-72 h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Step</span>
              </motion.button>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
