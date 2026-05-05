import React, { useState, useEffect, useCallback } from 'react';
import { exerciseApi } from '../hooks/api';
import { Search, Play, X, SlidersHorizontal, Clock, Dumbbell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BodyMap from '../components/BodyMap';

const INTENSITY_LEVELS = ['Low', 'Medium', 'High'];
const CONDITIONS = [
  'Stroke Recovery', 'Chronic Pain', 'Post Surgery', 'Sports Injury',
  'Lower Back Pain', 'Arthritis', 'Osteoporosis', 'Knee Pain',
  'Shoulder Pain', 'Neck Pain', 'Mobility Issue', 'Balance Disorder'
];

const ExerciseDiscovery = () => {
  const [exercises, setExercises] = useState([]);
  const [filters, setFilters] = useState({ body_part: '', condition: '', intensity: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Debounced fetch
  useEffect(() => {
    const delay = setTimeout(fetchExercises, 400);
    return () => clearTimeout(delay);
  }, [filters]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await exerciseApi.getAll(filters);
      setExercises(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = (key) => setFilters(f => ({ ...f, [key]: '' }));
  const activeFilters = Object.entries(filters).filter(([, v]) => v);

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black mb-1">Discover Exercises</h1>
          <p className="text-slate-400">
            {loading ? 'Searching...' : `${exercises.length} exercises found`}
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full py-3 pl-11 pr-4 rounded-xl outline-none transition-colors text-sm"
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0'
              }}
            />
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="glass-btn px-4 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilters.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center" style={{ background: '#0ea5e9' }}>
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map(([key, val]) => (
            <motion.span
              key={key}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', color: '#38bdf8' }}
            >
              {val}
              <button onClick={() => clearFilter(key)}><X className="w-3 h-3" /></button>
            </motion.span>
          ))}
          <button
            onClick={() => setFilters({ body_part: '', condition: '', intensity: '', search: '' })}
            className="text-xs text-slate-500 hover:text-white transition-colors underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Condition</label>
                <select
                  value={filters.condition}
                  onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))}
                  className="w-full py-2.5 px-4 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
                >
                  <option value="">All Conditions</option>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Intensity</label>
                <div className="flex gap-2">
                  {INTENSITY_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setFilters(f => ({ ...f, intensity: f.intensity === level ? '' : level }))}
                      className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: filters.intensity === level ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${filters.intensity === level ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        color: filters.intensity === level ? '#38bdf8' : '#94a3b8'
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Body Part Filter</label>
                <div className="text-xs text-slate-500">Use the anatomy map to filter by body region</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Body Map Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-5 sticky top-28">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">Anatomy Filter</h3>
              {filters.body_part && (
                <button onClick={() => clearFilter('body_part')} className="text-xs flex items-center gap-1" style={{ color: '#38bdf8' }}>
                  Clear <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <BodyMap onSelectPart={part => setFilters(f => ({ ...f, body_part: part }))} selectedPart={filters.body_part} />
            {filters.body_part && (
              <div className="mt-4 p-2 rounded-lg text-center text-xs font-bold" style={{ background: 'rgba(14,165,233,0.1)', color: '#38bdf8' }}>
                Filtering: {filters.body_part}
              </div>
            )}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card h-52 animate-pulse-slow" />
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No exercises found</h3>
              <p className="text-slate-400">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AnimatePresence>
                {exercises.map(ex => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    onClick={() => setSelectedExercise(ex)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const ExerciseCard = ({ exercise, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -4 }}
    className="glass-card p-5 flex flex-col cursor-pointer hover:border-sky-500/30 transition-all group"
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-3">
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider" style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8' }}>
        {exercise.body_part}
      </span>
      <IntensityBadge level={exercise.intensity} />
    </div>

    <h3 className="text-lg font-bold mb-1 group-hover:text-sky-400 transition-colors">{exercise.name}</h3>
    <p className="text-slate-400 text-xs mb-4 line-clamp-2">{exercise.goal}</p>

    <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exercise.duration}</span>
        <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{exercise.equipment || 'None'}</span>
      </div>
      <div className="flex gap-2">
        <button
          className="text-xs font-bold flex items-center gap-1 transition-colors"
          style={{ color: '#64748b' }}
          onClick={e => { e.stopPropagation(); }}
        >
          Details <ChevronRight className="w-3 h-3" />
        </button>
        <Link
          to={`/session/${exercise.id}`}
          onClick={e => e.stopPropagation()}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          style={{ background: '#0ea5e9', boxShadow: '0 0 12px rgba(14,165,233,0.4)' }}
        >
          <Play className="text-white fill-white w-3 h-3" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const ExerciseModal = ({ exercise, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 30 }}
      className="glass-card p-8 max-w-lg w-full"
      style={{ borderColor: 'rgba(14,165,233,0.2)' }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase" style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8' }}>
            {exercise.body_part}
          </span>
          <h2 className="text-2xl font-black mt-3">{exercise.name}</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <DetailCell label="Condition" value={exercise.condition} />
        <DetailCell label="Intensity" value={exercise.intensity} />
        <DetailCell label="Duration" value={exercise.duration} />
        <DetailCell label="Reps / Sets" value={exercise.reps_sets} />
        <DetailCell label="Equipment" value={exercise.equipment || 'None'} />
        <DetailCell label="Goal" value={exercise.goal} />
      </div>

      <Link
        to={`/session/${exercise.id}`}
        className="primary-btn w-full py-4 rounded-2xl font-black text-lg justify-center"
        onClick={onClose}
      >
        <Play className="w-5 h-5 fill-white" /> Start AI Session
      </Link>
    </motion.div>
  </motion.div>
);

const DetailCell = ({ label, value }) => (
  <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</div>
    <div className="text-sm text-slate-200 font-medium">{value}</div>
  </div>
);

const IntensityBadge = ({ level }) => {
  const colors = {
    Low: { bg: 'rgba(16,185,129,0.15)', text: '#34d399' },
    Medium: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24' },
    High: { bg: 'rgba(244,63,94,0.15)', text: '#fb7185' },
  };
  const c = colors[level] || colors.Medium;
  return (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
      {level}
    </span>
  );
};

export default ExerciseDiscovery;
