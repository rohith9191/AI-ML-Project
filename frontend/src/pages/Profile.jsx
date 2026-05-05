import React, { useState, useEffect } from 'react';
import { User, Shield, Target, Activity, Heart, Save } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [profileData, setProfileData] = useState({
    condition: 'Stroke Recovery',
    goal: 'Improve Balance',
    intensity_preference: 'Medium',
    equipment_available: 'None'
  });

  const handleSave = () => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
    alert("Profile updated successfully!");
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
          {user.username ? user.username[0].toUpperCase() : 'U'}
        </div>
        <div>
          <h1 className="text-4xl font-black">{user.username}</h1>
          <p className="text-slate-500">{user.email} • Member since 2024</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Details */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="text-sky-400" /> Account Information
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Username</div>
                <div className="text-slate-200">{user.username}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Email</div>
                <div className="text-slate-200">{user.email}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Role</div>
                <div className="text-indigo-400 font-bold capitalize">{user.role}</div>
            </div>
          </div>
        </div>

        {/* Health & Rehabilitation Profile */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Heart className="text-rose-400" /> Rehabilitation Profile
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs text-slate-500 font-bold uppercase ml-1">Primary Condition</label>
                <select 
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors"
                    value={profileData.condition}
                    onChange={(e) => setProfileData({...profileData, condition: e.target.value})}
                >
                    <option>Stroke Recovery</option>
                    <option>Chronic Pain</option>
                    <option>Post Surgery</option>
                    <option>Sports Injury</option>
                    <option>Mobility Issue</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-500 font-bold uppercase ml-1">Main Goal</label>
                <select 
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors"
                    value={profileData.goal}
                    onChange={(e) => setProfileData({...profileData, goal: e.target.value})}
                >
                    <option>Improve Balance</option>
                    <option>Increase Flexibility</option>
                    <option>Strengthen Muscles</option>
                    <option>Reduce Pain</option>
                    <option>Improve Mobility</option>
                </select>
            </div>

            <button 
                onClick={handleSave}
                className="w-full primary-btn py-4 rounded-xl font-bold mt-4"
            >
                <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="md:col-span-2 glass-card p-8 bg-indigo-500/5 border-indigo-500/20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                        <Activity />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">Clinical Compliance</div>
                        <div className="text-sm text-slate-500">Based on your activity last 30 days</div>
                    </div>
                </div>
                <div className="text-5xl font-black text-indigo-400">92%</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
