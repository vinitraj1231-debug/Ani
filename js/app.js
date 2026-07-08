/* ============================================
   AniVerse — Main Application Controller
   ============================================ */

const App = {
  init() {
    // Initialize Core Modules
    Store.init();
    Router.init();

    // Setup Global Listeners
    this.setupEventListeners();

    // Check for onboarding
    if (Store.needsOnboarding()) {
      document.getElementById('onboarding').hidden = false;
    }

    // Initial UI state
    this.updateThemeIcon();
    this.checkScroll();

    console.log('🎬 AniVerse Initialized');
  },

  setupEventListeners() {
    // Global Search
    const searchInput = document.getElementById('global-search');
    const suggestions = document.getElementById('search-suggestions');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length > 1) {
        this.showSuggestions(query);
      } else {
        suggestions.hidden = true;
      }
    });

    // Close panels on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar')) {
        suggestions.hidden = true;
      }
      if (!e.target.closest('.icon-btn') && !e.target.closest('#notification-panel')) {
        document.getElementById('notification-panel').hidden = true;
      }
    });

    // Scroll listener for FAB
    window.addEventListener('scroll', () => this.checkScroll());

    // Listen for hash changes to close panels
    window.addEventListener('hashchange', () => {
      document.getElementById('notification-panel').hidden = true;
      document.getElementById('search-suggestions').hidden = true;
      const searchInput = document.getElementById('global-search');
      if (searchInput) searchInput.value = '';
    });
  },

  // === UI Actions ===
  toggleTheme() {
    Store.toggleTheme();
    this.updateThemeIcon();
  },

  updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    const theme = Store.getPreference('theme');
    if (theme === 'dark') {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
    } else {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    }
  },

  toggleNotifications() {
    const panel = document.getElementById('notification-panel');
    const list = document.getElementById('notification-list');

    if (panel.hidden) {
      this.renderNotifications();
      panel.hidden = false;
    } else {
      panel.hidden = true;
    }
  },

  renderNotifications() {
    const list = document.getElementById('notification-list');
    const notes = Store.getNotifications();

    if (notes.length === 0) {
      list.innerHTML = '<p style="text-align:center;padding:20px;color:var(--text-tertiary);font-size:0.85rem;">No new notifications</p>';
      return;
    }

    list.innerHTML = notes.map(n => `
      <div class="notification-item" onclick="Toast.show('Notification clicked','info')">
        <div class="notification-icon">
          ${this.getNotificationIcon(n.type)}
        </div>
        <div class="notification-content">
          <h4>${n.title}</h4>
          <p>${n.text}</p>
          <div class="notification-time">${n.time}</div>
        </div>
      </div>
    `).join('');
  },

  getNotificationIcon(type) {
    if (type === 'new_episode') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3l14 9-14 9V3z"/></svg>';
    if (type === 'download') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>';
  },

  clearNotifications() {
    Store.clearNotifications();
    this.renderNotifications();
    Toast.show('Notifications cleared', 'success');
  },

  dismissOnboarding() {
    document.getElementById('onboarding').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('onboarding').hidden = true;
      Store.completeOnboarding();
    }, 400);
  },

  showSuggestions(query) {
    const suggestions = document.getElementById('search-suggestions');
    const results = AnimeAPI.search(query).slice(0, 5);

    if (results.length === 0) {
      suggestions.hidden = true;
      return;
    }

    suggestions.innerHTML = results.map(a => `
      <div class="suggestion-item" onclick="Router.navigate('/details/${a.id}')">
        <img src="${a.poster}" class="suggestion-poster" alt="" />
        <div class="suggestion-info">
          <h4>${a.title}</h4>
          <p>${a.genres.slice(0, 2).join(', ')} • ${a.year}</p>
        </div>
      </div>
    `).join('');
    suggestions.hidden = false;
  },

  checkScroll() {
    const fab = document.getElementById('fab');
    if (window.scrollY > 400) {
      fab.classList.add('visible');
    } else {
      fab.classList.remove('visible');
    }
  },

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
