/* AddTaskForm — Form inside modal for creating new tasks */
import React, { useState } from 'react';
import { MotionInput } from '../motion/MotionInput';
import { MotionButton } from '../motion/MotionButton';
import type { Task, Priority, Category } from '../../data/types';
import { uid } from '../../utils/helpers';

interface Props {
  onAdd: (task: Task) => void;
  onClose: () => void;
}

const priorities: Priority[] = ['low', 'medium', 'high'];
const categories: Category[] = ['homework', 'study', 'project', 'exam', 'personal'];

export const AddTaskForm: React.FC<Props> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('homework');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    const task: Task = {
      id: uid(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: 'todo',
      category,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
      order: 0, // actual order is computed in useAppData
    };

    onAdd(task);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <MotionInput
        label="Task title"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setError(''); }}
        error={error}
        autoFocus
      />

      <MotionInput
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Priority selector */}
      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1.5">Priority</label>
        <div className="flex gap-2">
          {priorities.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium capitalize
                border transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400
                ${
                  priority === p
                    ? 'border-accent-400 bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400 dark:border-accent-500'
                    : 'border-surface-200 dark:border-surface-700 text-surface-500 hover:border-surface-300'
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1.5">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium capitalize
                border transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400
                ${
                  category === c
                    ? 'border-accent-400 bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400 dark:border-accent-500'
                    : 'border-surface-200 dark:border-surface-700 text-surface-500 hover:border-surface-300'
                }
              `}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Due date */}
      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1.5">Due date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg text-sm
            bg-surface-50 dark:bg-surface-800
            border border-surface-200 dark:border-surface-700
            text-surface-900 dark:text-surface-100
            focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20
          "
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <MotionButton type="submit" variant="primary" className="flex-1">
          Add Task
        </MotionButton>
        <MotionButton type="button" variant="secondary" onClick={onClose}>
          Cancel
        </MotionButton>
      </div>
    </form>
  );
};
