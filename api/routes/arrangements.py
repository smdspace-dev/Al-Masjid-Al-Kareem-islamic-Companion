from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, RamadanArrangement, User

arrangements_bp = Blueprint('arrangements', __name__)

# Mock arrangements data
MOCK_ARRANGEMENTS = [
    {
        'id': 1, 'type': 'Sehri', 'location': 'Jama Masjid, Delhi',
        'description': 'Free traditional Sehri with parathas and lassi, 4:00 AM daily during Ramadan',
        'organizer': 'Delhi Muslim Community Center',
        'map_link': 'https://maps.google.com/?q=28.6507,77.2334',
        'coordinates': {'lat': 28.6507, 'lng': 77.2334},
        'contact': '+91-11-23456789',
        'is_active': True, 'is_approved': True
    },
    {
        'id': 2, 'type': 'Iftari', 'location': 'Mohammed Ali Road, Mumbai',
        'description': 'Grand community Iftari with dates, samosas, and biryani, 6:30 PM daily',
        'organizer': 'Mumbai Muslim Welfare Society',
        'map_link': 'https://maps.google.com/?q=18.9641,72.8270',
        'coordinates': {'lat': 18.9641, 'lng': 72.8270},
        'contact': '+91-22-23456789',
        'is_active': True, 'is_approved': True
    },
    {
        'id': 3, 'type': 'Sehri', 'location': 'Charminar, Hyderabad',
        'description': 'Traditional Hyderabadi Sehri with haleem and naan, 4:15 AM',
        'organizer': 'Hyderabad Masjid Committee',
        'map_link': 'https://maps.google.com/?q=17.3616,78.4747',
        'coordinates': {'lat': 17.3616, 'lng': 78.4747},
        'contact': '+91-40-23456789',
        'is_active': True, 'is_approved': True
    },
    {
        'id': 4, 'type': 'Iftari', 'location': 'Lucknow Imambara',
        'description': 'Lucknowi Iftari with kebabs, biryani, and kulfi, 6:25 PM',
        'organizer': 'Lucknow Islamic Center',
        'map_link': 'https://maps.google.com/?q=26.8467,80.9462',
        'coordinates': {'lat': 26.8467, 'lng': 80.9462},
        'contact': '+91-522-23456789',
        'is_active': True, 'is_approved': True
    },
    {
        'id': 5, 'type': 'Sehri', 'location': 'Mecca Masjid, Hyderabad',
        'description': 'Early morning Sehri with traditional Telugu Muslim cuisine',
        'organizer': 'Mecca Masjid Trust',
        'map_link': 'https://maps.google.com/?q=17.3753,78.4744',
        'coordinates': {'lat': 17.3753, 'lng': 78.4744},
        'contact': '+91-40-23456790',
        'is_active': True, 'is_approved': True
    },
    {
        'id': 6, 'type': 'Iftari', 'location': 'Tipu Sultan Masjid, Kolkata',
        'description': 'Bengali Muslim community Iftari with fish curry and rice',
        'organizer': 'Kolkata Muslim Association',
        'map_link': 'https://maps.google.com/?q=22.5726,88.3639',
        'coordinates': {'lat': 22.5726, 'lng': 88.3639},
        'contact': '+91-33-23456789',
        'is_active': True, 'is_approved': True
    }
]

