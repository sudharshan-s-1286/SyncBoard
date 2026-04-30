import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Clock } from 'lucide-react';

export default function SortableTask({ task, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab'
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={() => onClick(task)}
      className="card p-4 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group active:cursor-grabbing"
    >
      <div className="flex justify-between items-start gap-2 mb-2 pointer-events-none">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">{task.title}</h3>
        <button className="p-1 opacity-0 group-hover:opacity-100 text-gray-400">
          <MoreVertical size={14} />
        </button>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed pointer-events-none">
        {task.description || "No description provided."}
      </p>
      
      <div className="flex items-center justify-between mt-auto pointer-events-none">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${
            task.priority === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
            task.priority === 'Low' ? 'bg-slate-50 text-slate-500 dark:bg-slate-900/20 dark:text-slate-400' :
            'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {task.priority}
          </span>
          {task.dueDate && (
             <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500">
               <Clock size={10} />
               {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
             </div>
          )}
        </div>
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black border border-white dark:border-gray-800">
          {task.assignedToId ? task.assignedToId.charAt(0) : '?'}
        </div>
      </div>
    </div>
  );
}
