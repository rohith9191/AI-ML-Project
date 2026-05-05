import React, { useState, useEffect } from 'react';
import { Activity, Users, Clock, CheckCircle, ArrowRight, Filter } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const patients = [
  { id: 1, name: "Sarah Connor", condition: "Post Surgery", progress: 85, lastSession: "2h ago", status: "Active" },
  { id: 2, name: "John Doe", condition: "Stroke Recovery", progress: 42, lastSession: "1d ago", status: "Struggling" },
  { id: 3, name: "Mike Ross", condition: "Lower Back Pain", progress: 92, lastSession: "4h ago", status: "Active" },
];

const TherapistDashboard = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 text-gradient">Therapist Portal</h1>
          <p className="text-slate-500 font-medium">Monitor your patients' recovery in real-time</p>
        </div>
        <div className="flex gap-4">
            <button className="glass-btn"><Filter className="w-4 h-4" /> Filter Patients</button>
            <button className="primary-btn">Add New Patient</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Patient List */}
        <div className="lg:col-span-3 space-y-6">
            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-4">Patient</th>
                            <th className="px-8 py-4">Condition</th>
                            <th className="px-8 py-4">Recovery Progress</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {patients.map(p => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-bold text-slate-200">{p.name}</div>
                                    <div className="text-xs text-slate-500">Last seen: {p.lastSession}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold">
                                        {p.condition}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-500" style={{ width: `${p.progress}%` }} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-400">{p.progress}%</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                    }`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 group-hover:text-white">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detailed Analytics for Selected Patient */}
            <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-8">Group Performance Overview</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                            { x: 'Week 1', y: 40 },
                            { x: 'Week 2', y: 55 },
                            { x: 'Week 3', y: 48 },
                            { x: 'Week 4', y: 70 },
                            { x: 'Week 5', y: 82 },
                        ]}>
                            <XAxis dataKey="x" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                            <Line type="monotone" dataKey="y" stroke="#0ea5e9" strokeWidth={4} dot={{ fill: '#0ea5e9' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
            <TherapistStatCard icon={<Users />} label="Assigned Patients" value="24" sub="2 New this week" />
            <TherapistStatCard icon={<Activity />} label="Sessions Today" value="18" sub="92% Completion" />
            <TherapistStatCard icon={<Clock />} label="Average Duration" value="22m" sub="Per session" />
            
            <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="text-indigo-400 w-5 h-5" /> Pending Reviews
                </h4>
                <div className="space-y-4">
                    <div className="text-xs p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="font-bold text-slate-200">Sarah Connor</div>
                        <div className="text-slate-500">Completed "Wall Push-Ups" with 98% accuracy.</div>
                    </div>
                    <div className="text-xs p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="font-bold text-slate-200">John Doe</div>
                        <div className="text-slate-500">Stability issues detected in 3 consecutive reps.</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const TherapistStatCard = ({ icon, label, value, sub }) => (
    <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-white/5 text-sky-400">{icon}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{label}</div>
        </div>
        <div className="text-3xl font-black mb-1">{value}</div>
        <div className="text-xs text-slate-500">{sub}</div>
    </div>
);

export default TherapistDashboard;
