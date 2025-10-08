from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

# Enhanced mock users data with passwords
MOCK_USERS = [
    {
        'id': 1, 
        'username': 'admin', 
        'email': 'admin@muslim-app.com', 
        'password_hash': generate_password_hash('admin123'),
        'phone': '+1234567890',
        'role': 'admin', 
        'is_active': True, 
        'created_at': '2025-01-01T00:00:00Z',
        'last_login': '2025-08-31T10:00:00Z'
    },
    {
        'id': 2, 
        'username': 'organizer1', 
        'email': 'org1@muslim-app.com', 
        'password_hash': generate_password_hash('organizer123'),
        'phone': '+1234567891',
        'role': 'arranger', 
        'is_active': True, 
        'created_at': '2025-02-01T00:00:00Z',
        'last_login': '2025-08-30T15:30:00Z'
    },
    {
        'id': 3, 
        'username': 'organizer2', 
        'email': 'org2@muslim-app.com', 
        'password_hash': generate_password_hash('organizer456'),
        'phone': '+1234567892',
        'role': 'arranger', 
        'is_active': True, 
        'created_at': '2025-03-01T00:00:00Z',
        'last_login': '2025-08-29T09:15:00Z'
    },
    {
        'id': 4, 
        'username': 'user1', 
        'email': 'user1@muslim-app.com', 
        'password_hash': generate_password_hash('user123'),
        'phone': '+1234567893',
        'role': 'normal', 
        'is_active': True, 
        'created_at': '2025-04-01T00:00:00Z',
        'last_login': '2025-08-31T08:45:00Z'
    },
    {
        'id': 5, 
        'username': 'user2', 
        'email': 'user2@muslim-app.com', 
        'password_hash': generate_password_hash('user456'),
        'phone': '+1234567894',
        'role': 'normal', 
        'is_active': True, 
        'created_at': '2025-05-01T00:00:00Z',
        'last_login': '2025-08-30T20:30:00Z'
    },
    {
        'id': 6, 
        'username': 'testuser', 
        'email': 'test@muslim-app.com', 
        'password_hash': generate_password_hash('test123'),
        'phone': '+1234567895',
        'role': 'normal', 
        'is_active': False, 
        'created_at': '2025-06-01T00:00:00Z',
        'last_login': None
    }
]

