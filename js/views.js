/* ============================================
   AniVerse — Page Views / Templates
   ============================================ */

const Views = {
  // ==========================================
  // HOME PAGE
  // ==========================================
  home() {
    const featured = AnimeAPI.getFeatured();
    const trending = AnimeAPI.getTrending();
    const popular = AnimeAPI.getPopular();
    const latestEps = AnimeAPI.getLatestEpisodes();
    const continueWatching = Store.getContinueWatching();
    const recentlyViewed = Store.getRecentlyViewed();

    return `
      <div class="home-view">
        ${this.heroCarousel(featured)}
        ${continueWatching.length > 0 ? this.section('Continue Watching', continueWatching.map(c => Components.continueCard(c)).join('')) : ''}
        ${this.section('Trending Now', trending.map(a => Components.animeCard(a, 'md')).join(''), '#/trending')}
        ${this.genresSection()}
        ${this.section('Latest Episodes', latestEps.slice(0, 8).map(ep => this.latestEpisodeCard(ep)).join(''))}
        ${this.section('Popular Anime', popular.map(a => Components.animeCard(a, 'md')).join(''), '#/explore')}
        ${recentlyViewed.length > 0 ? this.section('Recently Viewed', recentlyViewed.map(a => Components.animeCard(a, 'sm')).join('')) : ''}
      </div>
    `;
  },

  heroCarousel(featured) {
    if (!featured.length) return '';
    return `
      <div class="hero-carousel">
        <div class="hero-carousel-track no-scrollbar">
          ${featured.map((a, i) => `
            <div class="spotlight-card" onclick="Router.navigate('/details/${a.id}')">
              <img src="${a.banner}" alt="${a.title}" loading="lazy" />
              <div class="spotlight-overlay">
                <span class="hero-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Featured
                </span>
                <h3>${a.title}</h3>
                <div class="hero-meta">
                  <span>★ ${a.rating}</span>
                  <span class="dot"></span>
                  <span>${a.year}</span>
                  <span class="dot"></span>
                  <span>${a.genres.slice(0, 2).join(', ')}</span>
                </div>
                <p style="font-size:0.82rem;color:var(--text-secondary);display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:12px;">${a.synopsis}</p>
                <div class="hero-actions">
                  <button class="btn-primary" onclick="event.stopPropagation();Router.navigate('/watch/${a.id}/1')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                    Watch Now
                  </button>
                  <button class="btn-secondary" onclick="event.stopPropagation();Router.navigate('/details/${a.id}')">
                    Details
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="hero-dots">
          ${featured.map((_, i) => `<span class="hero-dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
        </div>
      </div>
    `;
  },

  section(title, content, link = null) {
    return `
      <section style="margin-bottom:32px;">
        ${Components.sectionHeader(title, link)}
        <div class="scroll-row no-scrollbar">${content}</div>
      </section>
    `;
  },

  genresSection() {
    return `
      <section style="margin-bottom:32px;">
        ${Components.sectionHeader('Browse by Genre')}
        <div class="genre-chips no-scrollbar">
          ${Components.genreChips()}
        </div>
      </section>
    `;
  },

  latestEpisodeCard(ep) {
    return `
      <div class="continue-watching-card" onclick="Router.navigate('/watch/${ep.anime.id}/${ep.number}')">
        <div class="cw-thumbnail">
          <img src="${ep.thumbnail}" alt="${ep.anime.title}" loading="lazy" />
          <div class="cw-play">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
          </div>
        </div>
        <div class="cw-info">
          <h4>${ep.anime.title}</h4>
          <p>Episode ${ep.number} • New</p>
        </div>
      </div>
    `;
  },

  // ==========================================
  // EXPLORE PAGE
  // ==========================================
  explore(data) {
    const genre = data.genre;
    const anime = genre ? AnimeAPI.getByGenre(genre) : AnimeAPI.getAll();

    return `
      <div class="explore-view view-enter">
        <h1 style="margin-bottom:8px;">Explore</h1>
        <p style="color:var(--text-secondary);margin-bottom:20px;font-size:0.9rem;">Discover anime by genre, year, and more</p>

        <div class="filter-bar no-scrollbar">
          <button class="chip ${!genre ? 'active' : ''}" onclick="Router.navigate('/explore')">All</button>
          ${GENRES.map(g => `<button class="chip ${genre === g ? 'active' : ''}" onclick="Router.navigate('/explore?genre=${encodeURIComponent(g)}')">${g}</button>`).join('')}
        </div>

        <div class="search-results-grid">
          ${anime.map(a => Components.animeCard(a, 'sm')).join('')}
        </div>
      </div>
    `;
  },

  // ==========================================
  // TRENDING PAGE
  // ==========================================
  trending() {
    const trending = AnimeAPI.getTrending();
    return `
      <div class="trending-view view-enter">
        <h1 style="margin-bottom:8px;">Trending Now</h1>
        <p style="color:var(--text-secondary);margin-bottom:24px;font-size:0.9rem;">The most watched anime this week</p>
        <div style="display:flex;flex-direction:column;gap:20px;">
          ${trending.map((a, i) => `
            <div style="position:relative;padding-left:40px;">
              <span class="trending-rank">${i + 1}</span>
              ${Components.animeCard(a, 'lg')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ==========================================
  // SAVED PAGE
  // ==========================================
  saved() {
    const saved = Store.getSaved();
    return `
      <div class="saved-view view-enter">
        <h1 style="margin-bottom:8px;">Saved Anime</h1>
        <p style="color:var(--text-secondary);margin-bottom:24px;font-size:0.9rem;">${saved.length} saved titles</p>
        ${saved.length > 0
          ? `<div class="search-results-grid">${saved.map(a => Components.animeCard(a, 'sm')).join('')}</div>`
          : Components.emptyState(
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>',
              'No saved anime yet',
              'Tap the bookmark icon on any anime to save it here for later',
              'Browse Anime',
              'Router.navigate("/explore")'
            )
        }
      </div>
    `;
  },

  // ==========================================
  // DOWNLOADS PAGE
  // ==========================================
  downloads() {
    const downloads = Store.getDownloads();
    return `
      <div class="downloads-view view-enter">
        <h1 style="margin-bottom:8px;">Downloads</h1>
        <p style="color:var(--text-secondary);margin-bottom:24px;font-size:0.9rem;">${downloads.length} downloaded episodes • Offline ready</p>
        ${downloads.length > 0
          ? downloads.map(d => `
              <div class="download-item">
                <div class="download-thumb">
                  <img src="${d.thumbnail}" alt="${d.animeTitle}" />
                </div>
                <div class="download-info">
                  <h4>${d.animeTitle}</h4>
                  <p>Episode ${d.episodeId.split('-')[1]} • ${d.size}</p>
                  <span class="download-size">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                    Downloaded
                  </span>
                </div>
                <div class="download-actions">
                  <button class="action-btn-sm" onclick="Router.navigate('/watch/${d.animeId}/${d.episodeId.split('-')[1]}')">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                  </button>
                  <button class="action-btn-sm danger" onclick="Store.removeDownload(${d.animeId}, '${d.episodeId}');Router.navigate('/downloads')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
            `).join('')
          : Components.emptyState(
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
              'No downloads yet',
              'Download episodes to watch offline without internet connection',
              'Browse Anime',
              'Router.navigate("/explore")'
            )
        }
      </div>
    `;
  },

  // ==========================================
  // PROFILE PAGE
  // ==========================================
  profile() {
    const stats = Store.getStats();
    return `
      <div class="profile-view view-enter">
        <div class="profile-header">
          <div class="profile-avatar">R</div>
          <div class="profile-info">
            <h1>AniVerse User</h1>
            <p>Premium Member • Joined 2024</p>
            <div class="profile-stats">
              <div class="stat-item">
                <div class="stat-value">${stats.saved}</div>
                <div class="stat-label">Saved</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${stats.downloads}</div>
                <div class="stat-label">Downloads</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${stats.watched}</div>
                <div class="stat-label">Watched</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${stats.favorites}</div>
                <div class="stat-label">Favorites</div>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-list">
          <div class="settings-item" onclick="Store.toggleTheme()">
            <div class="settings-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            </div>
            <div class="settings-content">
              <h4>Dark Mode</h4>
              <p>Toggle light/dark theme</p>
            </div>
            <div class="toggle ${Store.getPreference('theme') === 'dark' ? 'active' : ''}"></div>
          </div>

          <div class="settings-item" onclick="Store.toggleMode()">
            <div class="settings-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6L12 2z"/></svg>
            </div>
            <div class="settings-content">
              <h4>Luxury Mode</h4>
              <p>Premium gold accents and enhanced visuals</p>
            </div>
            <div class="toggle ${Store.getPreference('mode') === 'luxury' ? 'active' : ''}"></div>
          </div>

          <div class="settings-item" onclick="Store.setPreference('autoplay', !Store.getPreference('autoplay'))">
            <div class="settings-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3l14 9-14 9V3z"/></svg>
            </div>
            <div class="settings-content">
              <h4>Auto-play Next Episode</h4>
              <p>Automatically play next episode</p>
            </div>
            <div class="toggle ${Store.getPreference('autoplay') ? 'active' : ''}"></div>
          </div>

          <div class="settings-item">
            <div class="settings-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            </div>
            <div class="settings-content">
              <h4>Video Quality</h4>
              <p>Current: ${Store.getPreference('quality')}</p>
            </div>
            <div class="settings-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
          </div>

          <div class="settings-item" onclick="Store.clearContinueWatching();Toast.show('History cleared','success');Router.navigate('/profile')">
            <div class="settings-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </div>
            <div class="settings-content">
              <h4>Clear Watch History</h4>
              <p>Remove all continue watching data</p>
            </div>
          </div>

          <div class="settings-item" onclick="window.open('pages/admin-login.html', '_blank')">
            <div class="settings-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            </div>
            <div class="settings-content">
              <h4>Admin Panel</h4>
              <p>Access admin dashboard</p>
            </div>
            <div class="settings-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // SEARCH PAGE
  // ==========================================
  search(data) {
    const query = data.query;
    const results = query ? AnimeAPI.search(query) : [];

    return `
      <div class="search-view view-enter">
        <h1 style="margin-bottom:20px;">Search</h1>
        <div class="search-bar" style="max-width:600px;margin-bottom:24px;">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" id="search-page-input" placeholder="Search anime..." value="${query || ''}" oninput="Views.performSearch(this.value)" />
        </div>
        <div id="search-results">
          ${query
            ? (results.length > 0
                ? `<p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.88rem;">${results.length} results for "${query}"</p><div class="search-results-grid">${results.map(a => Components.animeCard(a, 'sm')).join('')}</div>`
                : Components.emptyState(
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
                    'No results found',
                    `No anime matched "${query}". Try different keywords.`
                  )
              )
            : Components.emptyState(
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
                'Search for anime',
                'Type in the search bar above to find your favorite anime'
              )
          }
        </div>
      </div>
    `;
  },

  performSearch(query) {
    const results = query ? AnimeAPI.search(query) : [];
    const container = document.getElementById('search-results');

    if (!query) {
      container.innerHTML = Components.emptyState(
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
        'Search for anime',
        'Type in the search bar above to find your favorite anime'
      );
      return;
    }

    if (results.length === 0) {
      container.innerHTML = Components.emptyState(
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
        'No results found',
        `No anime matched "${query}". Try different keywords.`
      );
      return;
    }

    container.innerHTML = `
      <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.88rem;">${results.length} results for "${query}"</p>
      <div class="search-results-grid">${results.map(a => Components.animeCard(a, 'sm')).join('')}</div>
    `;
  },

  // ==========================================
  // DETAILS PAGE
  // ==========================================
  details(data) {
    const anime = AnimeAPI.getById(data.id);
    if (!anime) return Views.notFound();

    Store.addRecentlyViewed(anime.id);
    const saved = Store.isSaved(anime.id);
    const favorite = Store.isFavorite(anime.id);
    const reviews = AnimeAPI.getReviews(anime.id);

    return `
      <div class="details-view view-enter">
        <div class="details-hero">
          <img src="${anime.banner}" alt="${anime.title}" />
          <div class="details-hero-overlay"></div>
        </div>

        <div class="details-body">
          <div class="details-poster">
            <img src="${anime.poster}" alt="${anime.title}" />
          </div>

          <div class="details-info">
            <h1>${anime.title}</h1>
            <p style="color:var(--text-tertiary);font-size:0.88rem;margin-bottom:12px;">${anime.titleJp}</p>

            <div class="details-meta">
              <span class="meta-pill">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ${anime.rating}
              </span>
              <span class="meta-pill">${anime.year}</span>
              <span class="meta-pill">${anime.episodesAired}/${anime.episodesTotal} eps</span>
              <span class="meta-pill">${anime.duration} min</span>
              <span class="meta-pill">${anime.studio}</span>
              <span class="meta-pill">${anime.status}</span>
            </div>

            <div class="details-genres">
              ${anime.genres.map(g => `<span class="chip" onclick="Router.navigate('/explore?genre=${encodeURIComponent(g)}')">${g}</span>`).join('')}
            </div>

            <p class="details-synopsis">${anime.synopsis}</p>

            <div class="details-actions">
              <button class="btn-primary btn-lg" onclick="Router.navigate('/watch/${anime.id}/1')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                Watch Now
              </button>
              <button class="btn-secondary" onclick="Store.toggleSaved(${anime.id});Router.navigate('/details/${anime.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                ${saved ? 'Saved' : 'Save'}
              </button>
              <button class="btn-secondary" onclick="Store.toggleFavorite(${anime.id});Router.navigate('/details/${anime.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                Favorite
              </button>
              <button class="btn-secondary" onclick="Components.share(${anime.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
                Share
              </button>
            </div>
          </div>
        </div>

        <section style="margin-top:32px;">
          ${Components.sectionHeader(`Episodes (${anime.episodesAired})`)}
          <div class="episode-list">
            ${anime.episodes.map(ep => Components.episodeItem(anime, ep)).join('')}
          </div>
        </section>

        ${reviews.length > 0 ? `
          <section style="margin-top:32px;">
            ${Components.sectionHeader('Reviews & Ratings')}
            <div style="display:flex;align-items:center;gap:20px;margin-bottom:20px;">
              <div style="text-align:center;">
                <div style="font-size:3rem;font-weight:800;font-family:var(--font-display);">${anime.rating}</div>
                <div class="rating-stars" style="justify-content:center;">${Components.ratingStars(anime.rating)}</div>
                <div style="font-size:0.75rem;color:var(--text-tertiary);margin-top:4px;">${reviews.length} reviews</div>
              </div>
            </div>
            ${reviews.map(r => `
              <div class="review-card">
                <div class="review-header">
                  <div class="review-avatar">${r.avatar}</div>
                  <div>
                    <div class="review-name">${r.user}</div>
                    <div class="review-date">${r.date}</div>
                  </div>
                  <div class="review-rating">${Components.ratingStars(r.rating * 2)}</div>
                </div>
                <p class="review-text">${r.text}</p>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  },

  // ==========================================
  // WATCH PAGE
  // ==========================================
  watch(data) {
    const anime = AnimeAPI.getById(data.id);
    if (!anime) return Views.notFound();

    const epNum = parseInt(data.episode) || 1;
    const episode = anime.episodes.find(e => e.number === epNum) || anime.episodes[0];
    const nextEp = anime.episodes.find(e => e.number === epNum + 1);

    // Update watch progress
    Store.updateProgress(anime.id, episode.id, 35, {
      title: episode.title,
      animeTitle: anime.title,
      thumbnail: episode.thumbnail,
      episodeNumber: episode.number
    });

    return `
      <div class="watch-view view-enter">
        <div class="watch-layout">
          <div>
            <div class="player-container">
              <div class="player-placeholder">
                <div class="play-button-large" onclick="Toast.show('Video player would load here','info')">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                </div>
              </div>
            </div>

            <div class="player-controls">
              <button class="player-btn" onclick="Toast.show('Previous episode','info')">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM9.5 12l8.5 6V6z"/></svg>
              </button>
              <button class="player-btn" onclick="Toast.show('Play/Pause','info')">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
              </button>
              <button class="player-btn" onclick="${nextEp ? `Router.navigate('/watch/${anime.id}/${nextEp.number}')` : "Toast.show('No next episode','info')"}">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>
              <div class="player-progress" onclick="Toast.show('Seek','info')">
                <div class="player-progress-fill"></div>
              </div>
              <span class="player-time">8:24 / 24:00</span>
              <button class="player-btn" onclick="Store.addDownload(${anime.id}, '${episode.id}', {title:'${episode.title}', animeTitle:'${anime.title}', thumbnail:'${episode.thumbnail}', size:'320 MB'});Router.navigate('/watch/${anime.id}/${epNum}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              </button>
              <button class="player-btn" onclick="Toast.show('Settings','info')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24"/></svg>
              </button>
            </div>

            <div style="margin-top:20px;">
              <h1 style="font-size:1.3rem;margin-bottom:6px;">${anime.title}</h1>
              <p style="color:var(--text-tertiary);font-size:0.88rem;margin-bottom:14px;">Episode ${episode.number} • ${episode.duration} min</p>
              <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.6;margin-bottom:20px;">${episode.synopsis}</p>

              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">
                ${anime.genres.map(g => `<span class="chip" onclick="Router.navigate('/explore?genre=${encodeURIComponent(g)}')">${g}</span>`).join('')}
              </div>

              ${nextEp && Store.getPreference('autoplay') ? `
                <div class="autoplay-next">
                  <div class="autoplay-next-info">
                    <h4>Up Next: Episode ${nextEp.number}</h4>
                    <p>Auto-playing in 10 seconds...</p>
                  </div>
                  <button class="btn-secondary btn-sm" onclick="Router.navigate('/watch/${anime.id}/${nextEp.number}')">Play Now</button>
                </div>
              ` : ''}
            </div>
          </div>

          <div>
            <div class="episode-sidebar">
              <div class="sidebar-header">
                <h3>Episodes (${anime.episodesAired})</h3>
                <button class="text-btn">Sort</button>
              </div>
              ${anime.episodes.map(ep => `
                <div class="episode-sidebar-item ${ep.number === epNum ? 'active' : ''}" onclick="Router.navigate('/watch/${anime.id}/${ep.number}')">
                  <div class="sidebar-ep-thumb">
                    <img src="${ep.thumbnail}" alt="Ep ${ep.number}" loading="lazy" />
                  </div>
                  <div class="sidebar-ep-info">
                    <h4>Episode ${ep.number}</h4>
                    <p>${ep.duration} min</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 404
  // ==========================================
  notFound() {
    return `
      <div class="view-enter" style="text-align:center;padding:80px 20px;">
        <h1 style="font-size:4rem;font-weight:900;" class="gradient-text">404</h1>
        <p style="color:var(--text-secondary);margin:12px 0 24px;">This page doesn't exist</p>
        <button class="btn-primary" onclick="Router.navigate('/')">Go Home</button>
      </div>
    `;
  }
};
