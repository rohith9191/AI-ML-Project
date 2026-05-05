from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user') # user, therapist, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exercise_name = db.Column(db.String(200), nullable=False)
    body_part = db.Column(db.String(100))
    condition = db.Column(db.String(200))
    equipment = db.Column(db.String(100))
    reps_sets = db.Column(db.String(50))
    duration = db.Column(db.String(50))
    intensity_level = db.Column(db.String(50))
    goal = db.Column(db.String(200))

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'), nullable=False)
    duration_seconds = db.Column(db.Integer)
    accuracy_score = db.Column(db.Float)
    stability_score = db.Column(db.Float)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    feedback = db.Column(db.Text)

class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100))
    description = db.Column(db.String(255))
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)
