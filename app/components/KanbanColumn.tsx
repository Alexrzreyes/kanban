'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task, ColumnId } from '../types/kanban';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  icon: string;
  accentColor: string;
  tasks: Task[];
  onAddTask: (columnId: ColumnId) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: ColumnId) => void;
}

export function KanbanColumn({
  id,
  title,
  icon,
  accentColor,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set false if we're leaving the column entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl border transition-all duration-300 ${
        isDragOver
          ? 'border-violet-500/50 bg-violet-500/5 ring-2 ring-violet-500/20 scale-[1.01]'
          : 'border-gray-200 bg-gray-50/50 dark:border-white/5 dark:bg-white/[0.02]'
      }`}
    >
      {/* Column Header */}
      <div className={`rounded-t-2xl bg-gradient-to-r ${accentColor} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-200/70 px-1.5 text-[10px] font-bold text-gray-600 dark:bg-white/10 dark:text-gray-300">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => onAddTask(id)}
            className="rounded-lg p-1 text-gray-400 transition-all hover:bg-white/50 hover:text-violet-600 dark:hover:bg-white/10 dark:hover:text-violet-400"
            title="Add task"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 space-y-3 p-3 min-h-[120px]">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onDragStart={onDragStart}
          />
        ))}

        {tasks.length === 0 && (
          <div className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 transition-colors ${
            isDragOver
              ? 'border-violet-500/50 bg-violet-500/5'
              : 'border-gray-200 dark:border-white/5'
          }`}>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {isDragOver ? 'Drop here!' : 'No tasks yet'}
            </p>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-3 pt-0">
        <button
          onClick={() => onAddTask(id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-transparent py-2.5 text-xs font-medium text-gray-400 transition-all hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-violet-500 dark:border-white/10 dark:hover:border-violet-500/50 dark:hover:bg-violet-500/5 dark:hover:text-violet-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </button>
      </div>
    </div>
  );
}