def check_admin_role(current_user):
    """Check if current user has admin role"""
    # Check against mock admin user
    admin_user = next((u for u in MOCK_USERS if u['username'] == current_user), None)
    if admin_user:
        return admin_user['role'] == 'admin'
    return current_user == 'admin'  # Fallback admin check

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def admin_dashboard():
    """Admin dashboard with statistics"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        # Mock statistics
        stats = {
            'total_users': len(MOCK_USERS),
            'active_users': len([u for u in MOCK_USERS if u['is_active']]),
            'arrangers': len([u for u in MOCK_USERS if u['role'] == 'arranger']),
            'total_arrangements': 6,  # From arrangements mock data
            'pending_approval': 2,
            'active_arrangements': 4
        }

        # Recent activities
        activities = [
            {'type': 'user_registered', 'message': 'New user registered: user2', 'timestamp': '2025-08-29T17:30:00Z'},
            {'type': 'arrangement_created', 'message': 'New arrangement added in Mumbai', 'timestamp': '2025-08-29T16:45:00Z'},
            {'type': 'arrangement_approved', 'message': 'Arrangement approved in Delhi', 'timestamp': '2025-08-29T15:20:00Z'}
        ]

        return jsonify({
            'statistics': stats,
            'recent_activities': activities,
            'admin_user': current_user
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users with enhanced information"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        # Enhanced users list with safe password info
        users_list = []
        for user in MOCK_USERS:
            user_info = {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'phone': user.get('phone', ''),
                'role': user['role'],
                'is_active': user['is_active'],
                'created_at': user['created_at'],
                'last_login': user.get('last_login'),
                'has_password': bool(user.get('password_hash'))
            }
            users_list.append(user_info)

        return jsonify({
            'users': users_list,
            'total': len(users_list),
            'active_count': len([u for u in users_list if u['is_active']]),
            'roles': {
                'admin': len([u for u in users_list if u['role'] == 'admin']),
                'arranger': len([u for u in users_list if u['role'] == 'arranger']),
                'normal': len([u for u in users_list if u['role'] == 'normal'])
            }
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to fetch users: {str(e)}'}), 500

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    """Create a new user"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        data = request.get_json()

        # Validation
        required_fields = ['username', 'email', 'password', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Check if username or email already exists
        for user in MOCK_USERS:
            if user['username'].lower() == data['username'].lower():
                return jsonify({'error': 'Username already exists'}), 400
            if user['email'].lower() == data['email'].lower():
                return jsonify({'error': 'Email already exists'}), 400

        # Create new user
        new_user = {
            'id': max([u['id'] for u in MOCK_USERS]) + 1,
            'username': data['username'],
            'email': data['email'],
            'password_hash': generate_password_hash(data['password']),
            'phone': data.get('phone', ''),
            'role': data['role'],
            'is_active': data.get('is_active', True),
            'created_at': datetime.now().isoformat() + 'Z',
            'last_login': None
        }

        MOCK_USERS.append(new_user)

        # Return user without password hash
        response_user = {k: v for k, v in new_user.items() if k != 'password_hash'}
        response_user['has_password'] = True

        return jsonify({
            'message': 'User created successfully',
            'user': response_user
        }), 201

    except Exception as e:
        return jsonify({'error': f'Failed to create user: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update user details"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        data = request.get_json()

        # Find user
        user = next((u for u in MOCK_USERS if u['id'] == user_id), None)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Update fields
        if 'username' in data:
            # Check if new username already exists
            existing = next((u for u in MOCK_USERS if u['id'] != user_id and u['username'].lower() == data['username'].lower()), None)
            if existing:
                return jsonify({'error': 'Username already exists'}), 400
            user['username'] = data['username']

        if 'email' in data:
            # Check if new email already exists
            existing = next((u for u in MOCK_USERS if u['id'] != user_id and u['email'].lower() == data['email'].lower()), None)
            if existing:
                return jsonify({'error': 'Email already exists'}), 400
            user['email'] = data['email']

        if 'phone' in data:
            user['phone'] = data['phone']

        if 'role' in data and data['role'] in ['admin', 'arranger', 'normal']:
            user['role'] = data['role']

        if 'is_active' in data:
            user['is_active'] = bool(data['is_active'])

        if 'password' in data and data['password']:
            user['password_hash'] = generate_password_hash(data['password'])

        # Return updated user without password hash
        response_user = {k: v for k, v in user.items() if k != 'password_hash'}
        response_user['has_password'] = bool(user.get('password_hash'))

        return jsonify({
            'message': 'User updated successfully',
            'user': response_user
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to update user: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Delete a user"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        # Find user
        user_index = next((i for i, u in enumerate(MOCK_USERS) if u['id'] == user_id), None)
        if user_index is None:
            return jsonify({'error': 'User not found'}), 404

        # Prevent deletion of the current admin
        if MOCK_USERS[user_index]['username'] == current_user:
            return jsonify({'error': 'Cannot delete your own account'}), 400

        deleted_user = MOCK_USERS.pop(user_index)

        return jsonify({
            'message': f'User {deleted_user["username"]} deleted successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to delete user: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>/toggle-status', methods=['PATCH'])
@jwt_required()
def toggle_user_status(user_id):
    """Activate/Deactivate a user"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        # Find user
        user = next((u for u in MOCK_USERS if u['id'] == user_id), None)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Toggle status
        user['is_active'] = not user['is_active']
        status = 'activated' if user['is_active'] else 'deactivated'

        return jsonify({
            'message': f'User {user["username"]} {status} successfully',
            'is_active': user['is_active']
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to toggle user status: {str(e)}'}), 500

@admin_bp.route('/forgot-password', methods=['POST'])
def admin_forgot_password():
    """Send password reset for any user (admin feature)"""
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        # Find user by email
        user = next((u for u in MOCK_USERS if u['email'].lower() == email.lower()), None)
        if not user:
            return jsonify({'error': 'User not found with this email'}), 404

        # Generate reset token (mock)
        reset_token = str(uuid.uuid4())

        return jsonify({
            'message': f'Password reset instructions sent to {email}',
            'reset_token': reset_token,  # In real app, this would be sent via email
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to process password reset: {str(e)}'}), 500

@admin_bp.route('/reset-password', methods=['POST'])
def admin_reset_password():
    """Reset password with token (admin feature)"""
    try:
        data = request.get_json()
        email = data.get('email')
        new_password = data.get('new_password')
        reset_token = data.get('reset_token')

        if not all([email, new_password, reset_token]):
            return jsonify({'error': 'Email, new password and reset token are required'}), 400

        # Find user by email
        user = next((u for u in MOCK_USERS if u['email'].lower() == email.lower()), None)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Update password
        user['password_hash'] = generate_password_hash(new_password)

        return jsonify({
            'message': 'Password reset successful',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to reset password: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    """Update user role (admin only)"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        data = request.get_json()
        new_role = data.get('role')

        if not new_role or new_role not in ['normal', 'arranger', 'admin']:
            return jsonify({'error': 'Valid role is required (normal, arranger, admin)'}), 400

        # Find and update user
        user = next((u for u in MOCK_USERS if u['id'] == user_id), None)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        old_role = user['role']
        user['role'] = new_role
        user['updated_at'] = '2025-08-29T18:00:00Z'

        return jsonify({
            'message': f'User role updated from {old_role} to {new_role}',
            'user': user
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>/status', methods=['PUT'])
@jwt_required()
def update_user_status(user_id):
    """Activate/deactivate user (admin only)"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        data = request.get_json()
        is_active = data.get('is_active')

        if is_active is None:
            return jsonify({'error': 'is_active field is required'}), 400

        # Find and update user
        user = next((u for u in MOCK_USERS if u['id'] == user_id), None)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        user['is_active'] = bool(is_active)
        user['updated_at'] = '2025-08-29T18:00:00Z'

        status = 'activated' if is_active else 'deactivated'
        return jsonify({
            'message': f'User {status} successfully',
            'user': user
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/create-arranger', methods=['POST'])
@jwt_required()
def create_arranger_account():
    """Create a new arranger account (admin only)"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not all([username, email, password]):
            return jsonify({'error': 'Username, email, and password are required'}), 400

        # Check if username already exists
        if any(u['username'] == username for u in MOCK_USERS):
            return jsonify({'error': 'Username already exists'}), 409

        # Create new user with arranger role
        import datetime
        new_user = {
            'id': max(u['id'] for u in MOCK_USERS) + 1,
            'username': username,
            'email': email,
            'role': 'arranger',
            'is_active': True,
            'created_at': datetime.datetime.now().isoformat() + 'Z'
        }
        
        MOCK_USERS.append(new_user)

        return jsonify({
            'message': 'Arranger account created successfully',
            'user': new_user
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/arrangements/pending', methods=['GET'])
@jwt_required()
def get_pending_arrangements():
    """Get arrangements pending approval (admin only)"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        # Mock pending arrangements
        pending_arrangements = [
            {
                'id': 7, 'type': 'Sehri', 'location': 'New Mosque, Bangalore',
                'description': 'Community Sehri arrangement', 'organizer': 'Bangalore Muslim Society',
                'created_by': 'organizer1', 'created_at': '2025-08-29T15:00:00Z',
                'is_approved': False, 'is_active': True
            },
            {
                'id': 8, 'type': 'Iftari', 'location': 'Community Hall, Chennai',
                'description': 'Tamil Muslim community Iftari', 'organizer': 'Chennai Islamic Center',
                'created_by': 'organizer2', 'created_at': '2025-08-29T14:30:00Z',
                'is_approved': False, 'is_active': True
            }
        ]

        return jsonify({
            'arrangements': pending_arrangements,
            'total': len(pending_arrangements)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/arrangements/<int:arrangement_id>/approve', methods=['PUT'])
@jwt_required()
def approve_arrangement(arrangement_id):
    """Approve arrangement (admin only)"""
    try:
        current_user = get_jwt_identity()

        if not check_admin_role(current_user):
            return jsonify({'error': 'Admin access required'}), 403

        data = request.get_json()
        approved = data.get('approved', True)

        # Mock approval process
        return jsonify({
            'message': f'Arrangement {"approved" if approved else "rejected"} successfully',
            'arrangement_id': arrangement_id,
            'approved_by': current_user,
            'approved_at': '2025-08-29T18:00:00Z'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
