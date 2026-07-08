/* ============================================
   AniVerse — Admin Authentication Client
   Handles login, logout, IP block checking
   ============================================ */

const API_BASE = 'http://localhost:5000/api';

const AdminAuth = {
  session: null,

  init() {
    this.session = this.getSession();
  },

  getSession() {
    try {
      const s = sessionStorage.getItem('admin_session');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  },

  setSession(data) {
    this.session = data;
    sessionStorage.setItem('admin_session', JSON.stringify(data));
  },

  clearSession() {
    this.session = null;
    sessionStorage.removeItem('admin_session');
  },

  isAuthenticated() {
    return this.session && this.session.token;
  },

  async checkBlockStatus() {
    try {
      const res = await fetch(`${API_BASE}/admin/check-block`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (data.blocked) {
        this.showIPBlock(data.message);
        document.getElementById('login-form').style.display = 'none';
        return true;
      }
      return false;
    } catch (e) {
      // If backend is offline, use local fallback
      console.warn('Backend offline, using local auth fallback');
      return false;
    }
  },

  async handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    const attemptsEl = document.getElementById('attempts-info');
    const btn = document.getElementById('login-btn');

    errorEl.classList.remove('show');
    btn.disabled = true;
    btn.textContent = 'Authenticating...';

    // Try backend first, fall back to local auth
    let result;
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      result = await res.json();

      if (result.blocked) {
        this.showIPBlock(result.message);
        document.getElementById('login-form').style.display = 'none';
        return false;
      }

      if (result.success) {
        this.setSession({
          token: result.token,
          username: username,
          loginTime: Date.now()
        });
        window.location.href = 'admin.html';
        return false;
      }

      // Show error
      errorEl.textContent = result.message;
      errorEl.classList.add('show');

      if (result.remaining !== undefined) {
        attemptsEl.textContent = `${result.remaining} attempt(s) remaining`;
        attemptsEl.className = 'login-attempts' +
          (result.remaining <= 1 ? ' danger' : result.remaining <= 2 ? ' warning' : '');
      }
    } catch (e) {
      // Local fallback auth (when backend is offline)
      console.warn('Backend offline, using local fallback auth');
      result = this.localAuth(username, password);

      if (result.blocked) {
        this.showIPBlock(result.message);
        document.getElementById('login-form').style.display = 'none';
        return false;
      }

      if (result.success) {
        this.setSession({
          token: 'local-' + Date.now(),
          username: username,
          loginTime: Date.now()
        });
        window.location.href = 'admin.html';
        return false;
      }

      errorEl.textContent = result.message;
      errorEl.classList.add('show');

      if (result.remaining !== undefined) {
        attemptsEl.textContent = `${result.remaining} attempt(s) remaining`;
        attemptsEl.className = 'login-attempts' +
          (result.remaining <= 1 ? ' danger' : result.remaining <= 2 ? ' warning' : '');
      }
    }

    btn.disabled = false;
    btn.textContent = 'Access Dashboard';
    return false;
  },

  // Local fallback auth with IP tracking via localStorage
  localAuth(username, password) {
    const ADMIN_USER = 'rajpapa';
    const ADMIN_PASS = '28@RajPapa';
    const BLOCK_THRESHOLD = 3;

    // Get or initialize attempts from localStorage (simulates IP tracking)
    const ipKey = 'admin_login_attempts';
    let attempts = JSON.parse(localStorage.getItem(ipKey) || '{"count":0,"blocked_until":null}');

    // Check if blocked
    if (attempts.blocked_until && Date.now() < attempts.blocked_until) {
      const remaining = Math.ceil((attempts.blocked_until - Date.now()) / (1000 * 60 * 60));
      return {
        success: false,
        blocked: true,
        message: `IP blocked. Try again in ${remaining} hour(s).`
      };
    }

    // Reset if block expired
    if (attempts.blocked_until && Date.now() >= attempts.blocked_until) {
      attempts = { count: 0, blocked_until: null };
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.removeItem(ipKey);
      return { success: true, token: 'local-' + Date.now() };
    }

    attempts.count += 1;
    const remaining = BLOCK_THRESHOLD - attempts.count;

    if (attempts.count >= BLOCK_THRESHOLD) {
      // Block for 24 hours
      attempts.blocked_until = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(ipKey, JSON.stringify(attempts));
      return {
        success: false,
        blocked: true,
        message: 'IP blocked for 24 hours due to 3 failed login attempts.'
      };
    }

    localStorage.setItem(ipKey, JSON.stringify(attempts));
    return {
      success: false,
      blocked: false,
      remaining: remaining,
      message: `Invalid credentials. ${remaining} attempt(s) remaining.`
    };
  },

  showIPBlock(message) {
    const alert = document.getElementById('ip-block-alert');
    const msgEl = document.getElementById('block-message');
    if (alert) {
      alert.style.display = 'flex';
      if (message && msgEl) msgEl.textContent = message;
    }
  },

  requireAuth() {
    this.init();
    if (!this.isAuthenticated()) {
      window.location.href = 'admin-login.html';
    }
  },

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.clearSession();
      window.location.href = 'admin-login.html';
    }
  }
};
