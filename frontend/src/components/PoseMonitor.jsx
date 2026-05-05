import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Pose } from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { Volume2, Activity, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Exercise-specific coaching messages
const EXERCISE_TIPS = {
  default: [
    "Keep breathing steadily throughout the movement.",
    "Maintain a neutral spine. Engage your core.",
    "Great effort! Stay consistent with the rhythm.",
    "Slow and controlled movements are more effective.",
    "You're doing great! Keep it up!",
  ]
};

const PoseMonitor = ({ onPoseUpdate, exerciseName = '', isActive = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const [feedback, setFeedback] = useState("Position yourself in front of the camera to begin.");
  const [isReady, setIsReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const feedbackTimerRef = useRef(null);
  const lastFeedbackRef = useRef('');
  const tipIndexRef = useRef(0);

  // Rotate motivational tips every 8 seconds during active session
  useEffect(() => {
    if (!isActive) return;
    feedbackTimerRef.current = setInterval(() => {
      const tips = EXERCISE_TIPS.default;
      tipIndexRef.current = (tipIndexRef.current + 1) % tips.length;
      const tip = tips[tipIndexRef.current];
      setFeedback(tip);
      speakIfNew(tip);
    }, 8000);
    return () => clearInterval(feedbackTimerRef.current);
  }, [isActive]);

  const speakIfNew = useCallback((text) => {
    if (!isActive) return;
    if (text === lastFeedbackRef.current) return;
    lastFeedbackRef.current = text;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [isActive]);

  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  const onResults = useCallback((results) => {
    if (!results.poseLandmarks) return;
    setIsReady(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame slightly dimmed
    if (results.image) {
      ctx.globalAlpha = 0.6;
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1.0;
    }

    // Skeleton
    drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: 'rgba(14, 165, 233, 0.85)',
      lineWidth: 3,
    });
    drawLandmarks(ctx, results.poseLandmarks, {
      color: '#f8fafc',
      fillColor: '#0ea5e9',
      lineWidth: 1,
      radius: 5,
    });
    ctx.restore();

    if (!isActive) {
      if (onPoseUpdate) onPoseUpdate(null);
      return;
    }

    // Posture Analysis
    const lm = results.poseLandmarks;
    let newFeedback = null;

    // Shoulder symmetry
    if (lm[11] && lm[12]) {
      const diff = Math.abs(lm[11].y - lm[12].y);
      if (diff > 0.12) {
        newFeedback = "Level your shoulders — keep them even on both sides.";
      }
    }

    // Hip/Spine alignment (Shoulder → Hip → Knee)
    if (lm[11] && lm[23] && lm[25]) {
      const hipAngle = calculateAngle(lm[11], lm[23], lm[25]);
      if (hipAngle < 145) {
        newFeedback = "Keep your back straight! Engage your core and raise your hips.";
      }
    }

    // Elbow angle (arm exercises)
    if (lm[11] && lm[13] && lm[15]) {
      const elbowAngle = calculateAngle(lm[11], lm[13], lm[15]);
      if (elbowAngle < 60) {
        newFeedback = "Great curl! Now extend fully back for maximum benefit.";
      } else if (elbowAngle > 170) {
        newFeedback = "Full extension — now bring it back in slowly and controlled.";
      }
    }

    // Knee alignment (leg exercises)
    if (lm[23] && lm[25] && lm[27]) {
      const kneeAngle = calculateAngle(lm[23], lm[25], lm[27]);
      if (kneeAngle < 90) {
        newFeedback = "Deep squat detected! Ensure your knees stay over your toes.";
      }
    }

    if (newFeedback && newFeedback !== lastFeedbackRef.current) {
      setFeedback(newFeedback);
      speakIfNew(newFeedback);
      if (onPoseUpdate) onPoseUpdate(newFeedback);
    }
  }, [isActive, onPoseUpdate, speakIfNew]);

  useEffect(() => {
    let pose;
    let camera;

    const init = async () => {
      try {
        pose = new Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });
        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        pose.onResults(onResults);

        if (videoRef.current) {
          camera = new cam.Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current) await pose.send({ image: videoRef.current });
            },
            width: 1280,
            height: 720,
          });
          cameraRef.current = camera;
          await camera.start();
        }
      } catch (err) {
        console.error('Camera/Pose init error:', err);
        setCameraError(true);
      }
    };

    init();

    return () => {
      if (camera) camera.stop().catch(() => {});
      if (pose) pose.close().catch(() => {});
      window.speechSynthesis.cancel();
    };
  }, []);

  // Update onResults when isActive changes
  useEffect(() => {
    // When session goes active, greet the user
    if (isActive && exerciseName) {
      const greeting = `Starting ${exerciseName}. Get into position and follow the on-screen guidance.`;
      setFeedback(greeting);
      speakIfNew(greeting);
    } else if (!isActive) {
      setFeedback("Session paused. Press START SESSION when ready.");
    }
  }, [isActive, exerciseName]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
      style={{
        aspectRatio: '16/9',
        border: `2px solid ${isReady && isActive ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: isReady && isActive ? '0 0 40px rgba(14,165,233,0.15)' : 'none',
        transition: 'box-shadow 0.5s, border-color 0.5s',
        background: '#0a0f1e'
      }}
    >
      {/* Hidden video element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
        playsInline
        muted
      />

      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={1280}
        height={720}
      />

      {/* Camera error state */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(10,15,30,0.9)' }}>
          <WifiOff className="w-16 h-16 text-rose-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Camera Unavailable</h3>
          <p className="text-slate-400 text-sm text-center max-w-xs">
            Please allow camera access in your browser settings and reload the page.
          </p>
        </div>
      )}

      {/* Placeholder when no pose detected yet */}
      {!isReady && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(14,165,233,0.15)', border: '2px solid rgba(14,165,233,0.3)' }}
          >
            <Activity className="w-10 h-10" style={{ color: '#38bdf8' }} />
          </motion.div>
          <p className="text-slate-400 text-sm">Initializing AI pose detection...</p>
          <p className="text-slate-600 text-xs mt-1">Please allow camera access when prompted</p>
        </div>
      )}

      {/* Status Badge - Top Left */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <motion.div
          animate={isReady && isActive ? { opacity: [1, 0.4, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: isReady && isActive
              ? 'rgba(16,185,129,0.2)'
              : isReady
                ? 'rgba(245,158,11,0.2)'
                : 'rgba(239,68,68,0.2)',
            border: `1px solid ${isReady && isActive ? 'rgba(16,185,129,0.4)' : isReady ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}`,
            color: isReady && isActive ? '#34d399' : isReady ? '#fbbf24' : '#f87171'
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
          {isReady && isActive ? 'AI MONITORING ACTIVE' : isReady ? 'READY — AWAITING START' : 'CONNECTING...'}
        </motion.div>
      </div>

      {/* Exercise Name - Top Right */}
      {exerciseName && (
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.6)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {exerciseName}
        </div>
      )}

      {/* AI Feedback - Bottom */}
      <AnimatePresence mode="wait">
        <motion.div
          key={feedback}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(2,6,23,0.85)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: 'rgba(14,165,233,0.2)' }}
            >
              <Volume2 className="w-3.5 h-3.5" style={{ color: '#38bdf8' }} />
            </motion.div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#38bdf8' }}>AI Coach</div>
              <div className="text-white text-sm font-medium leading-snug">{feedback}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PoseMonitor;
