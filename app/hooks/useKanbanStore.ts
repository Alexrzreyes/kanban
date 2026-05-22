'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Task, ColumnId, Priority, COLUMN_CONFIG, SAMPLE_TASKS } from '../types/kanban';

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useKanbanStore() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('kanban-tasks', SAMPLE_TASKS);
  const [searchQuery, setSearchQuery] = useLocalStorage<string>('kanban-search', '');
  const [filterPriority, setFilterPriority] = useLocalStorage<Priority | 'all'>('kanban-filter', 'all');

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, [setTasks]);

  const moveTask = useCallback((taskId: string, targetColumnId: ColumnId, targetIndex?: number) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = prev[taskIndex];
      if (task.columnId === targetColumnId && targetIndex === undefined) return prev;

      // Remove task from current position
      const newTasks = prev.filter((t) => t.id !== taskId);
      const updatedTask = { ...task, columnId: targetColumnId };

      if (targetIndex !== undefined) {
        // Insert at specific position within the target column
        const columnTasks = newTasks.filter((t) => t.columnId === targetColumnId);
        const otherTasks = newTasks.filter((t) => t.columnId !== targetColumnId);
        columnTasks.splice(targetIndex, 0, updatedTask);
        return [...otherTasks, ...columnTasks];
      }

      return [...newTasks, updatedTask];
    });
  }, [setTasks]);

  // Filter and organize tasks into columns
  const columns = useMemo(() => {
    return COLUMN_CONFIG.map((col) => {
      let columnTasks = tasks.filter((task) => task.columnId === col.id);

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        columnTasks = columnTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.assignee.toLowerCase().includes(query) ||
            task.tags.some((tag) => tag.name.toLowerCase().includes(query))
        );
      }

      // Apply priority filter
      if (filterPriority !== 'all') {
        columnTasks = columnTasks.filter((task) => task.priority === filterPriority);
      }

      return {
        ...col,
        tasks: columnTasks,
      };
    });
  }, [tasks, searchQuery, filterPriority]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      done: tasks.filter((t) => t.columnId === 'done').length,
      inProgress: tasks.filter((t) => t.columnId === 'in-progress').length,
      highPriority: tasks.filter((t) => t.priority === 'high' && t.columnId !== 'done').length,
    };
  }, [tasks]);

  return {
    columns,
    tasks,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    stats,
  };
}
