import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Calendar, Award, TrendingUp, ChevronRight, Clock, Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exerciseApi } from '../hooks/api';

const data = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 85 },
  { name: 'Fri', score: 82 },
  { name: 'Sat', score: 90 },
  { name: 'Sun', score: 94 },
];

const Dashboard = () => {
  const [recommendations, setRecommendations] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [achievements, setAchievements] = React.useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  React.useEffect(() => {
    fetchRecommendations();
    if (user.id) {
        fetchHistory();
        fetchAchievements();
    }
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await exerciseApi.getAchievements(user.id);
      setAchievements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await exerciseApi.getHistory(user.id);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const profile = JSON.parse(localStorage.getItem('profileData') || '{}');
      const condition = profile.condition || '';
      const res = await exerciseApi.getRecommendations({ condition });
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black mb-2">Welcome Back, <span className="text-gradient">{user.username || 'Athlete'}</span></h1>
          <p className="text-slate-400">Your recovery progress is looking excellent this week.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-6 py-3 flex items-center gap-3">
            <Calendar className="text-sky-500 w-5 h-5" />
            <span className="font-bold">Day 14 Streak</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Analytics Chart */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-500" /> Recovery Performance
            </h3>
            <select className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          {/* Daily Goals / Achievements */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Award className="text-amber-400" /> Achievements
            </h3>
            <div className="space-y-4">
              {achievements.length > 0 ? achievements.map(ach => (
                <div key={ach.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Award className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-200">{ach.title}</div>
                        <div className="text-[10px] text-slate-500">{ach.description}</div>
                    </div>
                </div>
              )) : (
                <p className="text-xs text-slate-500 italic">No achievements yet. Keep practicing!</p>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass-card p-6 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border-sky-500/20">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sky-400">
              <Activity className="w-5 h-5" /> AI Health Insight
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              "Your left hip stability has improved by 12% compared to last week. Focus on maintaining symmetry during Lunges."
            </p>
            <button className="text-sky-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View Detailed Report <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-bold mb-6">Recent Therapy Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b border-white/5">
                  <th className="pb-4 font-medium">Exercise</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Duration</th>
                  <th className="pb-4 font-medium">Accuracy</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.length > 0 ? history.map(s => (
                  <SessionRow 
                    key={s.id}
                    name={s.exercise_name} 
                    date={new Date(s.completed_at).toLocaleDateString()} 
                    duration={`${Math.floor(s.duration_seconds / 60)}m`} 
                    accuracy={`${s.accuracy_score.toFixed(0)}%`} 
                    status="Completed" 
                  />
                )) : (
                    <tr><td colSpan="5" className="py-8 text-center text-slate-500">No sessions recorded yet. Start your first exercise!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="lg:col-span-1 glass-card p-8 bg-sky-500/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Star className="text-sky-400 w-5 h-5 fill-sky-400" />
                AI Recommendations
            </h3>
            <div className="space-y-4">
                {recommendations.map(ex => (
                    <div key={ex.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="text-xs text-sky-400 font-bold mb-1 uppercase tracking-tighter">{ex.body_part}</div>
                        <h4 className="font-bold text-sm mb-3">{ex.name}</h4>
                        <Link 
                            to={`/session/${ex.id}`}
                            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                        >
                            <Play className="w-3 h-3" /> START SESSION
                        </Link>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors">
                VIEW ALL RECOMMENDATIONS
            </button>
        </div>

      </div>
    </div>
  );
};

const GoalItem = ({ label, progress }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="font-bold text-sky-400">{progress}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1 }}
        className="h-full bg-sky-500" 
      />
    </div>
  </div>
);

const SessionRow = ({ name, date, duration, accuracy, status }) => (
  <tr className="hover:bg-white/5 transition-colors group">
    <td className="py-4 font-bold group-hover:text-sky-400 transition-colors">{name}</td>
    <td className="py-4 text-slate-400 text-sm">{date}</td>
    <td className="py-4 text-slate-400 text-sm">{duration}</td>
    <td className="py-4 text-emerald-400 font-bold">{accuracy}</td>
    <td className="py-4">
      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase">
        {status}
      </span>
    </td>
  </tr>
);

export default Dashboard;
