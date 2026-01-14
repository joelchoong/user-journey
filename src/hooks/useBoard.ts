import { useMemo, useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { JourneyColumn, JourneyCard, Workflow } from '@/types/journey';

interface useBoardProps {
    columns: JourneyColumn[];
    workflows?: Workflow[];
    onColumnsChange: (columns: JourneyColumn[]) => void;
}

export const useBoard = ({ columns, workflows, onColumnsChange }: useBoardProps) => {
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleDragEnd = useCallback((result: DropResult) => {
        const { source, destination, type } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        if (type === 'column') {
            const newColumns = Array.from(columns);
            const [removed] = newColumns.splice(source.index, 1);
            newColumns.splice(destination.index, 0, removed);
            onColumnsChange(newColumns);
            return;
        }

        const sourceColumn = columns.find((col) => col.id === source.droppableId);
        const destColumn = columns.find((col) => col.id === destination.droppableId);

        if (!sourceColumn || !destColumn) return;

        if (sourceColumn.id === destColumn.id) {
            const newCards = Array.from(sourceColumn.cards);
            const [removed] = newCards.splice(source.index, 1);
            newCards.splice(destination.index, 0, removed);

            const newColumns = columns.map((col) =>
                col.id === sourceColumn.id ? { ...col, cards: newCards } : col
            );
            onColumnsChange(newColumns);
        } else {
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
    }, [columns, onColumnsChange]);

    const addColumn = useCallback(() => {
        const newColumn: JourneyColumn = {
            id: generateId(),
            title: 'New Step',
            cards: [],
        };
        onColumnsChange([...columns, newColumn]);
    }, [columns, onColumnsChange]);

    const updateColumn = useCallback((columnId: string, updatedColumn: JourneyColumn) => {
        const newColumns = columns.map((col) =>
            col.id === columnId ? updatedColumn : col
        );
        onColumnsChange(newColumns);
    }, [columns, onColumnsChange]);

    const deleteColumn = useCallback((columnId: string) => {
        const newColumns = columns.filter((col) => col.id !== columnId);
        onColumnsChange(newColumns);
    }, [columns, onColumnsChange]);

    const addCard = useCallback((columnId: string) => {
        const newCard: JourneyCard = {
            id: generateId(),
            title: 'New action',
            tags: ['user'],
        };
        const newColumns = columns.map((col) =>
            col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
        );
        onColumnsChange(newColumns);
    }, [columns, onColumnsChange]);

    const updateCard = useCallback((columnId: string, cardId: string, updatedCard: JourneyCard) => {
        const newColumns = columns.map((col) =>
            col.id === columnId
                ? { ...col, cards: col.cards.map((c) => (c.id === cardId ? updatedCard : c)) }
                : col
        );
        onColumnsChange(newColumns);
    }, [columns, onColumnsChange]);

    const deleteCard = useCallback((columnId: string, cardId: string) => {
        const newColumns = columns.map((col) =>
            col.id === columnId
                ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
                : col
        );
        onColumnsChange(newColumns);
    }, [columns, onColumnsChange]);

    const handleSetColumnWorkflow = useCallback((columnIndex: number, workflowId: string | undefined) => {
        if (columnIndex < 0 || columnIndex >= columns.length) return;
        const newColumns = [...columns];
        newColumns[columnIndex] = { ...newColumns[columnIndex], workflowId };
        onColumnsChange(newColumns);
    }, [columns, onColumnsChange]);

    const workflowGroups = useMemo(() => {
        const groups: { workflowId?: string; start: number; end: number }[] = [];
        let currentGroup: { workflowId?: string; start: number; end: number } | null = null;

        columns.forEach((col, index) => {
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

    return {
        workflowGroups,
        handleDragEnd,
        addColumn,
        updateColumn,
        deleteColumn,
        addCard,
        updateCard,
        deleteCard,
        handleSetColumnWorkflow,
    };
};
