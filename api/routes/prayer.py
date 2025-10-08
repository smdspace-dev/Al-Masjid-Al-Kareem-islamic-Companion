from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, PrayerTime
import requests
from datetime import datetime, date

prayer_bp = Blueprint('prayer', __name__)

# Indian cities with their prayer times (mock data)
INDIAN_CITIES_PRAYER_TIMES = {
    'Delhi': {'Fajr': '04:25', 'Dhuhr': '12:10', 'Asr': '15:45', 'Maghrib': '18:30', 'Isha': '20:00', 'Sunrise': '06:15'},
    'Mumbai': {'Fajr': '05:15', 'Dhuhr': '12:25', 'Asr': '16:00', 'Maghrib': '18:45', 'Isha': '20:15', 'Sunrise': '06:45'},
    'Bengaluru': {'Fajr': '05:20', 'Dhuhr': '12:20', 'Asr': '15:50', 'Maghrib': '18:40', 'Isha': '20:10', 'Sunrise': '06:30'},
    'Hyderabad': {'Fajr': '05:10', 'Dhuhr': '12:15', 'Asr': '15:55', 'Maghrib': '18:35', 'Isha': '20:05', 'Sunrise': '06:25'},
    'Chennai': {'Fajr': '05:25', 'Dhuhr': '12:30', 'Asr': '16:05', 'Maghrib': '18:50', 'Isha': '20:20', 'Sunrise': '06:50'},
    'Kolkata': {'Fajr': '04:20', 'Dhuhr': '11:55', 'Asr': '15:30', 'Maghrib': '18:15', 'Isha': '19:45', 'Sunrise': '06:05'},
    'Lucknow': {'Fajr': '04:30', 'Dhuhr': '12:05', 'Asr': '15:40', 'Maghrib': '18:25', 'Isha': '19:55', 'Sunrise': '06:10'},
    'Ahmedabad': {'Fajr': '05:30', 'Dhuhr': '12:35', 'Asr': '16:10', 'Maghrib': '18:55', 'Isha': '20:25', 'Sunrise': '06:55'},
    'Pune': {'Fajr': '05:18', 'Dhuhr': '12:28', 'Asr': '15:58', 'Maghrib': '18:48', 'Isha': '20:18', 'Sunrise': '06:48'},
    'Jaipur': {'Fajr': '05:00', 'Dhuhr': '12:20', 'Asr': '15:50', 'Maghrib': '18:40', 'Isha': '20:10', 'Sunrise': '06:30'},
    'Surat': {'Fajr': '05:28', 'Dhuhr': '12:33', 'Asr': '16:08', 'Maghrib': '18:53', 'Isha': '20:23', 'Sunrise': '06:53'},
    'Kanpur': {'Fajr': '04:35', 'Dhuhr': '12:08', 'Asr': '15:43', 'Maghrib': '18:28', 'Isha': '19:58', 'Sunrise': '06:13'},
    'Nagpur': {'Fajr': '05:00', 'Dhuhr': '12:10', 'Asr': '15:45', 'Maghrib': '18:30', 'Isha': '20:00', 'Sunrise': '06:20'},
    'Patna': {'Fajr': '04:25', 'Dhuhr': '11:58', 'Asr': '15:33', 'Maghrib': '18:18', 'Isha': '19:48', 'Sunrise': '06:08'},
    'Indore': {'Fajr': '05:05', 'Dhuhr': '12:18', 'Asr': '15:53', 'Maghrib': '18:38', 'Isha': '20:08', 'Sunrise': '06:28'},
    'Thane': {'Fajr': '05:17', 'Dhuhr': '12:27', 'Asr': '16:02', 'Maghrib': '18:47', 'Isha': '20:17', 'Sunrise': '06:47'},
    'Bhopal': {'Fajr': '05:00', 'Dhuhr': '12:15', 'Asr': '15:50', 'Maghrib': '18:35', 'Isha': '20:05', 'Sunrise': '06:25'},
    'Visakhapatnam': {'Fajr': '05:15', 'Dhuhr': '12:10', 'Asr': '15:50', 'Maghrib': '18:30', 'Isha': '20:00', 'Sunrise': '06:20'},
    'Vadodara': {'Fajr': '05:25', 'Dhuhr': '12:30', 'Asr': '16:05', 'Maghrib': '18:50', 'Isha': '20:20', 'Sunrise': '06:50'},
    'Ghaziabad': {'Fajr': '04:28', 'Dhuhr': '12:13', 'Asr': '15:48', 'Maghrib': '18:33', 'Isha': '20:03', 'Sunrise': '06:18'}
}

