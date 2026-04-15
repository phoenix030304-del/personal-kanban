import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task, ColumnId } from './types';
import { Calendar, MoreVertical, Trash2, ArrowRightLeft } from 'lucide-react';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface KanbanTaskProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onMove: (id: string, newStatus: ColumnId) => void;
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export const KanbanTask: React.FC<KanbanTaskProps> = ({ task, index, onDelete, onMove }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className={`
              group relative border-none shadow-sm transition-all duration-200
              ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/20 scale-[1.02]' : 'hover:shadow-md'}
            `}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className={`${priorityColors[task.priority]} border-none text-[10px] font-semibold uppercase tracking-wider`}>
                    {task.priority}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                       className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-secondary">
                        <MoreVertical className="h-4 w-4" />
                      
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Di chuyển đến</div>
                      <DropdownMenuItem onClick={() => onMove(task.id, 'todo')} className="gap-2">
                        <ArrowRightLeft className="h-4 w-4" /> To-do
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMove(task.id, 'doing')} className="gap-2">
                        <ArrowRightLeft className="h-4 w-4" /> Doing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMove(task.id, 'done')} className="gap-2">
                        <ArrowRightLeft className="h-4 w-4" /> Done
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(task.id)} 
                        className="text-destructive focus:text-destructive gap-2"
                      >
                        <Trash2 className="h-4 w-4" /> Xóa nhiệm vụ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <h3 className="text-sm font-bold text-foreground leading-tight mb-1">
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
