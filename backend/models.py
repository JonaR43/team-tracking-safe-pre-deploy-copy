from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')  # Default to 'user'

    def to_json(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
        }


class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    players = db.relationship('Player', backref='team', lazy=True, cascade="all, delete-orphan")
    matches = db.relationship('Match', backref='team', lazy=True, cascade="all, delete-orphan")
    schedule = db.relationship('Schedule', backref='team', lazy=True, cascade="all, delete-orphan")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "players": [player.to_json() for player in self.players],
            "matches": [match.to_json() for match in self.matches],
            "schedule": [schedule.to_json() for schedule in self.schedule]
        }

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    kills = db.Column(db.Integer, default=0)
    deaths = db.Column(db.Integer, default=0)
    assists = db.Column(db.Integer, default=0)
    k_d = db.Column(db.Float, default=0.0)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    match_stats = db.relationship('MatchPlayerStats', backref='player', lazy=True, cascade="all, delete-orphan")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "kills": self.kills,
            "deaths": self.deaths,
            "assists": self.assists,
            "k_d": self.k_d,
            "team_id": self.team_id,
            "match_stats": [stat.to_json() for stat in self.match_stats]
        }

    def update_stats(self):
        self.kills = sum(stat.kills for stat in self.match_stats)
        self.deaths = sum(stat.deaths for stat in self.match_stats)
        self.assists = sum(stat.assists for stat in self.match_stats)
        self.k_d = self.kills / self.deaths if self.deaths > 0 else 0.0
        db.session.commit()

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date(), nullable=False)
    result = db.Column(db.String(20), nullable=False)
    match_type = db.Column(db.String(50), nullable=False)
    map = db.Column(db.String(50), nullable=False)
    game_mode = db.Column(db.String(50), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedule.id'), nullable=False)  # Link to Schedule
    
    # Hardpoint-specific stats
    our_score = db.Column(db.Integer, default=0)
    enemy_score = db.Column(db.Integer, default=0)
    white_hill_time = db.Column(db.Integer, default=0)
    contested_time = db.Column(db.Integer, default=0)
    rotations_won = db.Column(db.Integer, default=0)
    rotations_lost = db.Column(db.Integer, default=0)
    breaking_hills = db.Column(db.Integer, default=0)
    break_hold = db.Column(db.Integer, default=0)
    rotate_hold = db.Column(db.Integer, default=0)
    break_lose = db.Column(db.Integer, default=0)
    rotate_lose = db.Column(db.Integer, default=0)
    
    # Search and Destroy-specific stats
    total_rounds = db.Column(db.Integer, default=0)
    rounds_won = db.Column(db.Integer, default=0)
    rounds_lost = db.Column(db.Integer, default=0)
    offense_rounds_won = db.Column(db.Integer, default=0)
    offense_rounds_lost = db.Column(db.Integer, default=0)
    defense_rounds_won = db.Column(db.Integer, default=0)
    defense_rounds_lost = db.Column(db.Integer, default=0)
    first_bloods = db.Column(db.Integer, default=0)
    first_deaths = db.Column(db.Integer, default=0)
    first_blood_win_percentage = db.Column(db.Float, default=0.0)
    first_blood_lost_percentage = db.Column(db.Float, default=0.0)
    first_death_win_percentage = db.Column(db.Float, default=0.0)
    first_death_lost_percentage = db.Column(db.Float, default=0.0)
    plants = db.Column(db.Integer, default=0)
    defuses = db.Column(db.Integer, default=0)
    plant_win_percentage = db.Column(db.Float, default=0.0)
    plant_loss_percentage = db.Column(db.Float, default=0.0)
    
    # Control-specific stats
    captures = db.Column(db.Integer, default=0)
    breaks = db.Column(db.Integer, default=0)
    ticks = db.Column(db.Integer, default=0)
    total_rounds_control = db.Column(db.Integer, default=0)
    rounds_won_control = db.Column(db.Integer, default=0)
    rounds_lost_control = db.Column(db.Integer, default=0)
    offense_rounds_won_control = db.Column(db.Integer, default=0)
    offense_rounds_lost_control = db.Column(db.Integer, default=0)
    defense_rounds_won_control = db.Column(db.Integer, default=0)
    defense_rounds_lost_control = db.Column(db.Integer, default=0)
    team_wipe = db.Column(db.Integer, default=0)
    error_team_wipe = db.Column(db.Integer, default=0)
    
    video_link = db.relationship('VideoLink', backref='match', lazy=True, uselist=False)
    player_stats = db.relationship('MatchPlayerStats', backref='match', lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "result": self.result,
            "match_type": self.match_type,
            "map": self.map,
            "game_mode": self.game_mode,
            "team_id": self.team_id,
            "schedule_id": self.schedule_id,
            "our_score": self.our_score,
            "enemy_score": self.enemy_score,
            "white_hill_time": self.white_hill_time,
            "contested_time": self.contested_time,
            "rotations_won": self.rotations_won,
            "rotations_lost": self.rotations_lost,
            "breaking_hills": self.breaking_hills,
            "break_hold": self.break_hold,
            "rotate_hold": self.rotate_hold,
            "break_lose": self.break_lose,
            "rotate_lose": self.rotate_lose,
            "total_rounds": self.total_rounds,
            "rounds_won": self.rounds_won,
            "rounds_lost": self.rounds_lost,
            "offense_rounds_won": self.offense_rounds_won,
            "offense_rounds_lost": self.offense_rounds_lost,
            "defense_rounds_won": self.defense_rounds_won,
            "defense_rounds_lost": self.defense_rounds_lost,
            "first_bloods": self.first_bloods,
            "first_deaths": self.first_deaths,
            "first_blood_win_percentage": self.first_blood_win_percentage,
            "first_blood_lost_percentage": self.first_blood_lost_percentage,
            "first_death_win_percentage": self.first_death_win_percentage,
            "first_death_lost_percentage": self.first_death_lost_percentage,
            "plants": self.plants,
            "defuses": self.defuses,
            "plant_win_percentage": self.plant_win_percentage,
            "plant_loss_percentage": self.plant_loss_percentage,
            "captures": self.captures,
            "breaks": self.breaks,
            "ticks": self.ticks,
            "total_rounds_control": self.total_rounds_control,
            "rounds_won_control": self.rounds_won_control,
            "rounds_lost_control": self.rounds_lost_control,
            "offense_rounds_won_control": self.offense_rounds_won_control,
            "offense_rounds_lost_control": self.offense_rounds_lost_control,
            "defense_rounds_won_control": self.defense_rounds_won_control,
            "defense_rounds_lost_control": self.defense_rounds_lost_control,
            "team_wipe": self.team_wipe,
            "error_team_wipe": self.error_team_wipe,
            "player_stats": [stat.to_json() for stat in self.player_stats],
            "video_url": self.video_link.video_url if self.video_link else None
        }

class MatchPlayerStats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    kills = db.Column(db.Integer, default=0)
    deaths = db.Column(db.Integer, default=0)
    assists = db.Column(db.Integer, default=0)
    damage_output = db.Column(db.Integer, default=0)

    # Hardpoint-specific stats
    objective_time = db.Column(db.Integer, default=0)

    # Search and Destroy-specific stats
    plants = db.Column(db.Integer, default=0)
    defuses = db.Column(db.Integer, default=0)
    first_blood = db.Column(db.Integer, default=0)
    first_death = db.Column(db.Integer, default=0)

    # Control-specific stats
    captures = db.Column(db.Integer, default=0)

    def __init__(self, **kwargs):
        super(MatchPlayerStats, self).__init__(**kwargs)
        db.session.add(self)
        db.session.commit()
        player = Player.query.get(self.player_id)
        if player:
            player.update_stats()

    def to_json(self):
        return {
            "id": self.id,
            "match_id": self.match_id,
            "player_id": self.player_id,
            "kills": self.kills,
            "deaths": self.deaths,
            "assists": self.assists,
            "damage_output": self.damage_output,
            "objective_time": self.objective_time,
            "plants": self.plants,
            "defuses": self.defuses,
            "first_blood": self.first_blood,
            "first_death": self.first_death,
            "captures": self.captures,
        }


class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    match_date = db.Column(db.DateTime, nullable=False)
    opponent = db.Column(db.String(50), nullable=False)
    best_of = db.Column(db.Integer, nullable=False)
    matches = db.relationship('Match', backref='schedule', lazy=True, cascade="all, delete-orphan")  # Added cascade

    def to_json(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "match_date": self.match_date.isoformat(),
            "opponent": self.opponent,
            "best_of": self.best_of,
            "matches": [match.to_json() for match in self.matches]
        }

class VideoLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_url = db.Column(db.String(200), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedule.id'), nullable=False)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)
    notes = db.Column(db.Text, nullable=True)

    def to_json(self):
        return {
            'id': self.id,
            'video_url': self.video_url,
            'schedule_id': self.schedule_id,
            'match_id': self.match_id,
            'notes': self.notes
        }