@prayer_bp.route('/times/<city>', methods=['GET'])
def get_prayer_times(city):
    """Get prayer times for a specific city"""
    try:
        city_name = city.capitalize()

        if city_name in INDIAN_CITIES_PRAYER_TIMES:
            prayer_times = INDIAN_CITIES_PRAYER_TIMES[city_name]

            return jsonify({
                'city': city_name,
                'date': date.today().isoformat(),
                'times': prayer_times,
                'method': 'ISNA',
                'timezone': 'Asia/Kolkata'
            }), 200
        else:
            return jsonify({'error': f'Prayer times not available for {city_name}'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prayer_bp.route('/cities', methods=['GET'])
def get_available_cities():
    """Get list of available Indian cities"""
    try:
        cities = list(INDIAN_CITIES_PRAYER_TIMES.keys())

        return jsonify({
            'cities': cities,
            'total': len(cities)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prayer_bp.route('/times', methods=['GET'])
def get_multiple_cities_prayer_times():
    """Get prayer times for multiple cities"""
    try:
        cities = request.args.get('cities', '').split(',')
        cities = [city.strip().capitalize() for city in cities if city.strip()]

        if not cities:
            return jsonify({'error': 'No cities specified'}), 400

        results = {}
        for city in cities:
            if city in INDIAN_CITIES_PRAYER_TIMES:
                results[city] = INDIAN_CITIES_PRAYER_TIMES[city]

        return jsonify({
            'date': date.today().isoformat(),
            'cities': results,
            'method': 'ISNA'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prayer_bp.route('/current', methods=['GET'])
@jwt_required()
def get_current_prayer():
    """Get current prayer and next prayer time"""
    try:
        city = request.args.get('city', 'Delhi')

        if city not in INDIAN_CITIES_PRAYER_TIMES:
            city = 'Delhi'  # Default fallback

        prayer_times = INDIAN_CITIES_PRAYER_TIMES[city]
        current_time = datetime.now().time()

        # Convert prayer times to time objects for comparison
        prayers = []
        for prayer, time_str in prayer_times.items():
            if prayer != 'Sunrise':  # Exclude Sunrise from prayer list
                hour, minute = map(int, time_str.split(':'))
                prayers.append({
                    'name': prayer,
                    'time': time_str,
                    'time_obj': datetime.strptime(time_str, '%H:%M').time()
                })

        # Sort prayers by time
        prayers.sort(key=lambda x: x['time_obj'])

        # Find current and next prayer
        current_prayer = None
        next_prayer = None

        for i, prayer in enumerate(prayers):
            if current_time < prayer['time_obj']:
                next_prayer = prayer
                current_prayer = prayers[i-1] if i > 0 else prayers[-1]
                break

        if not next_prayer:  # After Isha, next prayer is Fajr
            current_prayer = prayers[-1]
            next_prayer = prayers[0]

        return jsonify({
            'city': city,
            'current_time': current_time.strftime('%H:%M'),
            'current_prayer': current_prayer,
            'next_prayer': next_prayer,
            'all_times': prayer_times
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prayer_bp.route('/qibla', methods=['GET'])
def get_qibla_direction():
    """Get Qibla direction from user's location"""
    try:
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)

        if not lat or not lng:
            return jsonify({'error': 'Latitude and longitude are required'}), 400

        # Kaaba coordinates
        kaaba_lat = 21.4225
        kaaba_lng = 39.8262

        # Calculate bearing to Kaaba
        import math

        lat1 = math.radians(lat)
        lat2 = math.radians(kaaba_lat)
        delta_lng = math.radians(kaaba_lng - lng)

        y = math.sin(delta_lng) * math.cos(lat2)
        x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(delta_lng)

        bearing = math.atan2(y, x)
        bearing = math.degrees(bearing)
        bearing = (bearing + 360) % 360

        return jsonify({
            'qibla_bearing': round(bearing, 2),
            'user_location': {'lat': lat, 'lng': lng},
            'kaaba_location': {'lat': kaaba_lat, 'lng': kaaba_lng},
            'distance_km': round(6371 * math.acos(math.cos(math.radians(lat)) * math.cos(math.radians(kaaba_lat)) * math.cos(math.radians(kaaba_lng) - math.radians(lng)) + math.sin(math.radians(lat)) * math.sin(math.radians(kaaba_lat))), 2)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
