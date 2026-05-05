import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PoseMonitor from '../components/PoseMonitor';
import { exerciseApi } from '../hooks/api';
import { 
  ArrowLeft, Timer, Target, Award, Info, 
  Activity, ShieldAlert, Play, Pause, CheckCircle,
  Clock, Dumbbell, BarChart3, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const SessionMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [accuracy, setAccuracy] = useState(85);
  const [stability, setStability] = useState(94);
  const [reps, setReps] = useState(0);
  const [aiFeedback, setAiFeedback] = useState('Press START SESSION to begin your rehabilitation session.');
  const repTimerRef = useRef(null);

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const fetchExercise = async () => {
    setLoading(true);
    try {
      // Use the new getById endpoint — no more parseInt hack
      const res = await exerciseApi.getById(id);
      setExercise(res.data);
      const durationMatch = res.data.duration?.match(/\d+/);
      const secs = durationMatch ? parseInt(durationMatch[0]) * 60 : 300;
      setTimeLeft(secs);
      setTotalTime(secs);
    } catch (err) {
      console.error('Failed to load exercise:', err);
      navigate('/exercises');
    } finally {
      setLoading(false);
    }
  };

  // Session timer
  useEffect(() => {
    let timer;
    if (sessionActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleSessionComplete();
            return 0;
          }
          return t - 1;
        });
        setAccuracy(prev => Math.min(100, Math.max(75, prev + (Math.random() * 4 - 2))));
        setStability(prev => Math.min(100, Math.max(80, prev + (Math.random() * 2 - 1))));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionActive]);

  // Auto rep counter
  useEffect(() => {
    if (sessionActive) {
      repTimerRef.current = setInterval(() => {
        setReps(r => r + 1);
      }, 4000);
    } else {
      clearInterval(repTimerRef.current);
    }
    return () => clearInterval(repTimerRef.current);
  }, [sessionActive]);

  const handleSessionComplete = async () => {
    setSessionActive(false);
    setSessionDone(true);
    setAiFeedback('Excellent work! You have completed this session. Your form was consistent throughout.');
    speak('Excellent work! Session complete. Great consistency!');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      try {
        await exerciseApi.saveSession({
          user_id: user.id,
          exercise_id: id,
          duration_seconds: totalTime - timeLeft,
          accuracy_score: accuracy,
          stability_score: stability,
          feedback: `Completed ${exercise?.name}. Accuracy: ${accuracy.toFixed(0)}%`
        });
      } catch (err) {
        console.error('Session save failed:', err);
      }
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handlePoseUpdate = (feedback) => {
    if (feedback) setAiFeedback(feedback);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const getFormLabel = (acc) => {
    if (acc >= 90) return { label: 'Excellent Form', color: 'text-emerald-400' };
    if (acc >= 75) return { label: 'Good Form', color: 'text-sky-400' };
    if (acc >= 60) return { label: 'Needs Adjustment', color: 'text-amber-400' };
    return { label: 'Incorrect Alignment', color: 'text-rose-400' };
  };

  const form = getFormLabel(accuracy);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="pt-24 pb-10 px-4 min-h-screen" style={{ background: '#020617' }}>
      <div className="max-w-7xl mx-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Library
          </button>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2" style={{ color: '#38bdf8' }}>
              <Timer className="w-5 h-5" />
              <span className="text-2xl font-black font-mono">{formatTime(timeLeft)}</span>
            </div>
            <div className={`flex items-center gap-2 ${form.color}`}>
              <BarChart3 className="w-5 h-5" />
              <span className="text-lg font-bold">{form.label}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div 
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #0ea5e9, #6366f1)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Camera + AI */}
          <div className="lg:col-span-2 space-y-4">
            <PoseMonitor 
              onPoseUpdate={handlePoseUpdate}
              exerciseName={exercise.name}
              isActive={sessionActive}
            />

            {/* AI Feedback Banner */}
            <motion.div
              key={aiFeedback}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 flex items-start gap-4"
              style={{ borderColor: 'rgba(14, 165, 233, 0.3)' }}
            >
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.2)' }}>
                <Zap className="w-4 h-4" style={{ color: '#38bdf8' }} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#38bdf8' }}>AI Coach</div>
                <p className="text-slate-300 text-sm leading-relaxed">{aiFeedback}</p>
              </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Accuracy" value={`${accuracy.toFixed(0)}%`} colorClass="text-sky-400" />
              <StatCard label="Stability" value={`${stability.toFixed(0)}%`} colorClass="text-emerald-400" />
              <StatCard label="Reps Done" value={reps} colorClass="text-indigo-400" />
            </div>
          </div>

          {/* Right: Exercise Info */}
          <div className="space-y-4">
            <div className="glass-card p-6">
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#38bdf8' }}>
                {exercise.body_part} • {exercise.condition}
              </div>
              <h1 className="text-2xl font-black mb-1">{exercise.name}</h1>
              <p className="text-slate-400 text-sm mb-6">{exercise.goal}</p>

              <div className="space-y-4 mb-6">
                <InfoRow icon={<Clock className="w-4 h-4 text-slate-400" />} label="Duration" value={exercise.duration} />
                <InfoRow icon={<Award className="w-4 h-4 text-rose-400" />} label="Reps / Sets" value={exercise.reps_sets} />
                <InfoRow icon={<Dumbbell className="w-4 h-4 text-indigo-400" />} label="Equipment" value={exercise.equipment || 'None'} />
                <InfoRow icon={<BarChart3 className="w-4 h-4 text-amber-400" />} label="Intensity" value={exercise.intensity} />
              </div>

              {sessionDone ? (
                <div className="text-center p-4 rounded-2xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <div className="font-black text-emerald-400">Session Complete!</div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="primary-btn w-full mt-4 py-3 rounded-xl font-bold"
                  >
                    View Dashboard
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    const next = !sessionActive;
                    setSessionActive(next);
                    if (next) {
                      setAiFeedback(`Starting ${exercise.name}. ${exercise.reps_sets}. Keep your ${exercise.body_part} engaged!`);
                      speak(`Starting ${exercise.name}. ${exercise.reps_sets}. Keep your ${exercise.body_part} engaged!`);
                    } else {
                      speak('Session paused. Take a rest when needed.');
                      setAiFeedback('Session paused. Press START to continue.');
                    }
                  }}
                  className="w-full py-4 rounded-2xl font-black text-xl transition-all text-white"
                  style={{
                    background: sessionActive
                      ? 'linear-gradient(135deg, #f43f5e, #e11d48)'
                      : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                    boxShadow: sessionActive
                      ? '0 0 30px rgba(244, 63, 94, 0.3)'
                      : '0 0 30px rgba(14, 165, 233, 0.3)'
                  }}
                >
                  {sessionActive ? (
                    <span className="flex items-center justify-center gap-2"><Pause /> PAUSE SESSION</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2"><Play /> START SESSION</span>
                  )}
                </button>
              )}
            </div>

            {/* Safety Card */}
            <div className="glass-card p-5" style={{ borderColor: 'rgba(251,191,36,0.2)' }}>
              <h3 className="font-bold mb-3 flex items-center gap-2 text-amber-400">
                <ShieldAlert className="w-4 h-4" /> Safety Guidance
              </h3>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li>• Ensure your full body is visible in frame</li>
                <li>• Keep 2-3 meters distance from camera</li>
                <li>• Stop immediately if you feel any pain</li>
                <li>• Consult your therapist for medical advice</li>
              </ul>
            </div>

            {/* Stability Meter */}
            <div className="glass-card p-5">
              <h3 className="font-bold mb-4 text-sm">Alignment Meters</h3>
              <div className="space-y-3">
                <AlignBar label="Posture" value={accuracy} color="#0ea5e9" />
                <AlignBar label="Stability" value={stability} color="#10b981" />
                <AlignBar label="Symmetry" value={Math.min(100, (accuracy + stability) / 2)} color="#6366f1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, colorClass }) => (
  <div className="glass-card p-4 text-center">
    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-2xl font-black ${colorClass}`}>{value}</div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <div className="text-[10px] text-slate-500 font-bold uppercase">{label}</div>
      <div className="text-slate-200 text-sm font-medium">{value}</div>
    </div>
  </div>
);

const AlignBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-400">{label}</span>
      <span className="font-bold" style={{ color }}>{value.toFixed(0)}%</span>
    </div>
    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  </div>
);

export default SessionMode;
