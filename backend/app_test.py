from flask import Flask, request, jsonify
from flask_cors import CORS
# from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
# from models import db, User, Project, Task
# from auth import auth_bp
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# Config - commented out for testing
# uri = os.getenv('DATABASE_URL')
# # Fix for some environments that use the old postgres:// prefix
# if uri and uri.startswith('postgres://'):
#     uri = uri.replace('postgres://', 'postgresql://', 1)
# app.config['SQLALCHEMY_DATABASE_URI'] = uri or 'sqlite:///tasks.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# db.init_app(app)
# jwt = JWTManager(app)

# app.register_blueprint(auth_bp, url_prefix='/auth')

# Root route for testing
@app.route('/', methods=['GET'])
def root():
    print("Root route called")
    return jsonify({'message': 'Flask app is running (DB/JWT disabled)'}), 200

# Health check (no auth required)
@app.route('/health', methods=['GET'])
def health():
    print("Health route called")
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("Routes registered:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule}")
    print("Starting Flask app with DB/JWT disabled...")
    app.run(debug=True, host='127.0.0.1', port=5002)