@arrangements_bp.route('/', methods=['GET'])
def get_all_arrangements():
    """Get all approved Ramadan arrangements"""
    try:
        arrangement_type = request.args.get('type', '').lower()
        city = request.args.get('city', '').lower()

        arrangements = [arr for arr in MOCK_ARRANGEMENTS if arr['is_active'] and arr['is_approved']]

        # Filter by type if specified
        if arrangement_type and arrangement_type in ['sehri', 'iftari']:
            arrangements = [arr for arr in arrangements if arr['type'].lower() == arrangement_type]

        # Filter by city if specified
        if city:
            arrangements = [arr for arr in arrangements if city in arr['location'].lower()]

        return jsonify({
            'arrangements': arrangements,
            'total': len(arrangements),
            'filters': {
                'type': arrangement_type,
                'city': city
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@arrangements_bp.route('/<int:arrangement_id>', methods=['GET'])
def get_arrangement(arrangement_id):
    """Get specific arrangement by ID"""
    try:
        arrangement = next((arr for arr in MOCK_ARRANGEMENTS if arr['id'] == arrangement_id), None)

        if not arrangement:
            return jsonify({'error': 'Arrangement not found'}), 404

        if not arrangement['is_active'] or not arrangement['is_approved']:
            return jsonify({'error': 'Arrangement not available'}), 404

        return jsonify({'arrangement': arrangement}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@arrangements_bp.route('/', methods=['POST'])
@jwt_required()
def create_arrangement():
    """Create new Ramadan arrangement (arranger role required)"""
    try:
        current_user = get_jwt_identity()

        # Enhanced role checking - check actual user roles
        user_roles = {
            'admin': 'admin', 
            'organizer1': 'arranger', 
            'organizer2': 'arranger'
        }

        if current_user not in user_roles or user_roles[current_user] not in ['arranger', 'admin']:
            return jsonify({'error': 'Insufficient permissions. Arranger role required.'}), 403

        data = request.get_json()

        # Validate required fields
        required_fields = ['type', 'location', 'description', 'organizer']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        if data['type'] not in ['Sehri', 'Iftari']:
            return jsonify({'error': 'Type must be either Sehri or Iftari'}), 400

        # Validate coordinates if provided
        coordinates = data.get('coordinates', {})
        if coordinates:
            if not isinstance(coordinates.get('lat'), (int, float)) or not isinstance(coordinates.get('lng'), (int, float)):
                return jsonify({'error': 'Invalid coordinates format. Use {lat: number, lng: number}'}), 400

        # Create new arrangement
        new_arrangement = {
            'id': max([arr['id'] for arr in MOCK_ARRANGEMENTS]) + 1,
            'type': data['type'],
            'location': data['location'],
            'description': data['description'],
            'organizer': data['organizer'],
            'map_link': data.get('map_link', ''),
            'coordinates': coordinates,
            'contact': data.get('contact', ''),
            'is_active': True,
            'is_approved': False,  # Needs admin approval
            'created_by': current_user,
            'created_at': '2025-08-31T18:00:00Z',
            'timing': data.get('timing', ''),
            'capacity': data.get('capacity', 0),
            'special_notes': data.get('special_notes', '')
        }

        MOCK_ARRANGEMENTS.append(new_arrangement)

        return jsonify({
            'message': 'Arrangement created successfully and sent for approval',
            'arrangement': new_arrangement
        }), 201

    except Exception as e:
        return jsonify({'error': f'Failed to create arrangement: {str(e)}'}), 500

@arrangements_bp.route('/<int:arrangement_id>/approve', methods=['PATCH'])
@jwt_required()
def approve_arrangement(arrangement_id):
    """Approve an arrangement (admin only)"""
    try:
        current_user = get_jwt_identity()

        # Check admin role
        if current_user != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        # Find arrangement
        arrangement = next((arr for arr in MOCK_ARRANGEMENTS if arr['id'] == arrangement_id), None)
        if not arrangement:
            return jsonify({'error': 'Arrangement not found'}), 404

        # Approve arrangement
        arrangement['is_approved'] = True
        arrangement['approved_by'] = current_user
        arrangement['approved_at'] = '2025-08-31T18:00:00Z'

        return jsonify({
            'message': 'Arrangement approved successfully',
            'arrangement': arrangement
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to approve arrangement: {str(e)}'}), 500

@arrangements_bp.route('/<int:arrangement_id>/reject', methods=['PATCH'])
@jwt_required()
def reject_arrangement(arrangement_id):
    """Reject an arrangement (admin only)"""
    try:
        current_user = get_jwt_identity()

        # Check admin role
        if current_user != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        data = request.get_json()
        rejection_reason = data.get('reason', 'No reason provided')

        # Find arrangement
        arrangement = next((arr for arr in MOCK_ARRANGEMENTS if arr['id'] == arrangement_id), None)
        if not arrangement:
            return jsonify({'error': 'Arrangement not found'}), 404

        # Reject arrangement
        arrangement['is_approved'] = False
        arrangement['is_active'] = False
        arrangement['rejection_reason'] = rejection_reason
        arrangement['rejected_by'] = current_user
        arrangement['rejected_at'] = '2025-08-31T18:00:00Z'

        return jsonify({
            'message': 'Arrangement rejected',
            'arrangement': arrangement
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to reject arrangement: {str(e)}'}), 500

@arrangements_bp.route('/pending', methods=['GET'])
@jwt_required()
def get_pending_arrangements():
    """Get arrangements pending approval (admin only)"""
    try:
        current_user = get_jwt_identity()

        # Check admin role
        if current_user != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        pending_arrangements = [arr for arr in MOCK_ARRANGEMENTS if not arr['is_approved']]

        return jsonify({
            'arrangements': pending_arrangements,
            'total': len(pending_arrangements)
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to fetch pending arrangements: {str(e)}'}), 500

        MOCK_ARRANGEMENTS.append(new_arrangement)

        return jsonify({
            'message': 'Arrangement created successfully. Pending admin approval.',
            'arrangement': new_arrangement
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@arrangements_bp.route('/<int:arrangement_id>', methods=['PUT'])
@jwt_required()
def update_arrangement(arrangement_id):
    """Update arrangement (arranger who created it or admin)"""
    try:
        current_user = get_jwt_identity()

        arrangement = next((arr for arr in MOCK_ARRANGEMENTS if arr['id'] == arrangement_id), None)
        if not arrangement:
            return jsonify({'error': 'Arrangement not found'}), 404

        # Check permissions (mock)
        user_roles = {'admin': 'admin', 'organizer1': 'arranger'}
        if (current_user not in user_roles or 
            (user_roles[current_user] != 'admin' and arrangement.get('created_by') != current_user)):
            return jsonify({'error': 'Insufficient permissions'}), 403

        data = request.get_json()

        # Update allowed fields
        updatable_fields = ['description', 'organizer', 'map_link', 'coordinates', 'contact']
        for field in updatable_fields:
            if field in data:
                arrangement[field] = data[field]

        arrangement['updated_at'] = '2025-08-29T18:00:00Z'

        return jsonify({
            'message': 'Arrangement updated successfully',
            'arrangement': arrangement
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@arrangements_bp.route('/<int:arrangement_id>', methods=['DELETE'])
@jwt_required()
def delete_arrangement(arrangement_id):
    """Delete arrangement (arranger who created it or admin)"""
    try:
        current_user = get_jwt_identity()

        arrangement_index = None
        for i, arr in enumerate(MOCK_ARRANGEMENTS):
            if arr['id'] == arrangement_id:
                arrangement_index = i
                break

        if arrangement_index is None:
            return jsonify({'error': 'Arrangement not found'}), 404

        arrangement = MOCK_ARRANGEMENTS[arrangement_index]

        # Check permissions (mock)
        user_roles = {'admin': 'admin', 'organizer1': 'arranger'}
        if (current_user not in user_roles or 
            (user_roles[current_user] != 'admin' and arrangement.get('created_by') != current_user)):
            return jsonify({'error': 'Insufficient permissions'}), 403

        # Soft delete - just mark as inactive
        arrangement['is_active'] = False

        return jsonify({'message': 'Arrangement deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@arrangements_bp.route('/map-data', methods=['GET'])
def get_map_data():
    """Get arrangements data formatted for Google Maps"""
    try:
        active_arrangements = [arr for arr in MOCK_ARRANGEMENTS if arr['is_active'] and arr['is_approved']]

        map_markers = []
        for arr in active_arrangements:
            if arr.get('coordinates') and arr['coordinates'].get('lat') and arr['coordinates'].get('lng'):
                map_markers.append({
                    'id': arr['id'],
                    'type': arr['type'],
                    'title': f"{arr['type']} - {arr['location']}",
                    'description': arr['description'][:100] + '...' if len(arr['description']) > 100 else arr['description'],
                    'organizer': arr['organizer'],
                    'coordinates': arr['coordinates'],
                    'contact': arr.get('contact', ''),
                    'icon': 'mosque' if arr['type'] == 'Sehri' else 'restaurant'
                })

        return jsonify({
            'markers': map_markers,
            'total': len(map_markers),
            'center': {'lat': 20.5937, 'lng': 78.9629}  # Center of India
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
