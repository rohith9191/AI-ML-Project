const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Connection Error:', err.message);
    process.exit(1);
  }
};

const ExerciseSchema = new mongoose.Schema({
  exercise_name: String,
  body_part: String,
  condition: String,
  equipment: String,
  reps_sets: String,
  duration: String,
  intensity_level: String,
  goal: String
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  role: { type: String, default: 'user' },
  created_at: { type: Date, default: Date.now }
});

const SessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exercise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  duration_seconds: Number,
  accuracy_score: Number,
  stability_score: Number,
  completed_at: { type: Date, default: Date.now },
  feedback: String
});

const AchievementSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  unlocked_at: { type: Date, default: Date.now }
});

module.exports = {
  connectDB,
  Exercise: mongoose.model('Exercise', ExerciseSchema),
  User: mongoose.model('User', UserSchema),
  Session: mongoose.model('Session', SessionSchema),
  Achievement: mongoose.model('Achievement', AchievementSchema)
};
