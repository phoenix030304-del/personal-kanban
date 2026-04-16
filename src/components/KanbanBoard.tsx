import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanData, ColumnId, Task, TaskId } from './types';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskModal } from './AddTaskModal';
import { Layout, Search, Filter, Plus, Settings, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

interface KanbanBoardProps {
  session: Session;
}

const initialBoardData: KanbanData = {
  tasks: {},
  columns: {
    'todo': { id: 'todo', title: 'To-do', taskIds: [] },
    'doing': { id: 'doing', title: 'Doing', taskIds: [] },
    'done': { id: 'done', title: 'Done', taskIds: [] },
  },
  columnOrder: ['todo', 'doing', 'done'],
};

export function KanbanBoard({ session }: KanbanBoardProps) {
  const [data, setData] = useState<KanbanData>(initialBoardData);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

 useEffect(() => {
  // 1. Lấy dữ liệu lần đầu (Giữ nguyên code cũ của bạn)
  fetchTasks();

  // 2. Thiết lập lắng nghe Realtime
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Lắng nghe tất cả: INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'tasks',
      },
      (payload) => {
        console.log('Có thay đổi dữ liệu:', payload);
        fetchTasks(); // Tự động tải lại dữ liệu khi có biến động
      }
    )
    .subscribe();

  // 3. Hủy lắng nghe khi đóng trang
  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const newTasks: Record<TaskId, Task> = {};
      const newColumns = { ...initialBoardData.columns };
      
      newColumns.todo.taskIds = [];
      newColumns.doing.taskIds = [];
      newColumns.done.taskIds = [];

      tasks?.forEach((t: any) => {
        const task: Task = {
          id: t.id,
          title: t.title || 'No Title',
          description: t.description || '',
          priority: t.priority as 'low' | 'medium' | 'high',
          created_at: new Date(t.created_at).getTime(),
          status: t.status as ColumnId,
          user_id: t.user_id,
        };
        newTasks[t.id] = task;
        if (newColumns[t.status as ColumnId]) {
          newColumns[t.status as ColumnId].taskIds.push(t.id);
        }
      });

      setData({
        ...initialBoardData,
        tasks: newTasks,
        columns: newColumns,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId as ColumnId];
    const finish = data.columns[destination.droppableId as ColumnId];

    const newData = { ...data };

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      newData.columns[start.id].taskIds = newTaskIds;
      setData(newData);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    newData.columns[start.id].taskIds = startTaskIds;
    newData.columns[finish.id].taskIds = finishTaskIds;
    setData(newData);

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: finish.id })
        .eq('id', draggableId);

      if (error) throw error;
      toast.success('Status updated');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error updating status');
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task');
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: ColumnId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
      
      toast.success('Task moved');
      fetchTasks();
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Error moving task');
    }
  };

 // Sửa định nghĩa hàm để nhận vào object thay vì chỉ mỗi title
const handleAddTask = async (taskData: any) => {
  try {
    // 1. Lấy user hiện tại
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }

    // 2. Gửi dữ liệu với giá trị đã được chuẩn hóa
    const { error } = await supabase.from('tasks').insert([
      {
        title: taskData.title || "Nhiệm vụ mới",
        description: taskData.description || "",
        priority: (taskData.priority || 'low').toLowerCase(), // Luôn ép về chữ thường
        status: 'todo',
        user_id: user.id,
        created_at: new Date().toISOString(),
      }
    ]);

    if (error) {
      console.error("Chi tiết lỗi từ Supabase:", error);
      throw error;
    }

    // 3. Cập nhật lại giao diện
    fetchTasks();
  } catch (error: any) {
    // Hiện thông báo lỗi chi tiết để biết chính xác cột nào bị lỗi
    alert("Lỗi Database: " + (error.message || "Không xác định"));
  }
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" />
      {/* Header */}
      <header className="border-bottom border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Layout className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Project Kanban</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm công việc..." 
                className="pl-9 w-64 bg-secondary/50 border-none focus-visible:ring-1"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
            <Button className="gap-2 rounded-full px-6" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Tạo mới
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="container mx-auto px-6 py-6 border-bottom border-border/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Bảng Công Việc</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Chào, {session.user.email}. Quản lý và theo dõi tiến độ dự án của bạn.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Lọc
            </Button>
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                {session.user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <main className="flex-1 w-full px-6 py-8 overflow-x-auto flex justify-center">
        {loading ? (
          <div className="flex flex-row gap-6 w-full max-w-7xl items-start">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl min-h-[70vh] items-start pb-4">
        {data.columnOrder.map((columnId: string) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId: string) => data.tasks[taskId]);

                return (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    onDeleteTask={handleDeleteTask}
                    onMoveTask={handleMoveTask}
                  />
                );
              })}
            </div>
          </DragDropContext>
        )}
      </main>

      {/* Floating Action Button */}
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-transform z-50"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTask} 
      />
    </div>
  );
}
