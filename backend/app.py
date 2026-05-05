from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db, Exercise, User
import os
from dotenv import load_dotenv

from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///rehab.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')

CORS(app)
db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

@app.route('/api/exercises', methods=['GET'])
def get_exercises():
    body_part = request.args.get('body_part')
    condition = request.args.get('condition')
    intensity = request.args.get('intensity')
    search = request.args.get('search')
    
    query = Exercise.query
    
    if body_part:
        query = query.filter(Exercise.body_part == body_part)
    if condition:
        query = query.filter(Exercise.condition == condition)
    if intensity:
        query = query.filter(Exercise.intensity_level == intensity)
    if search:
        query = query.filter(Exercise.exercise_name.ilike(f'%{search}%'))
        
    exercises = query.limit(100).all() # Limit for performance, use pagination later
    
    return jsonify([{
        'id': e.id,
        'name': e.exercise_name,
        'body_part': e.body_part,
        'condition': e.condition,
        'equipment': e.equipment,
        'reps_sets': e.reps_sets,
        'duration': e.duration,
        'intensity': e.intensity_level,
        'goal': e.goal
    } for e in exercises])

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role=data.get('role', 'user')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity={'id': user.id, 'role': user.role})
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_exercises = Exercise.query.count()
    conditions = db.session.query(Exercise.condition).distinct().count()
    body_parts = db.session.query(Exercise.body_part).distinct().count()
    
    return jsonify({
        'total_exercises': total_exercises,
        'total_conditions': conditions,
        'total_body_parts': body_parts
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
