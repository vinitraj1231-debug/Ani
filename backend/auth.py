"""
AniVerse — Authentication Manager
Handles admin credentials, IP tracking, and brute force protection
"""

import os
import json
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, session


class AuthManager:
    """Manages admin authentication and IP-based blocking"""

    # Admin credentials (in production, store hashed in database)
    ADMIN_USERNAME = "rajpapa"
    ADMIN_PASSWORD = "28@RajPapa"

    # Security settings
    MAX_ATTEMPTS = 3
    BLOCK_DURATION = timedelta(hours=24)
    ATTEMPTS_FILE = "attempts.json"

    def __init__(self):
        self.attempts = {}
        self.login_activity = []
        self._load_attempts()

    def _load_attempts(self):
        """Load persisted attempts from file"""
        try:
            if os.path.exists(self.ATTEMPTS_FILE):
                with open(self.ATTEMPTS_FILE, 'r') as f:
                    data = json.load(f)
                    # Convert string timestamps back to datetime
                    self.attempts = {}
                    for ip, info in data.get('attempts', {}).items():
                        blocked_until = None
                        if info.get('blocked_until'):
                            blocked_until = datetime.fromisoformat(info['blocked_until'])
                        self.attempts[ip] = {
                            'count': info.get('count', 0),
                            'blocked_until': blocked_until,
                            'last_attempt': datetime.fromisoformat(info['last_attempt'])
                            if info.get('last_attempt') else None
                        }
                    self.login_activity = data.get('activity', [])
        except Exception as e:
            print(f"Warning: Could not load attempts file: {e}")
            self.attempts = {}
            self.login_activity = []

    def _save_attempts(self):
        """Persist attempts to file"""
        try:
            data = {'attempts': {}, 'activity': self.login_activity[-100:]}
            for ip, info in self.attempts.items():
                data['attempts'][ip] = {
                    'count': info.get('count', 0),
                    'blocked_until': info['blocked_until'].isoformat()
                    if info.get('blocked_until') else None,
                    'last_attempt': info['last_attempt'].isoformat()
                    if info.get('last_attempt') else None
                }
            with open(self.ATTEMPTS_FILE, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save attempts file: {e}")

    def get_client_ip(self):
        """Extract client IP from request"""
        if request.headers.get('X-Forwarded-For'):
            return request.headers.get('X-Forwarded-For').split(',')[0].strip()
        if request.headers.get('X-Real-IP'):
            return request.headers.get('X-Real-IP')
        return request.remote_addr or '127.0.0.1'

    def validate_credentials(self, username, password):
        """Validate admin credentials"""
        return username == self.ADMIN_USERNAME and password == self.ADMIN_PASSWORD

    def is_blocked(self, ip):
        """Check if IP is currently blocked"""
        if ip not in self.attempts:
            return False

        info = self.attempts[ip]
        if not info.get('blocked_until'):
            return False

        # Check if block has expired
        if datetime.now() >= info['blocked_until']:
            # Auto-unblock expired blocks
            del self.attempts[ip]
            self._save_attempts()
            return False

        return True

    def record_failed_attempt(self, ip):
        """Record a failed login attempt and return attempts remaining"""
        now = datetime.now()

        if ip not in self.attempts:
            self.attempts[ip] = {'count': 0, 'blocked_until': None, 'last_attempt': None}

        self.attempts[ip]['count'] += 1
        self.attempts[ip]['last_attempt'] = now

        # Log activity
        self.login_activity.append({
            'ip': ip,
            'status': 'failed',
            'timestamp': now.isoformat(),
            'attempt': self.attempts[ip]['count']
        })

        remaining = self.MAX_ATTEMPTS - self.attempts[ip]['count']

        # Block IP if threshold reached
        if self.attempts[ip]['count'] >= self.MAX_ATTEMPTS:
            self.attempts[ip]['blocked_until'] = now + self.BLOCK_DURATION
            self.login_activity.append({
                'ip': ip,
                'status': 'blocked',
                'timestamp': now.isoformat(),
                'message': f'IP blocked for {self.BLOCK_DURATION}'
            })

        self._save_attempts()
        return remaining

    def clear_attempts(self, ip):
        """Clear failed attempts for an IP (on successful login)"""
        if ip in self.attempts:
            del self.attempts[ip]
            self._save_attempts()

        self.login_activity.append({
            'ip': ip,
            'status': 'success',
            'timestamp': datetime.now().isoformat()
        })
        self._save_attempts()

    def get_unblock_time(self, ip):
        """Get human-readable unblock time"""
        if ip in self.attempts and self.attempts[ip].get('blocked_until'):
            unblock = self.attempts[ip]['blocked_until']
            now = datetime.now()
            remaining = unblock - now

            hours = int(remaining.total_seconds() // 3600)
            minutes = int((remaining.total_seconds() % 3600) // 60)

            if hours > 0:
                return f"{hours} hour(s) and {minutes} minute(s)"
            return f"{minutes} minute(s)"
        return "Unknown"

    def unblock_ip(self, ip):
        """Manually unblock an IP"""
        if ip in self.attempts:
            del self.attempts[ip]
            self._save_attempts()

    def get_blocked_ips_list(self):
        """Get list of currently blocked IPs"""
        blocked = []
        for ip, info in self.attempts.items():
            if info.get('blocked_until') and datetime.now() < info['blocked_until']:
                blocked.append({
                    'ip': ip,
                    'attempts': info['count'],
                    'blocked_until': info['blocked_until'].isoformat(),
                    'last_attempt': info['last_attempt'].isoformat()
                    if info.get('last_attempt') else None
                })
        return blocked

    def get_failed_count_24h(self):
        """Count failed attempts in last 24 hours"""
        cutoff = datetime.now() - timedelta(hours=24)
        count = 0
        for activity in self.login_activity:
            if activity['status'] == 'failed':
                try:
                    ts = datetime.fromisoformat(activity['timestamp'])
                    if ts > cutoff:
                        count += 1
                except:
                    pass
        return count

    def get_blocked_count(self):
        """Count currently blocked IPs"""
        return len(self.get_blocked_ips_list())

    def get_login_activity(self):
        """Get recent login activity (last 50)"""
        return self.login_activity[-50:][::-1]  # Most recent first

    def require_auth(self, f):
        """Decorator to require admin authentication"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check session
            if not session.get('admin') or not session.get('admin_token'):
                return jsonify({
                    'success': False,
                    'message': 'Authentication required'
                }), 401

            # Verify IP matches session
            current_ip = self.get_client_ip()
            session_ip = session.get('admin_ip')

            if session_ip and current_ip != session_ip:
                session.clear()
                return jsonify({
                    'success': False,
                    'message': 'Session IP mismatch. Please login again.'
                }), 401

            return f(*args, **kwargs)
        return decorated_function
