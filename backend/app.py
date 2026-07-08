"""
AniVerse — Backend API Server
Flask application with admin authentication and IP blocking
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime, timedelta
import hashlib
import secrets
import json
import os

from auth import AuthManager

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'animeverse-secret-key-2024')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Configure CORS for frontend
CORS(app, origins=['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
     supports_credentials=True)

# Initialize auth manager
auth = AuthManager()

# === In-memory data stores (replace with database in production) ===
anime_data = []
users_data = []
download_logs = []

# === Health Check ===
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'AniVerse API',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat()
    })


# === Admin Authentication ===
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login with IP-based brute force protection"""
    ip = auth.get_client_ip()

    # Check if IP is already blocked
    if auth.is_blocked(ip):
        unblock_time = auth.get_unblock_time(ip)
        return jsonify({
            'success': False,
            'blocked': True,
            'message': f'IP blocked. Try again after {unblock_time}.'
        }), 403

    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400

    username = data.get('username', '').strip()
    password = data.get('password', '')

    # Validate credentials
    if auth.validate_credentials(username, password):
        # Successful login
        auth.clear_attempts(ip)
        token = secrets.token_urlsafe(32)

        session['admin'] = True
        session['admin_user'] = username
        session['admin_ip'] = ip
        session['admin_token'] = token
        session.permanent = True

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'username': username
        })
    else:
        # Failed login
        attempts_left = auth.record_failed_attempt(ip)

        if attempts_left <= 0:
            unblock_time = auth.get_unblock_time(ip)
            return jsonify({
                'success': False,
                'blocked': True,
                'message': f'IP blocked for 24 hours. Try again after {unblock_time}.'
            }), 403

        return jsonify({
            'success': False,
            'blocked': False,
            'remaining': attempts_left,
            'message': f'Invalid credentials. {attempts_left} attempt(s) remaining.'
        }), 401


@app.route('/api/admin/check-block', methods=['GET'])
def check_block():
    """Check if current IP is blocked"""
    ip = auth.get_client_ip()

    if auth.is_blocked(ip):
        unblock_time = auth.get_unblock_time(ip)
        return jsonify({
            'blocked': True,
            'message': f'IP blocked. Try again after {unblock_time}.'
        })
    return jsonify({'blocked': False})


@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    """Logout admin"""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out'})


@app.route('/api/admin/verify', methods=['GET'])
def verify_session():
    """Verify if admin session is valid"""
    if session.get('admin') and session.get('admin_token'):
        return jsonify({
            'valid': True,
            'username': session.get('admin_user')
        })
    return jsonify({'valid': False}), 401


# === Admin Dashboard Data ===
@app.route('/api/admin/dashboard', methods=['GET'])
@auth.require_auth
def dashboard_stats():
    """Get dashboard statistics"""
    return jsonify({
        'total_anime': len(anime_data) if anime_data else 247,
        'total_users': 48234,
        'premium_users': 12891,
        'episodes_streamed': 2100000,
        'active_downloads': 15400,
        'failed_attempts_24h': auth.get_failed_count_24h(),
        'blocked_ips': auth.get_blocked_count(),
        'security_score': 94
    })


@app.route('/api/admin/anime', methods=['GET'])
@auth.require_auth
def get_anime_list():
    """Get all anime (admin)"""
    return jsonify({'anime': anime_data, 'total': len(anime_data)})


@app.route('/api/admin/anime', methods=['POST'])
@auth.require_auth
def add_anime():
    """Add new anime"""
    data = request.get_json()
    new_id = len(anime_data) + 1 if anime_data else 1
    data['id'] = new_id
    anime_data.append(data)
    return jsonify({'success': True, 'anime': data}), 201


@app.route('/api/admin/anime/<int:anime_id>', methods=['PUT'])
@auth.require_auth
def update_anime(anime_id):
    """Update anime"""
    data = request.get_json()
    for i, a in enumerate(anime_data):
        if a.get('id') == anime_id:
            anime_data[i] = {**a, **data}
            return jsonify({'success': True, 'anime': anime_data[i]})
    return jsonify({'success': False, 'message': 'Anime not found'}), 404


@app.route('/api/admin/anime/<int:anime_id>', methods=['DELETE'])
@auth.require_auth
def delete_anime(anime_id):
    """Delete anime"""
    global anime_data
    anime_data = [a for a in anime_data if a.get('id') != anime_id]
    return jsonify({'success': True, 'message': 'Anime deleted'})


@app.route('/api/admin/blocked-ips', methods=['GET'])
@auth.require_auth
def get_blocked_ips():
    """Get list of blocked IPs"""
    return jsonify({'blocked_ips': auth.get_blocked_ips_list()})


@app.route('/api/admin/unblock-ip', methods=['POST'])
@auth.require_auth
def unblock_ip():
    """Unblock a specific IP"""
    data = request.get_json()
    ip = data.get('ip')
    if ip:
        auth.unblock_ip(ip)
        return jsonify({'success': True, 'message': f'IP {ip} unblocked'})
    return jsonify({'success': False, 'message': 'IP required'}), 400


@app.route('/api/admin/login-activity', methods=['GET'])
@auth.require_auth
def login_activity():
    """Get recent login activity"""
    return jsonify({'activity': auth.get_login_activity()})


# === Public API ===
@app.route('/api/anime', methods=['GET'])
def get_public_anime():
    """Get anime list (public)"""
    return jsonify({'anime': anime_data[:20] if anime_data else []})


@app.route('/api/anime/<int:anime_id>', methods=['GET'])
def get_public_anime_detail(anime_id):
    """Get single anime detail (public)"""
    for a in anime_data:
        if a.get('id') == anime_id:
            return jsonify({'anime': a})
    return jsonify({'error': 'Not found'}), 404


@app.route('/api/search', methods=['GET'])
def search_anime():
    """Search anime (public)"""
    query = request.args.get('q', '').lower()
    results = [a for a in anime_data
               if query in a.get('title', '').lower()
               or query in a.get('titleJp', '').lower()]
    return jsonify({'results': results, 'query': query})


# === Error Handlers ===
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    print("=" * 50)
    print("  AniVerse API Server")
    print("  Running on http://localhost:5000")
    print("  Admin credentials: rajpapa / 28@RajPapa")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)
