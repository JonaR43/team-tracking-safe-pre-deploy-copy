from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///mydatabase.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)

frontend_folder = os.path.join(os.getcwd(), "..", "frontend", "dist")

# Serve static files from the "dist" folder
@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    if os.path.isfile(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Import routes here to avoid circular imports
from routes import *

# Initialize database and create default user
with app.app_context():
    db.create_all()
    from models import User
    master_admin_username = 'master_admin'
    master_admin_password = 'master_password'

    if not User.query.filter_by(username=master_admin_username).first():
        hashed_password = generate_password_hash(master_admin_password, method='pbkdf2:sha256')
        master_admin = User(username=master_admin_username, password=hashed_password, role='master_admin')
        db.session.add(master_admin)
        db.session.commit()
        print(f"Created master admin: {master_admin_username}")

if __name__ == "__main__":
    app.run(debug=True)


