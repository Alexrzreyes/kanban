'use client';

import { useState } from 'react';
import { GripVertical, Pencil, Trash2, Calendar } from 'lucide-react';
import { Task, PRIORITY_CONFIG } from '../types/kanban';

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-sky-500 to-blue-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-teal-500 to-cyan-600',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function KanbanCard({ task, onEdit, onDelete, onDragStart }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority];

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, task.id);
    // Set a small delay so the card visually "lifts" before moving
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing animate-slide-up dark:border-white/5 dark:bg-white/[0.03] ${
        isDragging
          ? 'rotate-2 scale-105 shadow-2xl ring-2 ring-violet-500/50'
          : 'hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 dark:hover:border-white/10 dark:hover:bg-white/[0.05]'
      }`}
    >
      {/* Drag Handle + Actions */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-300 dark:text-gray-600" />
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priority.bgColor} ${priority.color}`}>
            {priority.label}
          </span>
        </div>

        {/* Actions - visible on hover */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-violet-500 dark:hover:bg-white/10 dark:hover:text-violet-400"
            title="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-rose-500 dark:hover:bg-white/10 dark:hover:text-rose-400"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {task.tags.map((tag) => (
            <span
              key={tag.name}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tag.color}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Assignee + Date */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${getAvatarColor(task.assignee)}`}>
            {getInitials(task.assignee)}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <Calendar className="h-3 w-3" />
          <span className="text-[10px]">{formatDate(task.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
