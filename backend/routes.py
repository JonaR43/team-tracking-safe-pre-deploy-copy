from app import app, db
from flask import request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from models import Player, Team, Match, MatchPlayerStats, Schedule, User, VideoLink
from datetime import datetime, timedelta
from auth import token_required

@app.route('/api/save-video', methods=['POST'])
def save_video():
    data = request.json

    # Validate required fields
    if 'videoUrl' not in data or 'schedule' not in data or 'match' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Check if a video link already exists for the given match
        video_link = VideoLink.query.filter_by(match_id=data['match']).first()

        if video_link:
            # Update existing video link
            video_link.video_url = data['videoUrl']
            video_link.notes = f"{video_link.notes}\n{data.get('notes', '')}" if video_link.notes else data.get('notes', '')
        else:
            # Create a new video link
            video_link = VideoLink(
                video_url=data['videoUrl'],
                schedule_id=data['schedule'],
                match_id=data['match'],
                notes=data.get('notes', '')
            )
            db.session.add(video_link)

        db.session.commit()
        return jsonify(video_link.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/video-links', methods=['GET'])
def get_video_links():
    try:
        # Query all video links from the database
        video_links = VideoLink.query.all()
        # Convert each video link to JSON
        video_links_json = [video_link.to_json() for video_link in video_links]
        return jsonify(video_links_json), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/video-links/<int:id>', methods=['DELETE'])
def delete_video_link(id):
    try:
        video_link = VideoLink.query.get(id)
        if not video_link:
            return jsonify({'error': 'Video link not found'}), 404

        db.session.delete(video_link)
        db.session.commit()

        return jsonify({'message': 'Video link deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# In your app.py
@app.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'username': current_user.username,
        'role': current_user.role,
    })


@app.route('/admin/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    if current_user.role not in ['admin', 'master_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    users = User.query.all()
    return jsonify([user.to_json() for user in users])

@app.route('/admin/mark_as_admin', methods=['POST'])
@token_required
def mark_as_admin(current_user):
    if current_user.role not in ['admin', 'master_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user:
        if user.role == 'master_admin':
            return jsonify({'message': 'Cannot change role of master admin'}), 403
        user.role = 'admin'
        db.session.commit()
        return jsonify({'message': 'User marked as admin'})
    return jsonify({'message': 'User not found'}), 404

@app.route('/admin/mark_as_user', methods=['POST'])
@token_required
def mark_as_user(current_user):
    if current_user.role not in ['admin', 'master_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user:
        if user.role == 'master_admin':
            return jsonify({'message': 'Cannot change role of master admin'}), 403
        user.role = 'user'
        db.session.commit()
        return jsonify({'message': 'User marked as user'})
    return jsonify({'message': 'User not found'}), 404

@app.route('/admin/delete_user', methods=['DELETE'])
@token_required
def delete_user(current_user):
    if current_user.role not in ['admin', 'master_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user:
        if user.role == 'master_admin':
            return jsonify({'message': 'Cannot delete master admin'}), 403
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    return jsonify({'message': 'User not found'}), 404

@app.route('/admin/reset_password', methods=['POST'])
@token_required
def reset_password(current_user):
    if current_user.role not in ['admin', 'master_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user:
        if user.role == 'master_admin':
            return jsonify({'message': 'Cannot delete master admin'}), 403
        user.password = generate_password_hash(data['new_password'])
        db.session.commit()
        return jsonify({'message': 'Password reset successful'})
    return jsonify({'message': 'User not found'}), 404


@app.route("/users", methods=["GET"])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_json() for user in users]), 200
    except Exception as e:
        return jsonify({"Error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        token = jwt.encode(
            {'user_id': user.id, 'role': user.role, 'exp': datetime.utcnow() + timedelta(hours=1)},
            app.config['SECRET_KEY'],
            algorithm='HS256'
        )
        return jsonify({'token': token, 'role': user.role}), 200
    return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'user')  # Default to 'user' if no role is provided

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(username=username, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@app.route("/players", methods=["GET"])
def get_players():
    players = Player.query.all()
    result = [player.to_json() for player in players]
    return jsonify(result)

@app.route("/create_player", methods=["POST"])
def create_player():
    try:
        data = request.json
        required_fields = ["name", "role", "team_id"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400  # Updated status code

        # Additional validation
        if not isinstance(data.get("team_id"), int):
            return jsonify({"error": "Invalid team_id"}), 400

        new_player = Player(
            name=data.get("name"),
            role=data.get("role"),
            kills=data.get("kills", 0),
            deaths=data.get("deaths", 0),
            assists=data.get("assists", 0),
            k_d=data.get("k_d", 0.0),
            team_id=data.get("team_id")
        )
        db.session.add(new_player)
        db.session.commit()
        return jsonify(new_player.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500  # Ensure consistent error message key

@app.route('/players/<int:player_id>', methods=['GET'])
def get_player(player_id):
    player = Player.query.get_or_404(player_id)
    player_data = player.to_json()

    # Fetch match details
    match_details = []
    for match_stat in player.match_stats:
        match = Match.query.get(match_stat.match_id)
        if match:
            match_details.append(match.to_json())

    return jsonify({
        "player": player_data,
        "match_stats": match_details
    })

@app.route('/matches/<int:match_id>/player_stats', methods=['GET'])
def get_player_stats(match_id):
    player_stats = MatchPlayerStats.query.filter_by(match_id=match_id).all()
    
    if not player_stats:
        return jsonify({'error': 'Player stats not found'}), 404
    
    player_stats_json = []
    for stats in player_stats:
        player = Player.query.get(stats.player_id)
        player_stats_json.append({
            "id": stats.id,
            "match_id": stats.match_id,
            "player_id": stats.player_id,
            "player_name": player.name if player else "Unknown",
            "kills": stats.kills,
            "deaths": stats.deaths,
            "assists": stats.assists,
            "kda": (stats.kills + stats.assists) / stats.deaths if stats.deaths > 0 else "N/A",
        })
    
    return jsonify(player_stats_json)

@app.route("/delete_player/<int:id>", methods=["DELETE"])
def delete_player(id):
    try:
        # Get the player record
        player = Player.query.get(id)
        if not player:
            return jsonify({"Error": "Player not found"}), 404
        
        # Delete related match_player_stats records
        MatchPlayerStats.query.filter_by(player_id=id).delete()

        # Delete the player
        db.session.delete(player)
        db.session.commit()

        return jsonify({"message": "Player deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 400


@app.route("/teams", methods=["GET"])
def get_teams():
    teams = Team.query.all()
    result = [team.to_json() for team in teams]
    return jsonify(result)

@app.route("/create_team", methods=["POST"])
def create_team():
    try:
        data = request.json
        if "name" not in data or not data.get("name"):
            return jsonify({"error": "Missing required field: name"}), 401
        
        new_team = Team(name=data.get("name"))
        db.session.add(new_team)
        db.session.commit()
        return jsonify(new_team.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

@app.route("/delete_team/<int:id>", methods=["DELETE"])
def delete_team(id):
    try:
        team = Team.query.get(id)
        if not team:
            return jsonify({"Error": "Team not found"}), 404
        db.session.delete(team)
        db.session.commit()
        return jsonify({"message": "Team deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 400

@app.route("/matches", methods=["GET"])
def get_matches():
    matches = Match.query.all()
    result = [match.to_json() for match in matches]
    return jsonify(result)

@app.route("/matches/<int:match_id>", methods=["GET"])
def get_match(match_id):
    match = Match.query.get(match_id)
    if match is None:
        return jsonify({"error": "Match not found"}), 404
    return jsonify(match.to_json())

@app.route("/create_match", methods=["POST"])
def create_match():
    try:
        data = request.json
        required_fields = ["result", "match_type", "date", "map", "game_mode", "team_id"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 401
            
        date_str = data.get("date")
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format, should be YYYY-MM-DD"}), 400

        new_match = Match(
            result=data.get("result"),
            match_type=data.get("match_type"),
            date=date_obj,
            map=data.get("map"),
            game_mode=data.get("game_mode"),
            team_id=data.get("team_id"),
            schedule_id=data.get("schedule_id")  # Include schedule_id
        )

        # Hardpoint specific stats
        if data.get("game_mode") == "hardpoint":
            required_hardpoint_fields = [
                "our_score", "enemy_score", "white_hill_time", "contested_time",
                "rotations_won", "rotations_lost", "breaking_hills", "break_hold",
                "rotate_hold", "break_lose", "rotate_lose"
            ]
            for field in required_hardpoint_fields:
                if field not in data or not data.get(field):
                    return jsonify({"error": f"Missing required field for hardpoint: {field}"}), 401

            new_match.our_score = int(data.get("our_score"))
            new_match.enemy_score = int(data.get("enemy_score"))
            new_match.white_hill_time = int(data.get("white_hill_time"))
            new_match.contested_time = int(data.get("contested_time"))
            new_match.rotations_won = int(data.get("rotations_won"))
            new_match.rotations_lost = int(data.get("rotations_lost"))
            new_match.breaking_hills = int(data.get("breaking_hills"))
            new_match.break_hold = int(data.get("break_hold"))
            new_match.rotate_hold = int(data.get("rotate_hold"))
            new_match.break_lose = int(data.get("break_lose"))
            new_match.rotate_lose = int(data.get("rotate_lose"))

        # Search and Destroy specific stats
        elif data.get("game_mode") == "search":
            required_snd_fields = [
                "total_rounds", "rounds_won", "rounds_lost", "offense_rounds_won",
                "offense_rounds_lost", "defense_rounds_won", "defense_rounds_lost",
                "first_bloods", "first_deaths", "plants", "defuses"
            ]
            for field in required_snd_fields:
                if field not in data or not data.get(field):
                    return jsonify({"error": f"Missing required field for search_and_destroy: {field}"}), 401

            new_match.total_rounds = int(data.get("total_rounds"))
            new_match.rounds_won = int(data.get("rounds_won"))
            new_match.rounds_lost = int(data.get("rounds_lost"))
            new_match.offense_rounds_won = int(data.get("offense_rounds_won"))
            new_match.offense_rounds_lost = int(data.get("offense_rounds_lost"))
            new_match.defense_rounds_won = int(data.get("defense_rounds_won"))
            new_match.defense_rounds_lost = int(data.get("defense_rounds_lost"))
            new_match.first_bloods = int(data.get("first_bloods"))
            new_match.first_deaths = int(data.get("first_deaths"))
            new_match.plants = int(data.get("plants"))
            new_match.defuses = int(data.get("defuses"))

            # Calculations
            total_rounds_won = new_match.offense_rounds_won + new_match.defense_rounds_won
            total_rounds_lost = new_match.offense_rounds_lost + new_match.defense_rounds_lost

            if total_rounds_won != 0:
                new_match.first_blood_win_percentage = new_match.first_bloods / total_rounds_won
                new_match.first_death_win_percentage = new_match.first_deaths / total_rounds_won
            else:
                new_match.first_blood_win_percentage = 0.0
                new_match.first_death_win_percentage = 0.0

            if total_rounds_lost != 0:
                new_match.first_blood_lost_percentage = new_match.first_bloods / total_rounds_lost
                new_match.first_death_lost_percentage = new_match.first_deaths / total_rounds_lost
            else:
                new_match.first_blood_lost_percentage = 0.0
                new_match.first_death_lost_percentage = 0.0

            if new_match.offense_rounds_won != 0:
                new_match.plant_win_percentage = new_match.plants / new_match.offense_rounds_won
            else:
                new_match.plant_win_percentage = 0.0

            if new_match.offense_rounds_lost != 0:
                new_match.plant_loss_percentage = new_match.plants / new_match.offense_rounds_lost
            else:
                new_match.plant_loss_percentage = 0.0

        # Control specific stats
        elif data.get("game_mode") == "control":
            required_control_fields = [
                "captures", "breaks", "ticks", "total_rounds", "rounds_won", "rounds_lost",
                "offense_rounds_won", "offense_rounds_lost", "defense_rounds_won", "defense_rounds_lost",
                "team_wipe", "error_team_wipe"
            ]
            for field in required_control_fields:
                if field not in data or not data.get(field):
                    return jsonify({"error": f"Missing required field for control: {field}"}), 401

            new_match.captures = int(data.get("captures"))
            new_match.breaks = int(data.get("breaks"))
            new_match.ticks = int(data.get("ticks"))
            new_match.total_rounds_control = int(data.get("total_rounds"))
            new_match.rounds_won_control = int(data.get("rounds_won"))
            new_match.rounds_lost_control = int(data.get("rounds_lost"))
            new_match.offense_rounds_won_control = int(data.get("offense_rounds_won"))
            new_match.offense_rounds_lost_control = int(data.get("offense_rounds_lost"))
            new_match.defense_rounds_won_control = int(data.get("defense_rounds_won"))
            new_match.defense_rounds_lost_control = int(data.get("defense_rounds_lost"))
            new_match.team_wipe = int(data.get("team_wipe"))
            new_match.error_team_wipe = int(data.get("error_team_wipe"))

        db.session.add(new_match)
        db.session.commit()
        return jsonify(new_match.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

@app.route("/create_or_update_player_match_stats", methods=["POST"])
def create_or_update_match_stats():
    try:
        data = request.json

        # List of required fields for general stats
        required_fields = ["match_id", "player_id", "kills", "deaths", "assists"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 401

        # Check if the match stats for this player and match already exist
        existing_stats = MatchPlayerStats.query.filter_by(
            match_id=data.get("match_id"),
            player_id=data.get("player_id")
        ).first()

        if existing_stats:
            # Update the existing stats
            existing_stats.kills = data.get("kills", existing_stats.kills)
            existing_stats.deaths = data.get("deaths", existing_stats.deaths)
            existing_stats.assists = data.get("assists", existing_stats.assists)
            existing_stats.damage_output = data.get("damage_output", existing_stats.damage_output)
            existing_stats.objective_time = data.get("objective_time", existing_stats.objective_time)
            existing_stats.plants = data.get("plants", existing_stats.plants)
            existing_stats.defuses = data.get("defuses", existing_stats.defuses)
            existing_stats.first_blood = data.get("first_blood", existing_stats.first_blood)
            existing_stats.first_death = data.get("first_death", existing_stats.first_death)
            existing_stats.captures = data.get("captures", existing_stats.captures)
        else:
            # Create a new MatchPlayerStats object
            match_stats = MatchPlayerStats(
                match_id=data.get("match_id"),
                player_id=data.get("player_id"),
                kills=data.get("kills", 0),
                deaths=data.get("deaths", 0),
                assists=data.get("assists", 0),
                damage_output=data.get("damage_output", 0),
                objective_time=data.get("objective_time", 0),
                plants=data.get("plants", 0),
                defuses=data.get("defuses", 0),
                first_blood=data.get("first_blood", 0),
                first_death=data.get("first_death", 0),
                captures=data.get("captures", 0)
            )
            db.session.add(match_stats)

        # Commit the changes (either update or new insert)
        db.session.commit()

        # Update player's overall stats
        player = Player.query.get(data.get("player_id"))
        if player:
            player.update_stats()

        return jsonify({"message": "Player match stats updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


    
@app.route("/update_match/<int:id>", methods=["PUT"])
def update_match(id):
    try:
        data = request.json
        match = Match.query.get(id)
        if not match:
            return jsonify({"Error": "Match not found"}), 404

        game_mode = data.get("game_mode", match.game_mode)

        if game_mode == "hardpoint":
            required_hardpoint_fields = [
                "our_score", "enemy_score", "white_hill_time", "contested_time",
                "rotations_won", "rotations_lost", "breaking_hills", "break_hold",
                "rotate_hold", "break_lose", "rotate_lose"
            ]
            for field in required_hardpoint_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field for Hardpoint: {field}"}), 401

        elif game_mode == "search":
            required_sd_fields = [
                "offense_rounds_won", "defense_rounds_won", "offense_rounds_lost",
                "defense_rounds_lost", "first_bloods", "first_deaths", "plants"
            ]
            for field in required_sd_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field for Search and Destroy: {field}"}), 401

        elif game_mode == "control":
            required_control_fields = [
                "captures", "breaks", "ticks", "total_rounds", "rounds_won", "rounds_lost",
                "offense_rounds_won", "offense_rounds_lost", "defense_rounds_won",
                "defense_rounds_lost", "team_wipe", "error_team_wipe"
            ]
            for field in required_control_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field for Control: {field}"}), 401

        # Perform calculations for percentages as needed (example for Search and Destroy)
        if game_mode == "search_and_destroy":
            offense_rounds_won = data.get("offense_rounds_won", match.offense_rounds_won)
            defense_rounds_won = data.get("defense_rounds_won", match.defense_rounds_won)
            offense_rounds_lost = data.get("offense_rounds_lost", match.offense_rounds_lost)
            defense_rounds_lost = data.get("defense_rounds_lost", match.defense_rounds_lost)
            first_bloods = data.get("first_bloods", match.first_bloods)
            first_deaths = data.get("first_deaths", match.first_deaths)
            plants = data.get("plants", match.plants)

            total_rounds_won = offense_rounds_won + defense_rounds_won
            total_rounds_lost = offense_rounds_lost + defense_rounds_lost

            # Calculate percentages
            if total_rounds_won > 0:
                first_blood_win_percentage = (first_bloods / total_rounds_won) * 100
                first_death_win_percentage = (first_deaths / total_rounds_won) * 100
            else:
                first_blood_win_percentage = 0.0
                first_death_win_percentage = 0.0
            
            if total_rounds_lost > 0:
                first_blood_lost_percentage = (first_bloods / total_rounds_lost) * 100
                first_death_lost_percentage = (first_deaths / total_rounds_lost) * 100
            else:
                first_blood_lost_percentage = 0.0
                first_death_lost_percentage = 0.0
            
            if offense_rounds_won > 0:
                plant_win_percentage = (plants / offense_rounds_won) * 100
            else:
                plant_win_percentage = 0.0
            
            if offense_rounds_lost > 0:
                plant_loss_percentage = (plants / offense_rounds_lost) * 100
            else:
                plant_loss_percentage = 0.0

        # Update match with new data
        match.result = data.get("result", match.result)
        match.match_type = data.get("match_type", match.match_type)
        match.map = data.get("map", match.map)
        match.game_mode = data.get("game_mode", match.game_mode)
        match.team_id = data.get("team_id", match.team_id)
        # Update fields based on game_mode
        match.our_score = data.get("our_score", match.our_score)
        match.enemy_score = data.get("enemy_score", match.enemy_score)
        match.white_hill_time = data.get("white_hill_time", match.white_hill_time)
        match.contested_time = data.get("contested_time", match.contested_time)
        match.rotations_won = data.get("rotations_won", match.rotations_won)
        match.rotations_lost = data.get("rotations_lost", match.rotations_lost)
        match.breaking_hills = data.get("breaking_hills", match.breaking_hills)
        match.break_hold = data.get("break_hold", match.break_hold)
        match.rotate_hold = data.get("rotate_hold", match.rotate_hold)
        match.break_lose = data.get("break_lose", match.break_lose)
        match.rotate_lose = data.get("rotate_lose", match.rotate_lose)
        match.first_bloods = data.get("first_bloods", match.first_bloods)
        match.first_deaths = data.get("first_deaths", match.first_deaths)
        match.first_blood_win_percentage = first_blood_win_percentage
        match.first_blood_lost_percentage = first_blood_lost_percentage
        match.first_death_win_percentage = first_death_win_percentage
        match.first_death_lost_percentage = first_death_lost_percentage
        match.plants = data.get("plants", match.plants)
        match.defuses = data.get("defuses", match.defuses)
        match.plant_win_percentage = plant_win_percentage
        match.plant_loss_percentage = plant_loss_percentage
        match.captures = data.get("captures", match.captures)
        match.breaks = data.get("breaks", match.breaks)
        match.ticks = data.get("ticks", match.ticks)
        match.total_rounds_control = data.get("total_rounds_control", match.total_rounds_control)
        match.rounds_won_control = data.get("rounds_won_control", match.rounds_won_control)
        match.rounds_lost_control = data.get("rounds_lost_control", match.rounds_lost_control)
        match.offense_rounds_won_control = data.get("offense_rounds_won_control", match.offense_rounds_won_control)
        match.offense_rounds_lost_control = data.get("offense_rounds_lost_control", match.offense_rounds_lost_control)
        match.defense_rounds_won_control = data.get("defense_rounds_won_control", match.defense_rounds_won_control)
        match.defense_rounds_lost_control = data.get("defense_rounds_lost_control", match.defense_rounds_lost_control)
        match.team_wipe = data.get("team_wipe", match.team_wipe)
        match.error_team_wipe = data.get("error_team_wipe", match.error_team_wipe)

        db.session.commit()
        return jsonify(match.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500


@app.route("/delete_match_stats/<int:id>", methods=["DELETE"])
def delete_match_stats(id):
    try:
        match_stats = MatchPlayerStats.query.get(id)
        if not match_stats:
            return jsonify({"Error": "Match stats not found"}), 404

        player_id = match_stats.player_id
        db.session.delete(match_stats)
        db.session.commit()

        # Update player's overall stats
        player = Player.query.get(player_id)
        if player:
            player.update_stats()

        return jsonify({"message": "Match stats deleted and player's overall stats updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

@app.route("/delete_match/<int:id>", methods=["DELETE"])
def delete_match(id):
    try:
        match = Match.query.get(id)
        if not match:
            return jsonify({"Error": "Match not found"}), 404

        # Get all player IDs involved in this match
        player_ids = [stat.player_id for stat in match.player_stats]

        # Delete the match and its related player stats
        db.session.delete(match)
        db.session.commit()

        # Update the stats for each player involved in this match
        for player_id in player_ids:
            player = Player.query.get(player_id)
            if player:
                player.update_stats()

        return jsonify({"message": "Match and related player stats deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 400


@app.route("/schedules", methods=["GET"])
def get_schedules():
    schedules = Schedule.query.all()
    result = [schedule.to_json() for schedule in schedules]
    return jsonify(result)

@app.route("/create_schedule", methods=["POST"])
def create_schedule():
    try:
        data = request.json
        required_fields = ["team_id", "match_date", "opponent", "best_of"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 401

        # Validate date format
        match_date_str = data.get("match_date")
        try:
            match_date_obj = datetime.strptime(match_date_str, "%Y-%m-%dT%H:%M")
        except ValueError:
            return jsonify({"error": "Invalid date format, should be YYYY-MM-DDTHH:MM"}), 400

        # Create new schedule
        new_schedule = Schedule(
            team_id=data.get("team_id"),
            match_date=match_date_obj,
            opponent=data.get("opponent"),
            best_of=int(data.get("best_of"))
        )

        db.session.add(new_schedule)
        db.session.commit()
        return jsonify(new_schedule.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

@app.route("/delete_schedule/<int:schedule_id>", methods=["DELETE"])
def delete_schedule(schedule_id):
    try:
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            return jsonify({"error": "Schedule not found"}), 404
        
        db.session.delete(schedule)
        db.session.commit()
        return jsonify({"message": "Schedule deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting schedule: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/match/<int:id>", methods=["GET"])
def get_match_details(id):
    try:
        match = Match.query.get(id)
        if not match:
            return jsonify({"Error": "Match not found"}), 404

        match_data = match.to_json()

        # Add game mode-specific stats
        if match.game_mode == "hardpoint":
            match_data.update({
                "our_score": match.our_score,
                "enemy_score": match.enemy_score,
                "white_hill_time": match.white_hill_time,
                "contested_time": match.contested_time,
                "rotations_won": match.rotations_won,
                "rotations_lost": match.rotations_lost,
                "breaking_hills": match.breaking_hills,
                "break_hold": match.break_hold,
                "rotate_hold": match.rotate_hold,
                "break_lose": match.break_lose,
                "rotate_lose": match.rotate_lose,
            })
        elif match.game_mode == "search":
            match_data.update({
                "total_rounds": match.total_rounds,
                "rounds_won": match.rounds_won,
                "rounds_lost": match.rounds_lost,
                "offense_rounds_won": match.offense_rounds_won,
                "offense_rounds_lost": match.offense_rounds_lost,
                "defense_rounds_won": match.defense_rounds_won,
                "defense_rounds_lost": match.defense_rounds_lost,
                "first_bloods": match.first_bloods,
                "first_deaths": match.first_deaths,
                "plants": match.plants,
                "defuses": match.defuses,
                "first_blood_win_percentage": match.first_blood_win_percentage,
                "first_blood_lost_percentage": match.first_blood_lost_percentage,
                "first_death_win_percentage": match.first_death_win_percentage,
                "first_death_lost_percentage": match.first_death_lost_percentage,
                "plant_win_percentage": match.plant_win_percentage,
                "plant_loss_percentage": match.plant_loss_percentage,
            })
        elif match.game_mode == "control":
            match_data.update({
                "captures": match.captures,
                "breaks": match.breaks,
                "ticks": match.ticks,
                "total_rounds_control": match.total_rounds_control,
                "rounds_won_control": match.rounds_won_control,
                "rounds_lost_control": match.rounds_lost_control,
                "offense_rounds_won_control": match.offense_rounds_won_control,
                "offense_rounds_lost_control": match.offense_rounds_lost_control,
                "defense_rounds_won_control": match.defense_rounds_won_control,
                "defense_rounds_lost_control": match.defense_rounds_lost_control,
                "team_wipe": match.team_wipe,
                "error_team_wipe": match.error_team_wipe,
            })

        return jsonify(match_data), 200
    except Exception as e:
        return jsonify({"Error": str(e)}), 500

@app.route("/schedule/<int:schedule_id>/matches", methods=["GET"])
def get_schedule_matches(schedule_id):
    try:
        # Fetch the schedule by ID
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            return jsonify({"Error": "Schedule not found"}), 404

        # Get associated matches
        matches = Match.query.filter_by(schedule_id=schedule_id).all()
        matches_data = [match.to_json() for match in matches]

        return jsonify(matches_data), 200
    except Exception as e:
        return jsonify({"Error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

