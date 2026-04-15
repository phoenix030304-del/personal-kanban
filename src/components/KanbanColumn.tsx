import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column, Task, ColumnId } from './types';
import { KanbanTask } from './KanbanTask';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: ColumnId) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks, onDeleteTask, onMoveTask }) => {
  return (
    <div className="flex flex-col w-80 bg-secondary/30 rounded-xl border border-border/50 h-full max-h-[calc(100vh-12rem)]">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm text-foreground uppercase tracking-wider">
            {column.title}
          </h2>
          <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <ScrollArea className="flex-1 px-3">
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[150px] pb-4 transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <KanbanTask 
                  key={task.id} 
                  task={task} 
                  index={index} 
                  onDelete={onDeleteTask}
                  onMove={onMoveTask}
                />
              ))}
              {provided.placeholder}
            </div>
          </ScrollArea>
        )}
      </Droppable>
    </div>
  );
}
