import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  DndContext, 
  PointerSensor, 
  useSensor, 
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import api from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, ArrowLeft, Search, Filter, 
  AlertCircle, X, Users
} from 'lucide-react';
import TaskDetail from '../components/TaskDetail';
import KanbanColumn from '../components/KanbanColumn';

const STATUS_COLUMNS = [
  { id: 'To Do', title: 'To Do', color: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-100 dark:border-blue-900/30' },
  { id: 'Review', title: 'Review', color: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-100 dark:border-amber-900/30' },
  { id: 'Done', title: 'Done', color: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-100 dark:border-emerald-900/30' }
];

export default function TaskBoard() {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);
  const stompClient = useContext(SocketContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', description: '', priority: 'Medium', dueDate: '', assignedToId: '', status: 'To Do' 
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const fetchProjectAndTasks = async () => {
    try {
      const projRes = await api.get(`/projects/${projectId}`);
      setProject(projRes.data);
      const tasksRes = await api.get(`/tasks/project/${projectId}`);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  useEffect(() => {
    if (!stompClient?.connected || !project) return;
    const sub = stompClient.subscribe(`/topic/team/${project.teamId}`, (msg) => {
      const activity = JSON.parse(msg.body);
      if (activity.projectId === projectId && (activity.action.toLowerCase().includes('task'))) {
        api.get(`/tasks/project/${projectId}`).then(res => setTasks(res.data));
      }
    });
    return () => sub.unsubscribe();
  }, [stompClient, project, projectId]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
      // Rollback on error
      fetchProjectAndTasks();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId });
      setShowCreateModal(false);
      setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', assignedToId: '', status: 'To Do' });
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if(!project && !loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-bold">Project not found</h2>
      <Link to="/projects" className="btn-ghost mt-4">Back to Projects</Link>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/projects" className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">
              {project?.name || 'Loading...'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Project Board
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost text-xs font-bold uppercase tracking-widest px-4">
            <Users size={14} className="mr-1" /> Team
          </button>
          <button 
            onClick={() => {
              setNewTask(prev => ({ ...prev, status: 'To Do' }));
              setShowCreateModal(true);
            }}
            className="btn-primary text-sm font-bold shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search tasks..." className="input-base pl-icon py-2 text-xs" />
        </div>
        <button className="btn-ghost p-2 rounded-lg border-none hover:bg-gray-100 dark:hover:bg-white/5">
          <Filter size={16} className="text-gray-400" />
        </button>
      </div>

      {/* ── Kanban Grid ── */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start pb-8 overflow-x-auto min-h-[70vh]">
          {STATUS_COLUMNS.map((col) => (
            <KanbanColumn 
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              border={col.border}
              tasks={tasks.filter(t => t.status === col.id)}
              onAddTask={(status) => {
                setNewTask(prev => ({ ...prev, status }));
                setShowCreateModal(true);
              }}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>
      </DndContext>

      {/* ── Create Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="card w-full max-w-lg relative z-10 animate-fade-up p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-gray-900 dark:text-white">Create Task</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Task Title In {newTask.status}</label>
                <input 
                  type="text" 
                  required
                  placeholder="What needs to be done?"
                  className="input-base py-3 text-sm font-bold"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Priority</label>
                   <select 
                     className="input-base text-sm font-bold"
                     value={newTask.priority}
                     onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                   >
                     <option>Low</option>
                     <option>Medium</option>
                     <option>High</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Due Date</label>
                   <input 
                     type="date" 
                     className="input-base text-sm font-bold"
                     value={newTask.dueDate}
                     onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                   />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Description</label>
                <textarea 
                  rows={3}
                  className="input-base text-sm leading-relaxed"
                  placeholder="Optional details..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-ghost flex-1 py-3 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex-1 py-3 font-bold shadow-lg shadow-blue-500/20"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Task Detail Sidebar ── */}
      {selectedTask && (
        <TaskDetail 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onUpdate={fetchProjectAndTasks}
        />
      )}
    </div>
  );
}
