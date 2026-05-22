'use client';

import { useState, useCallback } from 'react';
import { useKanbanStore } from '../hooks/useKanbanStore';
import { Header } from './Header';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { ConfirmDialog } from './ConfirmDialog';
import { Task, ColumnId } from '../types/kanban';

export function KanbanBoard() {
  const {
    columns,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    stats,
  } = useKanbanStore();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState<ColumnId>('backlog');

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId: string; taskTitle: string }>({
    isOpen: false,
    taskId: '',
    taskTitle: '',
  });

  // Drag state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Handlers
  const handleAddTask = useCallback((columnId: ColumnId) => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((taskId: string) => {
    const task = columns.flatMap((c) => c.tasks).find((t) => t.id === taskId);
    setDeleteConfirm({
      isOpen: true,
      taskId,
      taskTitle: task?.title || '',
    });
  }, [columns]);

  const handleDeleteConfirm = useCallback(() => {
    deleteTask(deleteConfirm.taskId);
    setDeleteConfirm({ isOpen: false, taskId: '', taskTitle: '' });
  }, [deleteTask, deleteConfirm.taskId]);

  const handleSaveTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      if (editingTask) {
        updateTask(editingTask.id, taskData);
      } else {
        addTask(taskData);
      }
    },
    [editingTask, updateTask, addTask]
  );

  // Drag & Drop Handlers
  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColumnId: ColumnId) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      if (taskId) {
        moveTask(taskId, targetColumnId);
      }
      setDraggedTaskId(null);
    },
    [moveTask]
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterPriority={filterPriority}
        onFilterChange={setFilterPriority}
        stats={stats}
      />

      {/* Board */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid h-full max-w-[1600px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 auto-rows-min lg:auto-rows-fr">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              icon={column.icon}
              accentColor={column.accentColor}
              tasks={column.tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteRequest}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        defaultColumnId={defaultColumnId}
        onSave={handleSaveTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteConfirm.taskTitle}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, taskId: '', taskTitle: '' })}
      />
    </div>
  );
}
