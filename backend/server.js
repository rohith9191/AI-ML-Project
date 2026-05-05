const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectDB, User, Exercise, Session, Achievement } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET_KEY || 'secret';

app.use(cors());
app.use(express.json());

connectDB();

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password_hash: hash, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign({ id: user._id, role: user.role }, SECRET);
      res.json({
        access_token: token,
        user: { id: user._id, username: user.username, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Exercise Routes
app.get('/api/exercises', async (req, res) => {
  const { body_part, condition, intensity, search } = req.query;
  const filter = {};

  if (body_part) filter.body_part = { $regex: body_part, $options: 'i' };
  if (condition) filter.condition = { $regex: condition, $options: 'i' };
  if (intensity) filter.intensity_level = { $regex: intensity, $options: 'i' };
  if (search) filter.exercise_name = { $regex: search, $options: 'i' };

  try {
    const exercises = await Exercise.find(filter).limit(100);
    res.json(exercises.map(r => ({
      id: r._id,
      name: r.exercise_name,
      body_part: r.body_part,
      condition: r.condition,
      equipment: r.equipment,
      reps_sets: r.reps_sets,
      duration: r.duration,
      intensity: r.intensity_level,
      goal: r.goal
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single Exercise by ID
app.get('/api/exercises/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
    res.json({
      id: exercise._id,
      name: exercise.exercise_name,
      body_part: exercise.body_part,
      condition: exercise.condition,
      equipment: exercise.equipment,
      reps_sets: exercise.reps_sets,
      duration: exercise.duration,
      intensity: exercise.intensity_level,
      goal: exercise.goal
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/recommendations', async (req, res) => {
  const { condition, goal } = req.query;
  const filter = {};
  if (condition) filter.condition = condition;
  if (goal) filter.goal = { $regex: goal, $options: 'i' };

  try {
    const exercises = await Exercise.aggregate([
      { $match: filter },
      { $sample: { size: 4 } }
    ]);
    res.json(exercises.map(r => ({
      id: r._id,
      name: r.exercise_name,
      body_part: r.body_part,
      condition: r.condition,
      equipment: r.equipment,
      reps_sets: r.reps_sets,
      duration: r.duration,
      intensity: r.intensity_level,
      goal: r.goal
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const total = await Exercise.countDocuments();
    const conditions = (await Exercise.distinct('condition')).length;
    const body_parts = (await Exercise.distinct('body_part')).length;
    res.json({
      total_exercises: total,
      total_conditions: conditions,
      total_body_parts: body_parts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/achievements/:userId', async (req, res) => {
    try {
        const achs = await Achievement.find({ user_id: req.params.userId });
        res.json(achs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sessions', async (req, res) => {
    const { user_id, exercise_id, duration_seconds, accuracy_score, stability_score, feedback } = req.body;
    try {
        const session = new Session({ user_id, exercise_id, duration_seconds, accuracy_score, stability_score, feedback });
        await session.save();
        
        // Achievement Logic
        const count = await Session.countDocuments({ user_id });
        if (count === 1) {
            await unlockAchievement(user_id, "First Step", "Completed your first rehabilitation session.");
        } else if (count === 5) {
            await unlockAchievement(user_id, "Consistent Recoverer", "Completed 5 sessions. Keep it up!");
        }

        res.status(201).json({ message: 'Session saved', id: session._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function unlockAchievement(userId, title, description) {
    const ach = new Achievement({ user_id: userId, title, description });
    await ach.save();
}

app.get('/api/sessions/history/:userId', async (req, res) => {
    try {
        const history = await Session.find({ user_id: req.params.userId })
            .populate('exercise_id')
            .sort({ completed_at: -1 })
            .limit(10);
        
        res.json(history.map(s => ({
            id: s._id,
            exercise_name: s.exercise_id ? s.exercise_id.exercise_name : 'Unknown Exercise',
            completed_at: s.completed_at,
            duration_seconds: s.duration_seconds,
            accuracy_score: s.accuracy_score
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
