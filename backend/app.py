from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from models import db, User, Project, Task
from auth import auth_bp
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# =========================
# CONFIGURATION
# =========================
uri = os.getenv('DATABASE_URL')

# Fix for Railway postgres URL
if uri:
    if uri.startswith('postgres://'):
        uri = uri.replace('postgres://', 'postgresql://', 1)

    # 🔥 IMPORTANT FIX (forces psycopg instead of psycopg2)
    if uri.startswith('postgresql://'):
        uri = uri.replace('postgresql://', 'postgresql+psycopg://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = uri or 'sqlite:///tasks.db'
# =========================
# INIT EXTENSIONS
# =========================
db.init_app(app)
jwt = JWTManager(app)

# Create tables automatically (IMPORTANT for Railway)
with app.app_context():
    db.create_all()

# Register auth routes
app.register_blueprint(auth_bp, url_prefix='/auth')

# =========================
# BASIC ROUTES
# =========================
@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Flask app is running'}), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

# =========================
# PROJECT ROUTES
# =========================
@app.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role == 'admin':
        projects = Project.query.all()
    else:
        projects = Project.query.filter_by(created_by=user_id).all()

    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'created_at': p.created_at.isoformat()
    } for p in projects])

@app.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    user_id = get_jwt_identity()
    data = request.get_json()

    new_project = Project(
        name=data['name'],
        description=data.get('description'),
        created_by=user_id
    )

    db.session.add(new_project)
    db.session.commit()

    return jsonify({'id': new_project.id, 'message': 'Project created'}), 201

# =========================
# TASK ROUTES
# =========================
@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role == 'admin':
        tasks = Task.query.all()
    else:
        tasks = Task.query.filter(
            (Task.assigned_to == user_id) |
            (Task.project.has(created_by=user_id))
        ).all()

    return jsonify([{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'status': t.status,
        'due_date': t.due_date.isoformat() if t.due_date else None,
        'project_id': t.project_id,
        'project_name': t.project.name,
        'assigned_to': t.assigned_to,
        'assignee_name': t.assignee.username if t.assignee else None
    } for t in tasks])

@app.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    data = request.get_json()

    due_date = datetime.fromisoformat(data['due_date']) if data.get('due_date') else None

    new_task = Task(
        title=data['title'],
        description=data.get('description'),
        project_id=data['project_id'],
        assigned_to=data.get('assigned_to'),
        due_date=due_date
    )

    db.session.add(new_task)
    db.session.commit()

    return jsonify({'id': new_task.id, 'message': 'Task created'}), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    if 'status' in data:
        task.status = data['status']

    if 'assigned_to' in data:
        task.assigned_to = data['assigned_to']

    db.session.commit()

    return jsonify({'message': 'Task updated'})

# =========================
# DASHBOARD
# =========================
@app.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role == 'admin':
        total_projects = Project.query.count()
        total_tasks = Task.query.count()
        completed_tasks = Task.query.filter_by(status='completed').count()
        overdue_tasks = Task.query.filter(
            Task.due_date < datetime.utcnow(),
            Task.status != 'completed'
        ).count()
    else:
        total_projects = Project.query.filter_by(created_by=user_id).count()
        total_tasks = Task.query.filter(
            (Task.assigned_to == user_id) |
            (Task.project.has(created_by=user_id))
        ).count()
        completed_tasks = Task.query.filter(
            Task.status == 'completed',
            (Task.assigned_to == user_id) |
            (Task.project.has(created_by=user_id))
        ).count()
        overdue_tasks = Task.query.filter(
            Task.due_date < datetime.utcnow(),
            Task.status != 'completed',
            (Task.assigned_to == user_id) |
            (Task.project.has(created_by=user_id))
        ).count()

    return jsonify({
        'total_projects': total_projects,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'overdue_tasks': overdue_tasks
    })

# =========================
# ERROR HANDLERS
# =========================
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'message': 'Internal server error'}), 500

# =========================
# RUN APP (LOCAL ONLY)
# =========================
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)