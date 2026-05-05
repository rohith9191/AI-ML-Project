import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../hooks/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.signup(formData);
      navigate('/login');
    } catch (err) {
      setError('Signup failed. Email might already be registered.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Activity className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black mb-2">Create Account</h1>
          <p className="text-slate-400">Join the AI-powered recovery ecosystem</p>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-sky-500 outline-none transition-colors"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="email" 
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-sky-500 outline-none transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="password" 
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-sky-500 outline-none transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full primary-btn py-4 rounded-xl text-lg font-black mt-6 bg-gradient-to-r from-sky-500 to-indigo-500">
            Sign Up <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500">
          Already have an account? <Link to="/login" className="text-sky-400 font-bold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
