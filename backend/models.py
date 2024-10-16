from datetime import datetime
import json

# Import db from extensions.py
from extensions import db

class User(db.Model):
    """User model for authentication and role management"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='normal')  # normal, arranger, admin
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    arrangements = db.relationship('RamadanArrangement', backref='user', lazy=True)
    bookmarks = db.relationship('Bookmark', backref='user', lazy=True)
    preferences = db.relationship('UserPreference', backref='user', uselist=False)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PrayerTime(db.Model):
    """Prayer times for different cities"""
    __tablename__ = 'prayer_times'

    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(100), nullable=False)
    fajr = db.Column(db.String(8), nullable=False)
    dhuhr = db.Column(db.String(8), nullable=False)
    asr = db.Column(db.String(8), nullable=False)
    maghrib = db.Column(db.String(8), nullable=False)
    isha = db.Column(db.String(8), nullable=False)
    sunrise = db.Column(db.String(8), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow().date)
    method = db.Column(db.String(20), default='ISNA')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'city': self.city,
            'fajr': self.fajr,
            'dhuhr': self.dhuhr,
            'asr': self.asr,
            'maghrib': self.maghrib,
            'isha': self.isha,
            'sunrise': self.sunrise,
            'date': self.date.isoformat() if self.date else None,
            'method': self.method
        }

class RamadanArrangement(db.Model):
    """Ramadan Sehri and Iftari arrangements"""
    __tablename__ = 'arrangements'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)  # Sehri, Iftari
    location = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    organizer = db.Column(db.String(100))
    map_link = db.Column(db.Text)
    coordinates = db.Column(db.JSON)  # {"lat": float, "lng": float}
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'location': self.location,
            'description': self.description,
            'organizer': self.organizer,
            'map_link': self.map_link,
            'coordinates': self.coordinates,
            'user_id': self.user_id,
            'is_active': self.is_active,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Bookmark(db.Model):
    """User bookmarks for Quran verses, Hadiths, etc."""
    __tablename__ = 'bookmarks'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content_type = db.Column(db.String(20), nullable=False)  # quran, hadith, guide
    content_id = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content_type': self.content_type,
            'content_id': self.content_id,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class UserPreference(db.Model):
    """User preferences and settings"""
    __tablename__ = 'user_preferences'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    dark_mode = db.Column(db.Boolean, default=False)
    language = db.Column(db.String(10), default='en')
    notifications = db.Column(db.JSON)  # notification settings
    prayer_method = db.Column(db.String(50), default='ISNA')
    location = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'dark_mode': self.dark_mode,
            'language': self.language,
            'notifications': self.notifications,
            'prayer_method': self.prayer_method,
            'location': self.location
        }
