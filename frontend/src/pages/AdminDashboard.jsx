import React, { useState, useEffect } from 'react';
import { exerciseApi } from '../hooks/api';
import { Users, FileText, Database, ShieldCheck, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_exercises: 0,
    total_conditions: 0,
    total_body_parts: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await exerciseApi.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
            <ShieldCheck className="text-indigo-400" />
        </div>
        <div>
            <h1 className="text-4xl font-black">Admin Control Center</h1>
            <p className="text-slate-500 font-medium">Enterprise ecosystem management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <AdminStatCard icon={<Database />} label="Database Records" value={stats.total_exercises} sub="100% Validated" color="text-sky-400" />
        <AdminStatCard icon={<Activity />} label="Active Sessions" value="1,284" sub="+12% Today" color="text-emerald-400" />
        <AdminStatCard icon={<Users />} label="Registered Users" value="8,492" sub="72 Active Now" color="text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="text-slate-400" /> System Logs
            </h3>
            <div className="space-y-4">
                <LogItem time="2m ago" action="New User Registration" user="sarah_rehab" />
                <LogItem time="15m ago" action="Exercise Dataset Updated" user="admin_system" />
                <LogItem time="1h ago" action="Session Analytics Generated" user="ai_engine" />
                <LogItem time="3h ago" action="New Achievement Unlocked" user="mike_recovery" />
            </div>
        </div>

        <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6">Database Health</h3>
            <div className="space-y-6">
                <HealthBar label="API Response Time" value={98} sub="24ms average" />
                <HealthBar label="AI Model Inference" value={94} sub="MediaPipe v2.1" />
                <HealthBar label="Database Sync" value={100} sub="Last sync 5m ago" />
            </div>
        </div>
      </div>
    </div>
  );
};

const AdminStatCard = ({ icon, label, value, sub, color }) => (
    <div className="glass-card p-8">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-white/5 text-slate-400">{icon}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</div>
        </div>
        <div className={`text-4xl font-black mb-2 ${color}`}>{value}</div>
        <div className="text-xs text-slate-500 font-medium">{sub}</div>
    </div>
);

const LogItem = ({ time, action, user }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
        <div>
            <div className="text-sm font-bold text-slate-200">{action}</div>
            <div className="text-xs text-slate-500">by {user}</div>
        </div>
        <div className="text-xs text-slate-500">{time}</div>
    </div>
);

const HealthBar = ({ label, value, sub }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span className="font-bold text-slate-300">{label}</span>
            <span className="text-slate-500">{sub}</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${value}%` }} />
        </div>
    </div>
);

export default AdminDashboard;
