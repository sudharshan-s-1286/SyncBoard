import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { Link } from 'react-router-dom';
import {
  Users, Target, Clock, CheckCircle2,
  ArrowRight, ArrowUpRight, Zap, Plus,
  TrendingUp
} from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const stompClient = useContext(SocketContext);
  const [teams, setTeams] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [teamsRes, statsRes] = await Promise.all([
          api.get('/teams'),
          api.get('/dashboard/stats')
        ]);
        setTeams(teamsRes.data);
        setStats(statsRes.data);
      } catch (err) { 
        console.error('Failed to load dashboard data:', err); 
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!stompClient?.connected || teams.length === 0) return;
    const subs = teams.map(t =>
      stompClient.subscribe(`/topic/team/${t.id}`, msg => {
        const a = JSON.parse(msg.body);
        setActivities(prev => [a, ...prev].slice(0, 12));
      })
    );
    return () => subs.forEach(s => s.unsubscribe());
  }, [stompClient, teams]);

  /* ── helper: greeting by time of day ── */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-fade-up">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {greeting}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Here's what's happening across your workspace today.
        </p>
      </div>

      {/* ── Stat cards — intentionally varied layout ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">

        {/* Card 1: Teams — compact */}
        <div className="card p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Users size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="label-sm text-gray-400 dark:text-gray-500 mb-1">Teams</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTeams}</p>
          </div>
        </div>

        {/* Card 2: Projects — has a subtle trend line */}
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
              <Target size={18} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="label-sm text-gray-400 dark:text-gray-500 mb-1">Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</p>
            </div>
          </div>
          {/* decorative mini bar chart */}
          <div className="absolute bottom-0 right-4 flex items-end gap-[3px] h-8 opacity-20 dark:opacity-15">
            {[40, 60, 35, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="w-1 rounded-t bg-violet-500" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Card 3: Pending — amber tint */}
        <div className="card p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="label-sm text-gray-400 dark:text-gray-500 mb-1">Active</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTasks}</p>
          </div>
        </div>

        {/* Card 4: Completed — slightly different layout: right-aligned icon */}
        <div className="card p-5 flex items-center justify-between">
          <div>
            <p className="label-sm text-gray-400 dark:text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</p>
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-0.5 mt-1">
              <TrendingUp size={12} /> on track
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Teams — wider column */}
        <div className="lg:col-span-3 card flex flex-col">
          <div className="p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              Your Teams
            </h2>
            <Link to="/teams" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="p-5 flex-1">
            {teams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Users size={24} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No teams yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-5 max-w-[220px]">Create your first team to start collaborating with your people.</p>
                <button className="btn-primary text-sm">
                  <Plus size={14} /> New Team
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {teams.slice(0, 4).map((team, idx) => (
                  <div
                    key={team.id}
                    className="group flex items-center gap-4 p-3.5 rounded-xl border border-transparent hover:border-black/6 dark:hover:border-white/6 hover:bg-gray-50 dark:hover:bg-white/3 transition-all cursor-pointer"
                  >
                    {/* colored pill — varies by index */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      ['bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
                       'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
                       'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
                       'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'][idx % 4]
                    }`}>
                      {team.name?.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {team.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                        {team.description || `${team.memberIds?.length ?? 1} member${(team.memberIds?.length ?? 1) !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <ArrowUpRight size={14} className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed — narrower */}
        <div className="lg:col-span-2 card flex flex-col max-h-[30rem]">
          <div className="p-5 border-b border-black/5 dark:border-white/5 shrink-0">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              Live Activity
              {activities.length > 0 && (
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-60 py-10">
                <Clock size={28} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">No activity yet.</p>
                <p className="text-xs text-gray-400 mt-1">Updates from your teams will appear here in real time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((act, i) => (
                  <div key={i} className="flex gap-3">
                    {/* timeline dot */}
                    <div className="flex flex-col items-center pt-1 shrink-0">
                      <div className={`w-2 h-2 rounded-full ${
                        act.action?.includes('Created') ? 'bg-emerald-500' :
                        act.action?.includes('Updated') ? 'bg-blue-500' :
                        act.action?.includes('comment') ? 'bg-violet-500' :
                        'bg-gray-400'
                      }`} />
                      {i < activities.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 dark:bg-gray-800 mt-1" />
                      )}
                    </div>
                    <div className="pb-4 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-snug">{act.action}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{act.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick actions row ── */}
      <div className="flex flex-wrap gap-3">
        <Link to="/teams" className="btn-ghost text-sm gap-1.5"><Plus size={14} /> New Team</Link>
        <Link to="/projects" className="btn-ghost text-sm gap-1.5"><Plus size={14} /> New Project</Link>
        <Link to="/tasks" className="btn-ghost text-sm gap-1.5"><Plus size={14} /> New Task</Link>
      </div>
    </div>
  );
}
