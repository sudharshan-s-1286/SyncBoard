import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun, ArrowRight, CheckCircle, Zap, Users, Shield, BarChart2, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: <Zap size={20} />,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    title: 'Real-Time Activity',
    desc: 'Every action — a comment, a status change, an invite — ripples across your team the moment it happens.',
  },
  {
    icon: <Users size={20} />,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    title: 'Team Workspaces',
    desc: 'Invite people, assign roles, and scope every conversation and task to the right group.',
  },
  {
    icon: <Shield size={20} />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    title: 'Role-based Access',
    desc: 'Team leaders hold the keys. Members get exactly what they need — nothing more, nothing less.',
  },
  {
    icon: <BarChart2 size={20} />,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    title: 'Progress Dashboard',
    desc: 'See task completion, upcoming deadlines, and team velocity at a glance from one clean view.',
  },
  {
    icon: <MessageSquare size={20} />,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    title: 'Task Conversations',
    desc: 'Comment directly on tasks. Keep context where the work lives, not lost in email threads.',
  },
  {
    icon: <CheckCircle size={20} />,
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    title: 'Kanban & Priorities',
    desc: 'Drag tasks through To Do → In Progress → Review → Done with priority tags that actually mean something.',
  },
];

const steps = [
  { step: '01', title: 'Create your team', desc: 'Set up a workspace, invite your collaborators, and assign roles in under a minute.' },
  { step: '02', title: 'Add a project', desc: 'Define scope, set a deadline, and attach the right people. SyncBoard keeps it structured.' },
  { step: '03', title: 'Work in sync', desc: 'Create tasks, comment, update status — your whole team sees it the second it changes.' },
];

export default function Landing() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fc] dark:bg-[#0a0e1a] text-gray-900 dark:text-gray-100 overflow-x-hidden">

      {/* ── Floating Nav ── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'nav-floating shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow">
              <span className="text-white font-bold text-lg leading-none">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">SyncBoard</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-gray-900 dark:hover:text-white transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/8 transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="btn-ghost text-sm hidden sm:inline-flex">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm">Get started free</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* background blobs */}
        <div className="glow-blob w-[600px] h-[600px] bg-blue-400 dark:bg-blue-600 -top-40 -right-40" />
        <div className="glow-blob w-[400px] h-[400px] bg-violet-400 dark:bg-violet-700 bottom-0 -left-32" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-16 items-center relative z-10">
          {/* left text column */}
          <div className="animate-fade-up">
            <span className="label-sm text-blue-600 dark:text-blue-400 mb-4 block">For teams that move fast</span>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-950 dark:text-white leading-[1.1] mb-6">
              Your team,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">in sync.</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mb-10">
              SyncBoard is the collaborative workspace where teams manage projects, track tasks, and communicate — updated live as work happens.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/register" className="btn-primary px-6 py-3 text-base gap-2">
                Start for free <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-ghost px-6 py-3 text-base">
                Sign in
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
              {['No credit card', 'Free forever plan', 'Setup in 60 seconds'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* right: abstract UI preview card */}
          <div className="animate-fade-up delay-200 animate-float relative">
            <div className="card p-5 rounded-2xl relative">
              {/* mini dashboard preview */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-600 font-mono">SyncBoard / Design Sprint</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'To Do', count: 4, color: 'bg-slate-100 dark:bg-slate-800' },
                  { label: 'In Progress', count: 6, color: 'bg-blue-50 dark:bg-blue-900/30' },
                  { label: 'Done', count: 11, color: 'bg-emerald-50 dark:bg-emerald-900/30' },
                ].map(col => (
                  <div key={col.label} className={`${col.color} rounded-xl p-3`}>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{col.label}</p>
                    {Array.from({ length: Math.min(col.count, 3) }).map((_, i) => (
                      <div key={i} className="h-8 rounded-lg bg-white dark:bg-gray-800 mb-2 shadow-sm border border-black/5 dark:border-white/5" />
                    ))}
                    <p className="text-xs text-gray-400 mt-1">{col.count} tasks</p>
                  </div>
                ))}
              </div>
              {/* activity ticks */}
              <div className="space-y-2">
                {[
                  { name: 'Aisha moved "API Docs" to Done', time: '2m ago', color: 'bg-emerald-500' },
                  { name: 'Rohan commented on "Auth flow"', time: '9m ago', color: 'bg-blue-500' },
                  { name: 'Priya assigned you a new task', time: '22m ago', color: 'bg-violet-500' },
                ].map(a => (
                  <div key={a.name} className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.color}`} />
                    <span className="truncate flex-1">{a.name}</span>
                    <span className="text-gray-400 dark:text-gray-600 shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
              {/* ping dot */}
              <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Logos (Social Proof) ── */}
      <section className="py-12 border-y border-black/5 dark:border-white/5 bg-gray-50/30 dark:bg-white/1">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-center text-gray-400 mb-8 italic">Trusted by fast-moving teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {['Vercel', 'Linear', 'Github', 'Raycast', 'Notion', 'Slack'].map(brand => (
              <span key={brand} className="text-xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 bg-white dark:bg-[#0a0e1a]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <span className="label-sm text-blue-600 dark:text-blue-400">What you get</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-3 max-w-lg">
              Everything your team needs, nothing it doesn't.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#111827] hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200 cursor-default"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.bg} ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="py-24 px-6 bg-[#f7f8fc] dark:bg-[#0a0e1a]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="label-sm text-blue-600 dark:text-blue-400">Simple by design</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-3">How it works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-900 to-transparent" />
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111827] border border-black/8 dark:border-white/8 shadow-sm flex items-center justify-center font-bold font-mono text-blue-600 dark:text-blue-400 text-sm z-10">
                    {s.step}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 bg-blue-600 dark:bg-blue-700 relative overflow-hidden">
        <div className="glow-blob w-96 h-96 bg-blue-400 -top-20 -right-20 opacity-30" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to sync your team?</h2>
          <p className="text-blue-100 text-lg mb-8">Join teams already using SyncBoard to ship work faster.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Create your workspace <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 bg-white dark:bg-[#0a0e1a] border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs leading-none">S</span>
            </div>
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">SyncBoard</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">© 2026 SyncBoard. Built for teams that care.</p>
          <div className="flex gap-5 text-xs text-gray-400 dark:text-gray-600">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
