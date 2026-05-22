export type Priority = 'low' | 'medium' | 'high';

export type ColumnId = 'backlog' | 'in-progress' | 'review' | 'done';

export interface Tag {
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: Tag[];
  assignee: string;
  createdAt: string;
  columnId: ColumnId;
}

export interface Column {
  id: ColumnId;
  title: string;
  icon: string;
  tasks: Task[];
}

export interface KanbanState {
  columns: Column[];
  searchQuery: string;
  filterPriority: Priority | 'all';
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string }> = {
  high: { label: 'High', color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
  medium: { label: 'Medium', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  low: { label: 'Low', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
};

export const COLUMN_CONFIG: { id: ColumnId; title: string; icon: string; accentColor: string }[] = [
  { id: 'backlog', title: 'Backlog', icon: '📋', accentColor: 'from-slate-500/20 to-slate-600/10' },
  { id: 'in-progress', title: 'In Progress', icon: '🔨', accentColor: 'from-blue-500/20 to-blue-600/10' },
  { id: 'review', title: 'Review', icon: '👀', accentColor: 'from-violet-500/20 to-violet-600/10' },
  { id: 'done', title: 'Done', icon: '✅', accentColor: 'from-emerald-500/20 to-emerald-600/10' },
];

export const AVAILABLE_TAGS: Tag[] = [
  { name: 'Frontend', color: 'bg-sky-500/20 text-sky-300' },
  { name: 'Backend', color: 'bg-orange-500/20 text-orange-300' },
  { name: 'Bug', color: 'bg-red-500/20 text-red-300' },
  { name: 'Feature', color: 'bg-green-500/20 text-green-300' },
  { name: 'Design', color: 'bg-pink-500/20 text-pink-300' },
  { name: 'DevOps', color: 'bg-yellow-500/20 text-yellow-300' },
  { name: 'Docs', color: 'bg-indigo-500/20 text-indigo-300' },
];

export const SAMPLE_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design system tokens',
    description: 'Define color palette, typography scale, spacing, and border radius tokens for the design system.',
    priority: 'high',
    tags: [AVAILABLE_TAGS[0], AVAILABLE_TAGS[4]],
    assignee: 'Alex',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    columnId: 'backlog',
  },
  {
    id: 'task-2',
    title: 'API authentication middleware',
    description: 'Implement JWT-based authentication middleware with refresh token rotation.',
    priority: 'high',
    tags: [AVAILABLE_TAGS[1], AVAILABLE_TAGS[3]],
    assignee: 'Maria',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    columnId: 'in-progress',
  },
  {
    id: 'task-3',
    title: 'Fix login redirect loop',
    description: 'Users are getting stuck in a redirect loop after successful authentication on Safari.',
    priority: 'high',
    tags: [AVAILABLE_TAGS[0], AVAILABLE_TAGS[2]],
    assignee: 'Carlos',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    columnId: 'in-progress',
  },
  {
    id: 'task-4',
    title: 'Dashboard responsive layout',
    description: 'Make the analytics dashboard fully responsive for mobile and tablet viewports.',
    priority: 'medium',
    tags: [AVAILABLE_TAGS[0], AVAILABLE_TAGS[4]],
    assignee: 'Alex',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    columnId: 'backlog',
  },
  {
    id: 'task-5',
    title: 'CI/CD pipeline setup',
    description: 'Configure GitLab CI pipeline with build, test, lint stages and deploy to Pages.',
    priority: 'medium',
    tags: [AVAILABLE_TAGS[5]],
    assignee: 'Maria',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    columnId: 'review',
  },
  {
    id: 'task-6',
    title: 'Update README documentation',
    description: 'Add setup instructions, architecture overview, and contribution guidelines to the README.',
    priority: 'low',
    tags: [AVAILABLE_TAGS[6]],
    assignee: 'Carlos',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    columnId: 'done',
  },
  {
    id: 'task-7',
    title: 'Add unit tests for auth',
    description: 'Write comprehensive unit tests for the authentication service with edge cases.',
    priority: 'medium',
    tags: [AVAILABLE_TAGS[1], AVAILABLE_TAGS[3]],
    assignee: 'Alex',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    columnId: 'review',
  },
];
