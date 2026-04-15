export type TaskId = string;
export type ColumnId = 'todo' | 'doing' | 'done';

export interface Task {
  id: TaskId;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface Column {
  id: ColumnId;
  title: string;
  taskIds: TaskId[];
}

export interface KanbanData {
  tasks: Record<TaskId, Task>;
  columns: Record<ColumnId, Column>;
  columnOrder: ColumnId[];
}
