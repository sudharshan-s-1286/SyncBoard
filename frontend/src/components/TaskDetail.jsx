import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { 
  X, Calendar, User, Tag, 
  MessageSquare, Send, Clock, 
  Trash2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function TaskDetail({ task, onClose, onUpdate }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [attachment, setAttachment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    if (task?.id) {
      fetchComments();
    }
  }, [task]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/tasks/${task.id}/comments`); // Need to add this endpoint
      setComments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/tasks/${task.id}/comments`, { text: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 w-full max-w-lg bg-white dark:bg-[#0a0e1a] shadow-2xl z-[70] flex flex-col p-0 border-l border-black/5 dark:border-white/5 animate-fade-up">
        {/* Header */}
        <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/3">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
               <Tag size={18} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Task Details</h2>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5 italic">SyncBoard / Workspace</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">{task.title}</h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`badge ${
                task.priority === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                task.priority === 'Low' ? 'bg-slate-50 text-slate-500 dark:bg-slate-900/20 dark:text-slate-400' :
                'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              } text-[10px] uppercase font-black tracking-widest px-3 py-1`}>
                {task.priority || 'Medium'}
              </span>
              <span className="badge bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[10px] uppercase font-black tracking-widest px-3 py-1">
                {task.status}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Attachments</p>
            <div className="flex gap-2">
              <input className="input-base text-sm" placeholder="Paste attachment URL" value={attachment} onChange={(e) => setAttachment(e.target.value)} />
              <button className="btn-ghost" onClick={async () => {
                if (!attachment.trim()) return;
                await api.post(`/tasks/${task.id}/attachments`, { attachment });
                setAttachment('');
                onUpdate();
              }}>Add</button>
            </div>
            <div className="space-y-1">
              {(task.attachments || []).map((a, idx) => <a key={idx} href={a} target="_blank" className="text-xs text-blue-600 block">{a}</a>)}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-white/3 rounded-2xl p-6 border border-black/5 dark:border-white/5">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-2 border-primary-500 pl-4 py-1">
              {task.description || "No description provided for this task."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assigned To</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                   {task.assignedToId?.charAt(0) || <User size={18} />}
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">{task.assignedToId || 'Unassigned'}</p>
                   <p className="text-[10px] text-gray-500 italic">Core Contributor</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Due Date</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
                   <Calendar size={18} />
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">
                     {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                   </p>
                   <p className="text-[10px] text-gray-500 italic">Timeline Anchor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-8 border-t border-black/5 dark:border-white/5 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <MessageSquare size={16} /> Comments ({comments.length})
            </h3>

            <div className="space-y-4">
              {loadingComments ? (
                <div className="h-20 animate-pulse bg-gray-50 dark:bg-white/3 rounded-xl" />
              ) : comments.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-500 text-center py-4">No comments yet. Start the conversation.</p>
              ) : (
                comments.map((comment, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                      C
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-white/3 p-3 rounded-xl border border-black/5 dark:border-white/5">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="relative mt-4">
              <input 
                type="text" 
                placeholder="Write a comment..." 
                className="input-base pr-12 text-sm py-3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1.5 p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-black/5 dark:border-white/5 flex gap-3 shrink-0">
           <button className="btn-ghost flex-1 justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10" onClick={async () => {
             await api.delete(`/tasks/${task.id}`);
             onUpdate();
             onClose();
           }}>
             <Trash2 size={16} /> Delete Task
           </button>
           <button className="btn-primary flex-1 justify-center gap-2" onClick={async () => {
             await api.put(`/tasks/${task.id}/status`, { status: 'Done' });
             onUpdate();
             onClose();
           }}>
             <CheckCircle2 size={16} /> Mark as Complete
           </button>
        </div>
      </aside>
    </>
  );
}
