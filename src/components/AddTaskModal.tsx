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
    <DialogContent 
      style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '16px', 
        maxWidth: '450px', 
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' 
      }}
    >
      <DialogHeader>
        <DialogTitle style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', display: 'block' }}>
          Thêm nhiệm vụ mới
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', fontSize: '14px' }}>Tiêu đề</label>
          <input
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }}
            placeholder="Nhập tiêu đề..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', fontSize: '14px' }}>Mô tả</label>
          <textarea
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px', width: '100%' }}
            placeholder="Nhập mô tả..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', fontSize: '14px' }}>Mức độ ưu tiên</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value as any)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white', width: '100%' }}
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button 
            type="button" 
            onClick={onClose}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#f1f5f9' }}
          >
            Hủy
          </button>
          <button 
            type="submit"
            style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#3b82f6', color: 'white', fontWeight: 'bold' }}
          >
            Thêm nhiệm vụ
          </button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
  );
};