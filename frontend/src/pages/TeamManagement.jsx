import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Users, Plus, Search, MoreVertical, 
  ArrowRight, Shield, UserPlus, X, Trash2, Edit2
} from 'lucide-react';

export default function TeamManagement() {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [invite, setInvite] = useState({ teamId: '', email: '', role: 'MEMBER' });

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teams', newTeam);
      setShowCreateModal(false);
      setNewTeam({ name: '', description: '' });
      fetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage your collaborative groups and workspace members.
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus size={18} /> Create Team
        </button>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search teams..." 
            className="input-base pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="card p-3 flex items-center gap-2 min-w-[320px]">
          <select className="input-base text-sm" value={invite.teamId} onChange={(e) => setInvite({ ...invite, teamId: e.target.value })}>
            <option value="">Team</option>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input className="input-base text-sm" placeholder="member@email.com" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
          <select className="input-base text-sm" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <button className="btn-primary" onClick={async () => {
            if (!invite.teamId || !invite.email) return;
            await api.post('/invitations', invite);
            setInvite({ teamId: '', email: '', role: 'MEMBER' });
          }}>
            <UserPlus size={14} /> Invite
          </button>
        </div>
      </div>

      {/* ── Teams Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-48 animate-pulse bg-gray-50 dark:bg-gray-800/20" />
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="card py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
            <Users size={32} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No teams found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
            {searchQuery ? "No teams match your search criteria." : "Get started by creating your first team to collaborate."}
          </p>
          {!searchQuery && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary mt-6"
            >
              <Plus size={18} /> Create Team
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team, idx) => (
            <div key={team.id} className="card group hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    ['bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
                     'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
                     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'][idx % 3]
                  }`}>
                    {team.name.charAt(0)}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {team.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 min-h-[2.5rem]">
                  {team.description || "No description provided for this team."}
                </p>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {/* Mock avatars based on member count */}
                    {Array.from({ length: Math.min(team.memberIds?.length || 1, 4) }).map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {i === 3 && team.memberIds?.length > 4 ? `+${team.memberIds.length - 3}` : ""}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Users size={12} /> {team.memberIds?.length || 1} members
                  </span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50/50 dark:bg-white/3 border-t border-black/5 dark:border-white/5 rounded-b-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1">
                  {team.leaderId === user?.id ? (
                    <><Shield size={12} className="text-amber-500" /> Leader</>
                  ) : (
                    <><Users size={12} /> Member</>
                  )}
                </span>
                <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group/btn">
                  Manage <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="card w-full max-w-md relative z-10 animate-fade-up p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Team</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTeam} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Team Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Design Systems"
                  className="input-base"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description (Optional)</label>
                <textarea 
                  rows={3}
                  className="input-base resize-none"
                  placeholder="Describe your team's mission..."
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
