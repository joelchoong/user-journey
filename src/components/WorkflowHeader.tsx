import { Workflow } from '@/types/journey';
import { ChevronLeft, ChevronRight, MoreHorizontal, Palette } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkflowHeaderProps {
    workflow: Workflow;
    group: { start: number; end: number }; // Grid column indices
    totalColumns: number;
    onExtendLeft: () => void;
    onExtendRight: () => void;
    onRetractLeft: () => void;
    onRetractRight: () => void;
    onUpdate: (updates: Partial<Workflow>) => void;
}

export const WorkflowHeader = ({
    workflow,
    group,
    totalColumns,
    onExtendLeft,
    onExtendRight,
    onRetractLeft,
    onRetractRight,
    onUpdate,
}: WorkflowHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const canExtendLeft = group.start > 1; // Not the first column
    const canExtendRight = group.end <= totalColumns; // Not the last column (end is exclusive index, so <= total)

    // Retract is possible if there is more than 1 column in the group
    const span = group.end - group.start;
    const canRetract = span > 1;

    const colors = [
        '#E0F2FE', // Blue
        '#F0FDF4', // Green
        '#FEF2F2', // Red
        '#FFF7ED', // Orange
        '#F3F4F6', // Gray
        '#FDF2F8', // Pink
        '#FAF5FF', // Purple
    ];

    return (
        <div
            style={{
                gridColumn: `${group.start} / ${group.end}`,
                gridRow: 1,
            }}
            className="mb-2 px-1 relative group"
        >
            <div
                className="text-xs font-semibold rounded-t-lg border-t border-x border-border/50 flex items-center justify-between transition-all relative overflow-visible group/header"
                style={{
                    backgroundColor: workflow.color || '#f3f4f6',
                    color: '#1f2937',
                }}
            >
                {/* Left Controls */}
                <div className="flex items-center h-full">
                    {canExtendLeft ? (
                        <button
                            onClick={onExtendLeft}
                            className="h-full px-1.5 hover:bg-black/10 transition-colors border-r border-black/5 flex items-center justify-center"
                            title="Extend Left (Include previous column)"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <div className="w-2" /> // Spacer
                    )}
                    {canRetract && (
                        <button
                            onClick={onRetractLeft}
                            className="h-full px-1.5 hover:bg-black/10 transition-colors border-r border-black/5 flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity"
                            title="Retract Left (Exclude first column)"
                        >
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* Title */}
                <div className="flex-1 px-3 py-1.5 truncate text-center cursor-pointer hover:bg-black/5 transition-colors"
                    onClick={() => setIsEditing(true)}>
                    {isEditing ? (
                        <input
                            autoFocus
                            className="w-full bg-transparent text-center focus:outline-none border-b border-primary/50"
                            value={workflow.title}
                            onChange={(e) => onUpdate({ title: e.target.value })}
                            onBlur={() => setIsEditing(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') setIsEditing(false);
                            }}
                        />
                    ) : (
                        <span>{workflow.title}</span>
                    )}
                </div>

                {/* Right Controls */}
                <div className="flex items-center h-full">
                    {/* Color Picker Toggle */}
                    <div className="relative h-full flex items-center">
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="h-full px-1.5 hover:bg-black/10 transition-colors border-l border-black/5 flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity"
                            title="Change Color"
                        >
                            <Palette className="w-3.5 h-3.5 text-muted-foreground/70" />
                        </button>
                        <AnimatePresence>
                            {showColorPicker && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-1 p-2 bg-white rounded-lg shadow-xl border border-border z-50 flex gap-1 w-[160px] flex-wrap cursor-default"
                                >
                                    {colors.map((c) => (
                                        <button
                                            key={c}
                                            className="w-6 h-6 rounded-full border border-border/50 hover:scale-110 transition-transform shadow-sm"
                                            style={{ backgroundColor: c }}
                                            onClick={() => {
                                                onUpdate({ color: c });
                                                setShowColorPicker(false);
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {canRetract && (
                        <button
                            onClick={onRetractRight}
                            className="h-full px-1.5 hover:bg-black/10 transition-colors border-l border-black/5 flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity"
                            title="Retract Right (Exclude last column)"
                        >
                            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                    )}
                    {canExtendRight ? (
                        <button
                            onClick={onExtendRight}
                            className="h-full px-1.5 hover:bg-black/10 transition-colors border-l border-black/5 flex items-center justify-center"
                            title="Extend Right (Include next column)"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <div className="w-2" /> // Spacer
                    )}
                </div>
            </div>

            {/* Visual Connector Line */}
            <div
                className="h-1 w-full"
                style={{ backgroundColor: workflow.color || '#e5e7eb' }}
            />
        </div>
    );
};
