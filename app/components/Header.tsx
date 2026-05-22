'use client';

import { Search, Sun, Moon, SlidersHorizontal, LayoutDashboard, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useThemeContext } from './ThemeProvider';
import { Priority } from '../types/kanban';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterPriority: Priority | 'all';
  onFilterChange: (priority: Priority | 'all') => void;
  stats: {
    total: number;
    done: number;
    inProgress: number;
    highPriority: number;
  };
}

export function Header({
  searchQuery,
  onSearchChange,
  filterPriority,
  onFilterChange,
  stats,
}: HeaderProps) {
  const { theme, toggleTheme, mounted } = useThemeContext();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl dark:bg-black/20">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                DevHive <span className="text-violet-500">Kanban</span>
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="font-medium text-gray-900 dark:text-white">{stats.total}</span>
              <span>tasks</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">{stats.inProgress}</span>
              <span>active</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">{stats.done}</span>
              <span>done</span>
            </div>
            {stats.highPriority > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                <span className="font-medium text-rose-400">{stats.highPriority}</span>
                <span>urgent</span>
              </div>
            )}
          </div>

          {/* Search & Controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 w-40 sm:w-56 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:w-64 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:border-violet-500"
              />
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={filterPriority}
                onChange={(e) => onFilterChange(e.target.value as Priority | 'all')}
                className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-9 pr-8 text-sm text-gray-900 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white cursor-pointer"
              >
                <option value="all">All</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
