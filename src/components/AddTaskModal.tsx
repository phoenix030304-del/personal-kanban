import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: { title: string; description: string; priority: 'low' | 'medium' | 'high' }) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, priority });
    setTitle('');
    setDescription('');
    setPriority('medium');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm nhiệm vụ mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Tiêu đề</Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề nhiệm vụ..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl bg-secondary/30 border-none focus-visible:ring-1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả chi tiết..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl bg-secondary/30 border-none focus-visible:ring-1 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-semibold">Mức độ ưu tiên</Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger className="rounded-xl bg-secondary/30 border-none focus-visible:ring-1">
                <SelectValue placeholder="Chọn mức độ ưu tiên" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="low">Thấp</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">
              Hủy
            </Button>
            <Button type="submit" className="rounded-xl px-8 gap-2">
              <Plus className="h-4 w-4" />
              Thêm nhiệm vụ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
