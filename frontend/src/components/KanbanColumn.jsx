import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import SortableTask from './SortableTask';

export default function KanbanColumn({ id, title, color, border, tasks, onAddTask, onTaskClick }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col h-full min-w-[280px] rounded-2xl ${color} border ${border} p-3 transition-colors`}
    >
      <div className="flex items-center justify-between mb-4 px-1 pt-1 text-xs font-black uppercase tracking-widest italic opacity-60">
        <span className="text-gray-600 dark:text-gray-300">{title}</span>
        <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask 
              key={task.id} 
              task={task} 
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>
        
        <button 
          onClick={() => onAddTask(id)}
          className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-white/3 transition-all"
        >
          <Plus size={14} /> Add task
        </button>
      </div>
    </div>
  );
}
