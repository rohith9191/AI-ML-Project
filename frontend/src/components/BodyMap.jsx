import React, { useState } from 'react';
import { motion } from 'framer-motion';

const bodyParts = [
  { id: 'Neck', label: 'Neck', path: 'M 90,52 L 90,62 L 110,62 L 110,52 Q 100,45 90,52 Z' },
  { id: 'Shoulder', label: 'Shoulder', path: 'M 60,65 L 90,62 L 90,80 L 65,80 Z M 110,62 L 140,65 L 135,80 L 110,80 Z' },
  { id: 'Arm', label: 'Arm', path: 'M 55,82 L 60,115 L 72,115 L 68,82 Z M 128,82 L 132,115 L 145,115 L 140,82 Z' },
  { id: 'Wrist', label: 'Wrist', path: 'M 55,117 L 55,128 L 70,128 L 70,117 Z M 130,117 L 130,128 L 145,128 L 145,117 Z' },
  { id: 'Core', label: 'Core', path: 'M 80,82 L 120,82 L 117,130 L 83,130 Z' },
  { id: 'Back', label: 'Back', path: 'M 80,82 L 120,82 L 117,130 L 83,130 Z' },
  { id: 'Hip', label: 'Hip', path: 'M 80,133 L 120,133 L 118,155 L 82,155 Z' },
  { id: 'Leg', label: 'Leg', path: 'M 80,157 L 80,215 L 95,215 L 95,157 Z M 105,157 L 105,215 L 120,215 L 120,157 Z' },
  { id: 'Knee', label: 'Knee', path: 'M 79,217 L 95,217 L 95,230 L 79,230 Z M 105,217 L 121,217 L 121,230 L 105,230 Z' },
  { id: 'Ankle', label: 'Ankle', path: 'M 78,232 L 96,232 L 94,248 L 80,248 Z M 104,232 L 122,232 L 120,248 L 106,248 Z' },
];

const BodyMap = ({ onSelectPart, selectedPart }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 280" className="w-full max-w-[180px] h-auto">
        {/* Head */}
        <circle
          cx="100" cy="35" r="22"
          fill={selectedPart === 'Head' || hovered === 'Head' ? '#0ea5e9' : '#1e293b'}
          stroke="#334155" strokeWidth="1"
          className="cursor-pointer transition-all duration-200"
          onMouseEnter={() => setHovered('Head')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelectPart('Head')}
        />

        {/* Body parts */}
        {bodyParts.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i).map(part => {
          const isActive = selectedPart === part.id;
          const isHovered = hovered === part.id;
          return (
            <path
              key={part.id}
              d={bodyParts.filter(p2 => p2.id === part.id).map(p2 => p2.path).join(' ')}
              fill={isActive ? '#0ea5e9' : isHovered ? 'rgba(14,165,233,0.6)' : '#1e293b'}
              stroke={isActive ? '#38bdf8' : '#334155'}
              strokeWidth="1"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHovered(part.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectPart(part.id === selectedPart ? '' : part.id)}
            />
          );
        })}
      </svg>

      {/* Label */}
      <div className="mt-3 h-6 text-center">
        {(hovered || selectedPart) && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: 'rgba(14,165,233,0.2)', color: '#38bdf8' }}
          >
            {hovered || selectedPart}
          </motion.span>
        )}
      </div>

      <p className="text-[11px] text-slate-600 text-center mt-2">Click a region to filter</p>
    </div>
  );
};

export default BodyMap;
