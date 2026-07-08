/* ============================================
   AniVerse — Reusable UI Components
   ============================================ */

const Components = {
  // === Anime Card ===
  animeCard(anime, size = 'md') {
    const saved = Store.isSaved(anime.id);
    const progress = Store.getContinueWatching().find(c => c.animeId === anime.id);
    const progressPercent = progress ? Math.min(progress.progress, 100) : 0;

    return `
      <div class="anime-card card-${size}" onclick="Router.navigate('/details/${anime.id}')">
        <div class="card-poster">
          <img src="${anime.poster}" alt="${anime.title}" loading="lazy" />
          ${anime.trending ? '<span class="card-badge">Trending</span>' : ''}
          <span class="card-rating">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${anime.rating}
          </span>
          ${progressPercent > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width:${progressPercent}%"></div></div>` : ''}
          <div class="card-overlay">
            <h3 class="card-title">${anime.title}</h3>
            <div class="card-meta">
              <span>${anime.year}</span>
              <span>•</span>
              <span>${anime.episodesAired} eps</span>
            </div>
          </div>
        </div>
        <div class="card-actions">
          <button class="card-action-btn" onclick="event.stopPropagation(); Router.navigate('/watch/${anime.id}/1')" aria-label="Watch Now">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
          </button>
          <button class="card-action-btn ${saved ? 'saved' : ''}" onclick="event.stopPropagation(); Components.toggleSave(${anime.id}, this)" aria-label="Save">
            <svg viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </button>
          <button class="card-action-btn" onclick="event.stopPropagation(); Components.share(${anime.id})" aria-label="Share">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
          </button>
        </div>
      </div>
    `;
  },

  // === Continue Watching Card ===
  continueCard(item) {
    const anime = AnimeAPI.getById(item.animeId);
    if (!anime) return '';
    return `
      <div class="continue-watching-card" onclick="Router.navigate('/watch/${item.animeId}/${item.episodeNumber}')">
        <div class="cw-thumbnail">
          <img src="${item.thumbnail}" alt="${item.animeTitle}" loading="lazy" />
          <div class="cw-play">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${item.progress}%"></div></div>
        </div>
        <div class="cw-info">
          <h4>${item.animeTitle}</h4>
          <p>Episode ${item.episodeNumber} • ${item.progress}% watched</p>
        </div>
      </div>
    `;
  },

  // === Section Header ===
  sectionHeader(title, link = null) {
    return `
      <div class="section-header">
        <h2 class="section-title"><span class="accent-bar"></span>${title}</h2>
        ${link ? `<a href="${link}" class="text-btn">See all →</a>` : ''}
      </div>
    `;
  },

  // === Genre Chips ===
  genreChips(active = null) {
    return GENRES.map(g =>
      `<button class="chip ${active === g ? 'active' : ''}" onclick="Components.filterGenre('${g}')">${g}</button>`
    ).join('');
  },

  // === Episode Item ===
  episodeItem(anime, ep) {
    const downloaded = Store.isDownloaded(anime.id, ep.id);
    return `
      <div class="episode-item" onclick="Router.navigate('/watch/${anime.id}/${ep.number}')">
        <div class="episode-thumb">
          <img src="${ep.thumbnail}" alt="Episode ${ep.number}" loading="lazy" />
          <span class="episode-num">EP ${ep.number}</span>
        </div>
        <div class="episode-info">
          <h4>${ep.title}</h4>
          <p>${ep.synopsis}</p>
        </div>
        <div class="episode-duration">
          ${ep.duration} min
          ${downloaded ? '<br><span style="color:var(--success)">✓ Downloaded</span>' : ''}
        </div>
      </div>
    `;
  },

  // === Rating Stars ===
  ratingStars(rating) {
    const stars = Math.round(rating / 2);
    return Array.from({ length: 5 }, (_, i) =>
      `<svg class="${i < stars ? '' : 'empty'}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
    ).join('');
  },

  // === Empty State ===
  emptyState(icon, title, text, actionLabel = null, actionFn = null) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${text}</p>
        ${actionLabel ? `<button class="btn-primary" onclick="${actionFn}">${actionLabel}</button>` : ''}
      </div>
    `;
  },

  // === Skeleton Loader ===
  skeletonRow() {
    return `
      <div class="skeleton-card-row">
        ${Array.from({ length: 6 }, () => '<div class="skeleton skeleton-card"></div>').join('')}
      </div>
    `;
  },

  // === Actions ===
  toggleSave(animeId, btn) {
    const saved = Store.toggleSaved(animeId);
    btn.classList.toggle('saved', saved);
    const svg = btn.querySelector('svg');
    svg.setAttribute('fill', saved ? 'currentColor' : 'none');
  },

  share(animeId) {
    const anime = AnimeAPI.getById(animeId);
    if (navigator.share) {
      navigator.share({ title: anime.title, text: `Check out ${anime.title} on AniVerse!` });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/#/details/${animeId}`);
      Toast.show('Link copied to clipboard', 'success');
    }
  },

  filterGenre(genre) {
    Router.navigate(`/explore?genre=${encodeURIComponent(genre)}`);
  }
};

// === Toast System ===
const Toast = {
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
      error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
      info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
    };

    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeIn 0.3s reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};
