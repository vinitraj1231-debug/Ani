/* ============================================
   AniVerse — State Management Store
   Persistent state via localStorage
   ============================================ */

const Store = {
  state: {
    saved: [],           // Saved anime IDs
    favorites: [],       // Favorite anime IDs
    downloads: [],       // { animeId, episodeId, title, thumbnail, size, progress }
    continueWatching: [], // { animeId, episodeId, progress, title, thumbnail }
    recentlyViewed: [],  // Anime IDs (most recent first)
    preferences: {
      theme: 'dark',     // dark | light
      mode: 'standard',  // standard | luxury
      autoplay: true,
      quality: '1080p',
      notifications: true
    },
    notifications: NOTIFICATIONS,
    onboardingComplete: false
  },

  init() {
    this.load();
    this.applyTheme();
  },

  load() {
    try {
      const saved = localStorage.getItem('animeverse_state');
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
  },

  save() {
    try {
      localStorage.setItem('animeverse_state', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  },

  // === Saved Anime ===
  toggleSaved(animeId) {
    animeId = parseInt(animeId);
    const idx = this.state.saved.indexOf(animeId);
    if (idx > -1) {
      this.state.saved.splice(idx, 1);
      Toast.show('Removed from saved', 'info');
    } else {
      this.state.saved.push(animeId);
      Toast.show('Added to saved', 'success');
    }
    this.save();
    return this.isSaved(animeId);
  },

  isSaved(animeId) {
    return this.state.saved.includes(parseInt(animeId));
  },

  getSaved() {
    return this.state.saved.map(id => AnimeAPI.getById(id)).filter(Boolean);
  },

  // === Favorites ===
  toggleFavorite(animeId) {
    animeId = parseInt(animeId);
    const idx = this.state.favorites.indexOf(animeId);
    if (idx > -1) {
      this.state.favorites.splice(idx, 1);
    } else {
      this.state.favorites.push(animeId);
    }
    this.save();
  },

  isFavorite(animeId) {
    return this.state.favorites.includes(parseInt(animeId));
  },

  // === Downloads ===
  addDownload(animeId, episodeId, info) {
    const existing = this.state.downloads.find(
      d => d.animeId === parseInt(animeId) && d.episodeId === episodeId
    );
    if (existing) return;

    this.state.downloads.unshift({
      animeId: parseInt(animeId),
      episodeId,
      title: info.title,
      animeTitle: info.animeTitle,
      thumbnail: info.thumbnail,
      size: info.size || '320 MB',
      progress: 0,
      date: Date.now()
    });
    this.save();
    Toast.show('Download started', 'success');
  },

  removeDownload(animeId, episodeId) {
    this.state.downloads = this.state.downloads.filter(
      d => !(d.animeId === parseInt(animeId) && d.episodeId === episodeId)
    );
    this.save();
    Toast.show('Download removed', 'info');
  },

  getDownloads() {
    return this.state.downloads;
  },

  isDownloaded(animeId, episodeId) {
    return this.state.downloads.some(
      d => d.animeId === parseInt(animeId) && d.episodeId === episodeId
    );
  },

  // === Continue Watching ===
  updateProgress(animeId, episodeId, progress, info) {
    const existing = this.state.continueWatching.find(
      c => c.animeId === parseInt(animeId) && c.episodeId === episodeId
    );

    if (existing) {
      existing.progress = progress;
      existing.lastWatched = Date.now();
    } else {
      this.state.continueWatching.unshift({
        animeId: parseInt(animeId),
        episodeId,
        progress,
        title: info.title,
        animeTitle: info.animeTitle,
        thumbnail: info.thumbnail,
        episodeNumber: info.episodeNumber,
        lastWatched: Date.now()
      });
    }

    // Keep only last 20
    if (this.state.continueWatching.length > 20) {
      this.state.continueWatching = this.state.continueWatching.slice(0, 20);
    }

    this.save();
  },

  getContinueWatching() {
    return this.state.continueWatching.sort((a, b) => b.lastWatched - a.lastWatched);
  },

  clearContinueWatching() {
    this.state.continueWatching = [];
    this.save();
  },

  // === Recently Viewed ===
  addRecentlyViewed(animeId) {
    animeId = parseInt(animeId);
    const idx = this.state.recentlyViewed.indexOf(animeId);
    if (idx > -1) this.state.recentlyViewed.splice(idx, 1);
    this.state.recentlyViewed.unshift(animeId);
    if (this.state.recentlyViewed.length > 12) {
      this.state.recentlyViewed = this.state.recentlyViewed.slice(0, 12);
    }
    this.save();
  },

  getRecentlyViewed() {
    return this.state.recentlyViewed.map(id => AnimeAPI.getById(id)).filter(Boolean);
  },

  // === Preferences ===
  setPreference(key, value) {
    this.state.preferences[key] = value;
    this.save();
    if (key === 'theme' || key === 'mode') this.applyTheme();
  },

  getPreference(key) {
    return this.state.preferences[key];
  },

  applyTheme() {
    document.documentElement.dataset.theme = this.state.preferences.theme;
    document.documentElement.dataset.mode = this.state.preferences.mode;
  },

  toggleTheme() {
    const current = this.state.preferences.theme;
    this.setPreference('theme', current === 'dark' ? 'light' : 'dark');
  },

  toggleMode() {
    const current = this.state.preferences.mode;
    this.setPreference('mode', current === 'standard' ? 'luxury' : 'standard');
    Toast.show(`${current === 'standard' ? 'Luxury' : 'Standard'} mode activated`, 'success');
  },

  // === Notifications ===
  getNotifications() {
    return this.state.notifications;
  },

  clearNotifications() {
    this.state.notifications = [];
    this.save();
  },

  // === Onboarding ===
  completeOnboarding() {
    this.state.onboardingComplete = true;
    this.save();
  },

  needsOnboarding() {
    return !this.state.onboardingComplete;
  },

  // === Stats (for profile) ===
  getStats() {
    return {
      saved: this.state.saved.length,
      downloads: this.state.downloads.length,
      watched: this.state.continueWatching.length,
      favorites: this.state.favorites.length
    };
  }
};
