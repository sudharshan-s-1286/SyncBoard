import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  FolderOpen, Plus, Calendar, Users, 
  CheckCircle2, Clock, MoreVertical, 
  ArrowRight, Filter, ChevronDown, 
  LayoutGrid, List as ListIcon, X
} from 'lucide-react';

export default function ProjectWorkspace() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ 
    name: '', description: '', teamId: '', deadline: '' 
  });
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const fetchData = async () => {
    try {
      const teamsRes = await api.get('/teams');
      setTeams(teamsRes.data);
      if (teamsRes.data.length > 0) {
        // Fetch projects for all teams or first team?
        // Let's fetch for all first
        const allProjects = [];
        for (const team of teamsRes.data) {
          const res = await api.get(`/projects/team/${team.id}`);
          allProjects.push(...res.data.map(p => ({ ...p, teamName: team.name })));
        }
        setProjects(allProjects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowCreateModal(false);
      setNewProject({ name: '', description: '', teamId: '', deadline: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = selectedTeamId 
    ? projects.filter(p => p.teamId === selectedTeamId)
    : projects;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Track progress across your active and upcoming project workspaces.
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/50 dark:bg-white/3 p-2 rounded-2xl border border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3 pl-2">
          <Filter size={14} className="text-gray-400" />
          <select 
            className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-300 outline-none cursor-pointer border-none focus:ring-0"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ListIcon size={16} />
          </button>
        </div>
      </div>

      {/* ── Projects View ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-64 animate-pulse bg-gray-50 dark:bg-gray-800/20" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="card py-24 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-6">
            <FolderOpen size={40} className="text-violet-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Find your focus</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
            {selectedTeamId ? "This team doesn't have any projects yet." : "You haven't been assigned to any projects. Start one to begin tracking."}
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary mt-8"
          >
            <Plus size={18} /> New Project
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <div 
              key={project.id} 
              onClick={() => navigate(`/projects/${project.id}`)}
              className="card p-6 cursor-pointer hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`label-sm px-2 py-0.5 rounded text-[10px] ${
                    project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {project.status || 'Active'}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1.5 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">{project.teamName}</p>
                </div>
                <button className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-400">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 line-clamp-2 min-h-[2.5rem]">
                {project.description || "Streamline your development workflow with centralized task tracking and team sync."}
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar size={14} />
                    <span>Due: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700" />
                    ))}
                  </div>
                </div>
                
                {/* Progress bar mock */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                    <span>Progress</span>
                    <span>{idx % 2 === 0 ? '65%' : '20%'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${idx % 2 === 0 ? 'bg-blue-500 w-[65%]' : 'bg-violet-500 w-[20%]'}`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
           <table className="w-full text-left">
             <thead className="bg-gray-50 dark:bg-white/3 border-b border-black/5 dark:border-white/5">
               <tr>
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Project Name</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Team</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Deadline</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-black/5 dark:divide-white/5">
               {filteredProjects.map(project => (
                 <tr 
                   key={project.id} 
                   onClick={() => navigate(`/projects/${project.id}`)}
                   className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors cursor-pointer group"
                 >
                   <td className="px-6 py-4">
                     <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{project.name}</span>
                   </td>
                   <td className="px-6 py-4">
                     <span className="text-sm text-gray-500 dark:text-gray-400">{project.teamName}</span>
                   </td>
                   <td className="px-6 py-4">
                     <span className={`badge ${
                       project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                     }`}>
                       {project.status || 'Active'}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">
                     {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button className="btn-ghost p-2 rounded-full border-none hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                       <ArrowRight size={16} className="text-gray-400" />
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

      {/* ── Create Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="card w-full max-w-lg relative z-10 animate-fade-up p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Project</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Q3 Mobile Roadmap"
                    className="input-base"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Team</label>
                  <select 
                    required
                    className="input-base"
                    value={newProject.teamId}
                    onChange={(e) => setNewProject({ ...newProject, teamId: e.target.value })}
                  >
                    <option value="">Select Team</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Deadline</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="date" 
                      required
                      className="input-base pl-icon"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Scope & Description</label>
                  <textarea 
                    rows={4}
                    className="input-base resize-none"
                    placeholder="What are we building?"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-ghost flex-1 py-3"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex-1 py-3"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
