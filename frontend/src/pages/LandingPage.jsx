import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronRight, Shield, Zap, Camera, Activity, Users, Brain, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exerciseApi } from '../hooks/api';

// Animated counter hook
const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
};

const LandingPage = () => {
  const [stats, setStats] = useState({ total_exercises: 0, total_conditions: 0, total_body_parts: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    exerciseApi.getStats()
      .then(res => {
        setStats(res.data);
        setStatsLoaded(true);
      })
      .catch(() => {
        // Fallback if backend is offline
        setStats({ total_exercises: 10000, total_conditions: 50, total_body_parts: 12 });
        setStatsLoaded(true);
      });
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-6 text-center">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-10 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.15), transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-bold"
            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', color: '#38bdf8' }}
          >
            <Brain className="w-4 h-4" /> AI-Powered Rehabilitation Platform
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
            REHABILITATION<br />
            <span className="text-gradient">REIMAGINED WITH AI</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Enterprise-grade physical therapy powered by real-time pose estimation.
            Recover faster with personalized AI guidance and clinical-level monitoring.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="primary-btn text-lg px-10 py-4 rounded-full">
              Start Recovery Journey <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/exercises" className="glass-btn text-lg px-10 py-4 rounded-full">
              Explore Exercises
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Stats Section — Dynamic from Backend */}
      <div className="px-6 max-w-5xl mx-auto -mt-10 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <DynamicStat value={stats.total_exercises} suffix="+" label="Exercise Records" color="#38bdf8" loaded={statsLoaded} />
            <DynamicStat value={stats.total_conditions} suffix="+" label="Conditions Covered" color="#818cf8" loaded={statsLoaded} />
            <DynamicStat value={stats.total_body_parts} suffix="" label="Body Regions" color="#34d399" loaded={statsLoaded} />
            <DynamicStat value={98} suffix="%" label="Pose Accuracy" color="#fb923c" loaded={statsLoaded} />
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="px-6 max-w-7xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">Everything You Need to <span className="text-gradient">Recover</span></h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">A complete AI ecosystem designed around your rehabilitation journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-8 group cursor-default"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 max-w-4xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(99,102,241,0.1))', borderColor: 'rgba(14,165,233,0.2)' }}
        >
          <Heart className="w-12 h-12 mx-auto mb-6" style={{ color: '#f43f5e' }} />
          <h2 className="text-4xl font-black mb-4">Start Your Recovery Today</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join thousands of patients using AI-powered therapy to recover faster and smarter.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="primary-btn text-lg px-10 py-4 rounded-full">
              Get Started Free <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/exercises" className="glass-btn text-lg px-10 py-4 rounded-full">
              Browse Exercises
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DynamicStat = ({ value, suffix, label, color, loaded }) => {
  const count = useCounter(loaded ? value : 0, 2000);
  return (
    <div>
      <div className="text-4xl md:text-5xl font-black mb-2" style={{ color }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-500 font-medium uppercase tracking-widest text-xs">{label}</div>
    </div>
  );
};

const features = [
  {
    icon: <Camera className="text-sky-400 w-6 h-6" />,
    bg: 'rgba(14, 165, 233, 0.15)',
    title: 'Live Pose Monitoring',
    description: 'Real-time joint tracking and posture correction using your device camera with MediaPipe AI.'
  },
  {
    icon: <Shield className="text-indigo-400 w-6 h-6" />,
    bg: 'rgba(99, 102, 241, 0.15)',
    title: 'Clinically Backed',
    description: '10,000+ exercise records tailored for specific conditions and recovery goals from verified sources.'
  },
  {
    icon: <Zap className="text-rose-400 w-6 h-6" />,
    bg: 'rgba(244, 63, 94, 0.15)',
    title: 'Instant AI Feedback',
    description: 'AI-powered voice assistance that guides you through every movement in real time.'
  },
  {
    icon: <Activity className="text-emerald-400 w-6 h-6" />,
    bg: 'rgba(16, 185, 129, 0.15)',
    title: 'Session Analytics',
    description: 'Detailed performance reports with accuracy scores, stability metrics, and improvement trends.'
  },
  {
    icon: <Brain className="text-amber-400 w-6 h-6" />,
    bg: 'rgba(245, 158, 11, 0.15)',
    title: 'AI Recommendations',
    description: 'Personalized exercise plans based on your condition, goals, and recovery progress.'
  },
  {
    icon: <Users className="text-purple-400 w-6 h-6" />,
    bg: 'rgba(168, 85, 247, 0.15)',
    title: 'Therapist Portal',
    description: 'Healthcare professionals can monitor patient progress and assign custom rehabilitation plans.'
  },
];

export default LandingPage;
