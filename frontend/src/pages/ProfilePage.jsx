import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';
import {
  User, Mail, Globe, Lock, Palette, 
  Settings, Bell, Camera, Shield, CheckCircle, 
  Send, Code, Briefcase, ExternalLink, 
  MapPin, Phone, Calendar, 
  Languages, Clock, Star, MessageSquare, 
  Save, X, LogOut, Key, Eye, EyeOff, 
  ChevronRight, ArrowRight, Zap, Trophy,
  CloudLightning, Smartphone, Monitor
} from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // Existing fields + New frontend-only fields
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    displayName: user?.name || '',
    jobTitle: 'Senior Product Designer',
    company: 'SyncBoard Inc.',
    location: 'San Francisco, CA',
    website: 'https://sudhar.dev',
    phone: '+1 (555) 000-0000',
    birthday: '1995-06-15',
    timezone: '(GMT-08:00) Pacific Time',
    language: 'English (US)',
    github: 'sudhar-dev',
    linkedin: 'sudhar-profile',
    twitter: 'sudh_ar',
    portfolio: 'https://portfolio.sudhar.dev',
    skills: 'React, Node.js, Spring Boot, UI/UX, Tailwind CSS'
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [profileProgress, setProfileProgress] = useState(78);
  const [accentColor, setAccentColor] = useState('blue');

  const save = async () => {
    setIsSaving(true);
    try {
      // Only send existing fields to backend as requested
      await api.put('/users/me', {
        name: form.name,
        username: form.username,
        bio: form.bio
      });
      
      if (refreshUser) await refreshUser();
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'personal', label: 'Personal Info', icon: Mail },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-fade-up">
      
      {/* ── Profile Header Section ── */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative card p-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar with upload mockup */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-blue-500/20 border-4 border-white dark:border-gray-800 ring-4 ring-blue-500/20">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-black/5 dark:border-white/10 hover:scale-110 active:scale-95 transition-all text-blue-600 dark:text-blue-400">
                <Camera size={18} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{form.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                  <Zap size={12} /> Admin
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">@{form.username} • {form.jobTitle}</p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-semibold text-gray-400">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined May 2026</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {form.location}</span>
                <span className="flex items-center gap-1.5 text-emerald-500"><CheckCircle size={14} /> Verified Account</span>
              </div>
            </div>

            <div className="hidden lg:flex gap-4">
              <div className="text-center p-4 rounded-2xl bg-gray-50 dark:bg-white/3 border border-black/5 dark:border-white/5">
                <p className="text-lg font-black text-gray-900 dark:text-white">12</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teams</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gray-50 dark:bg-white/3 border border-black/5 dark:border-white/5">
                <p className="text-lg font-black text-gray-900 dark:text-white">48</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Left Sidebar Card ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Progress Card */}
          <div className="card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Profile Completion</h3>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400">{profileProgress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-1000" style={{ width: `${profileProgress}%` }}></div>
            </div>
            <ul className="space-y-3">
              {[
                { label: 'Basic Information', done: true },
                { label: 'Professional Details', done: true },
                { label: 'Social Accounts', done: false },
                { label: 'Two-Factor Security', done: false },
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-between text-xs font-medium">
                  <span className={item.done ? 'text-gray-900 dark:text-gray-200' : 'text-gray-400'}>{item.label}</span>
                  {item.done ? <CheckCircle size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="card p-6 space-y-6 overflow-hidden relative">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { icon: Zap, label: 'Logged in from New Device', time: '2 hours ago', color: 'blue' },
                { icon: Save, label: 'Updated Security Settings', time: 'Yesterday', color: 'amber' },
                { icon: Trophy, label: 'Achieved Project Milestone', time: '2 days ago', color: 'emerald' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`p-2 rounded-xl bg-${activity.color}-500/10 text-${activity.color}-500 shrink-0`}>
                    <activity.icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{activity.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors pt-4 border-t border-black/5 dark:border-white/5 mt-2">
              View All History
            </button>
          </div>

          {/* Account Status Badge */}
          <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20 text-white">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Account Status</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Fully Protected</p>
            </div>
          </div>
        </div>

        {/* ── Right Main Content ── */}
        <div className="lg:col-span-8">
          
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto no-scrollbar gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-lg shadow-blue-600/20' 
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            
            {/* ── General Section ── */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-up">
                <div className="card p-8 space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                    <User className="text-blue-500" size={20} />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Basic Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                      <input 
                        className="input-base focus:ring-4 ring-blue-500/10" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange}
                        placeholder="e.g. Sudharshan S"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Username</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                        <input 
                          className="input-base pl-8" 
                          name="username" 
                          value={form.username} 
                          onChange={handleChange}
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Bio</label>
                      <textarea 
                        className="input-base min-h-[120px] py-3 resize-none" 
                        name="bio" 
                        value={form.bio} 
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-[10px] text-gray-400 text-right font-medium">{form.bio.length} / 500 characters</p>
                    </div>
                  </div>
                </div>

                <div className="card p-8 space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                    <Briefcase className="text-violet-500" size={20} />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Professional Context</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Job Title</label>
                      <input className="input-base" name="jobTitle" value={form.jobTitle} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Company</label>
                      <input className="input-base" name="company" value={form.company} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Skills & Tags</label>
                      <input className="input-base" name="skills" value={form.skills} onChange={handleChange} placeholder="React, UI Design, product..." />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.skills.split(',').map((skill, i) => skill.trim() && (
                          <span key={i} className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-gray-600 dark:text-gray-400 border border-black/5 dark:border-white/5">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Personal Info Section ── */}
            {activeTab === 'personal' && (
              <div className="card p-8 space-y-8 animate-fade-up">
                <div className="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                  <Mail className="text-emerald-500" size={20} />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Public Email</label>
                    <input className="input-base" type="email" value={user?.email} disabled />
                    <p className="text-[10px] text-gray-400 px-1 font-medium italic">Email cannot be changed directly.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                    <input className="input-base" name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Location</label>
                    <input className="input-base" name="location" value={form.location} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Timezone</label>
                    <select className="input-base" name="timezone" value={form.timezone} onChange={handleChange}>
                      <option>(GMT-08:00) Pacific Time</option>
                      <option>(GMT+00:00) UTC</option>
                      <option>(GMT+05:30) India Standard Time</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Date of Birth</label>
                    <input className="input-base" type="date" name="birthday" value={form.birthday} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Display Language</label>
                    <select className="input-base" name="language" value={form.language} onChange={handleChange}>
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── Social Links Section ── */}
            {activeTab === 'social' && (
              <div className="card p-8 space-y-8 animate-fade-up">
                <div className="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                  <Globe className="text-pink-500" size={20} />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Social Presence</h2>
                </div>
                <div className="space-y-6">
                  {[
                    { name: 'github', icon: Code, label: 'GitHub Username', prefix: 'github.com/', color: 'gray' },
                    { name: 'linkedin', icon: Briefcase, label: 'LinkedIn Profile', prefix: 'linkedin.com/in/', color: 'blue' },
                    { name: 'twitter', icon: Send, label: 'Twitter Handle', prefix: '@', color: 'sky' },
                    { name: 'portfolio', icon: ExternalLink, label: 'Personal Website', prefix: 'https://', color: 'violet' }
                  ].map((social) => (
                    <div key={social.name} className="flex flex-col md:flex-row md:items-center gap-4 group">
                      <div className="flex items-center gap-3 w-48 shrink-0">
                        <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 group-hover:text-blue-500 transition-colors">
                          <social.icon size={18} />
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{social.label}</span>
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-tighter opacity-50">{social.prefix}</span>
                        <input 
                          className="input-base pl-24 text-sm" 
                          name={social.name} 
                          value={form[social.name]} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Preferences Section ── */}
            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-fade-up">
                <div className="card p-8 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                    <Bell className="text-amber-500" size={20} />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                  </div>
                  <div className="space-y-6">
                    {[
                      { id: 'email_notify', label: 'Email Notifications', desc: 'Receive updates about team activities and project progress.' },
                      { id: 'marketing_emails', label: 'Marketing Emails', desc: 'Stay updated with new features and community news.' },
                      { id: 'public_profile', label: 'Public Profile', desc: 'Make your profile visible to other people in the network.' },
                      { id: 'online_status', label: 'Show Online Status', desc: 'Show a green dot when you are active on the platform.' }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/3 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5">
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Security Section ── */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-up">
                <div className="card p-8 space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                    <Lock className="text-red-500" size={20} />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account Security</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/3 border border-black/5 dark:border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><Key size={18} /></div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Change Password</h3>
                          <p className="text-xs text-gray-400">Regularly update your password to stay safe.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <button className="btn-ghost text-xs py-2.5">Update Password</button>
                        <button className="btn-ghost text-xs py-2.5">Enable 2FA</button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Active Sessions</h3>
                      <div className="space-y-2">
                        {[
                          { device: 'MacBook Pro 14"', location: 'San Francisco, USA', current: true, icon: Monitor },
                          { device: 'iPhone 15 Pro', location: 'San Francisco, USA', current: false, icon: Smartphone }
                        ].map((session, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400"><session.icon size={18} /></div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{session.device}</p>
                                  {session.current && <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest">Active</span>}
                                </div>
                                <p className="text-[10px] text-gray-400">{session.location}</p>
                              </div>
                            </div>
                            {!session.current && <button className="text-xs font-bold text-red-500 hover:underline">Revoke</button>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Appearance Section ── */}
            {activeTab === 'appearance' && (
              <div className="card p-8 space-y-8 animate-fade-up">
                <div className="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                  <Palette className="text-indigo-500" size={20} />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Interface Customization</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Theme Mode</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${theme !== 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-amber-500"><Zap size={24} /></div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Light Mode</span>
                      </button>
                      <button 
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-900 shadow-md flex items-center justify-center text-blue-400"><CloudLightning size={24} /></div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Accent Color</label>
                    <div className="flex flex-wrap gap-4">
                      {['blue', 'violet', 'indigo', 'rose', 'emerald', 'amber'].map((color) => (
                        <button 
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`w-10 h-10 rounded-full bg-${color}-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 transition-all ${accentColor === color ? 'ring-4' : 'scale-90 hover:scale-100 opacity-60 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Font Size</label>
                      <select className="input-base">
                        <option>Default (Inter)</option>
                        <option>Small</option>
                        <option>Large</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Layout Density</label>
                      <div className="flex items-center justify-between p-3 rounded-2xl border border-black/5 dark:border-white/5">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Compact Mode</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky Action Bar ── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 flex items-center justify-between gap-8 animate-fade-up">
          <div className="flex items-center gap-3 px-2">
            <div className={`w-2 h-2 rounded-full animate-pulse bg-blue-500`}></div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Careful — you have unsaved changes!</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Discard</button>
            <button 
              onClick={save}
              disabled={isSaving}
              className={`px-8 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={14} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast Mockup */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-fade-up">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center gap-3 font-bold text-sm">
            <CheckCircle size={18} />
            Profile updated successfully!
          </div>
        </div>
      )}

    </div>
  );
}
