import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  CheckSquare, Calendar, User, 
  ArrowRight, Search, 
  Clock, Tag, ChevronRight, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AllTasks() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Backend: TaskRepository has findByAssignedToId. 
        // Controller: need to make sure we have a GET /api/tasks/assigned
        const res = await api.get('/tasks/assigned'); 
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks
    .filter((t) => statusFilter === 'All' || t.status === statusFilter)
    .filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const rank = { High: 3, Medium: 2, Low: 1 };
        return (rank[b.priority] || 0) - (rank[a.priority] || 0);
      }
      return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    });

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Active Tasks</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage everything assigned to you across all projects.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your tasks..." 
            className="input-base pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="input-base text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option><option>To Do</option><option>In Progress</option><option>Review</option><option>Done</option>
          </select>
          <select className="input-base text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Sort by due date</option>
            <option value="priority">Sort by priority</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="card h-16 animate-pulse" />)}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card py-20 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
             <CheckSquare size={32} className="text-emerald-500" />
           </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white">All clear!</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-1">There are no active tasks assigned to your account right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => navigate(`/projects/${task.projectId}`)}
              className="card group p-4 flex items-center justify-between hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                   task.status === 'Done' ? 'bg-emerald-500' :
                   task.status === 'Review' ? 'bg-amber-500' :
                   task.status === 'In Progress' ? 'bg-blue-500' :
                   'bg-slate-400'
                }`} />
                <div className="min-w-0">
                   <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 truncate">{task.title}</h3>
                   <div className="flex items-center gap-3 mt-0.5">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                        <Tag size={10} /> {task.status}
                     </span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                        <Clock size={10} /> Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                     </span>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0 ml-4">
                <div className={`hidden md:flex flex-col items-end`}>
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400/60 italic">Priority</span>
                   <span className={`text-[10px] font-black uppercase italic ${
                     task.priority === 'High' ? 'text-red-500' : 
                     task.priority === 'Low' ? 'text-slate-400' : 
                     'text-blue-500'
                   }`}>{task.priority}</span>
                </div>
                <ArrowRight size={18} className="text-gray-300 dark:text-gray-700 group-hover:text-blue-500 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
