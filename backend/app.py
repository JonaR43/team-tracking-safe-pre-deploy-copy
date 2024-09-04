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
# Server static files from the "dist" folder under the "frontend" directory
@app.route("/",defaults={"filename":""})
@app.route("/<path:filename>")
def index(filename):
  if not filename:
    filename = "index.html"
  return send_from_directory(frontend_folder,filename)

from models import User  # Add this line to import the User model
import routes

#api routes for CRUDz
with app.app_context():
    db.create_all()

    # Create default master admin if it doesn't exist
    master_admin_username = 'master_admin'
    master_admin_password = 'master_password'  # Change this to your desired password

    if not User.query.filter_by(username=master_admin_username).first():
        hashed_password = generate_password_hash(master_admin_password, method='pbkdf2:sha256')
        master_admin = User(username=master_admin_username, password=hashed_password, role='master_admin')
        db.session.add(master_admin)
        db.session.commit()
        print(f"Created master admin: {master_admin_username}")

if __name__ == "__main__":
    app.run(debug = True)