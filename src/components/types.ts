export type ColumnId = string;
export type TaskId = string;

export interface Task {
  id: TaskId;
  title: string;
  description?: string;
  status: ColumnId;
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  created_at: any; // Đồng bộ dùng dấu gạch dưới
}

export interface Column {
  id: ColumnId;
  title: string;
  taskIds: TaskId[]; // Thêm dòng này để khớp với lỗi báo thiếu taskIds
}

export interface KanbanData {
  tasks: Record<TaskId, Task>; // Đổi sang dạng Record để truy xuất nhanh
  columns: Record<ColumnId, Column>;
  columnOrder: ColumnId[];
}