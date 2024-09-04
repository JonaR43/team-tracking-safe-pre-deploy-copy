# auth.py
from functools import wraps
from flask import request, jsonify, current_app
import jwt
from models import User

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        # Check if token is provided in the Authorization header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        # If no token is provided, return an error
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            # Decode the token to get user ID
            secret_key = current_app.config['SECRET_KEY']
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            user_id = data['user_id']  # Updated to use 'user_id'
            current_user = User.query.get(user_id)
            if not current_user:
                return jsonify({'message': 'User not found!'}), 403
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 403

        # Pass the current user to the route function
        return f(current_user, *args, **kwargs)

    return decorated_function


