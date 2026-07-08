/* ============================================
   AniVerse — Hash-Based SPA Router
   ============================================ */

const Router = {
  currentRoute: null,

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  navigate(path) {
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  parseHash() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');
    const segments = path.split('/').filter(Boolean);
    return { path, segments, params, raw: hash };
  },

  handleRoute() {
    const { segments, params } = this.parseHash();
    const view = document.getElementById('view');

    // Show skeleton briefly for smooth transition
    view.innerHTML = '';
    view.classList.remove('view-enter');

    let viewName = 'home';
    let data = {};

    if (segments.length === 0) {
      viewName = 'home';
    } else if (segments[0] === 'explore') {
      viewName = 'explore';
      data.genre = params.get('genre');
    } else if (segments[0] === 'trending') {
      viewName = 'trending';
    } else if (segments[0] === 'saved') {
      viewName = 'saved';
    } else if (segments[0] === 'downloads') {
      viewName = 'downloads';
    } else if (segments[0] === 'profile') {
      viewName = 'profile';
    } else if (segments[0] === 'search') {
      viewName = 'search';
      data.query = params.get('q') || '';
    } else if (segments[0] === 'details' && segments[1]) {
      viewName = 'details';
      data.id = segments[1];
    } else if (segments[0] === 'watch' && segments[1]) {
      viewName = 'watch';
      data.id = segments[1];
      data.episode = segments[2] || 1;
    } else {
      viewName = '404';
    }

    this.currentRoute = segments[0] || '/';

    // Render view
    const renderFn = Views[viewName];
    if (renderFn) {
      view.innerHTML = renderFn(data);
      // Trigger animation
      requestAnimationFrame(() => view.classList.add('view-enter'));
      // Call view init if exists
      if (Views[`${viewName}Init`]) {
        Views[`${viewName}Init`](data);
      }
    } else {
      view.innerHTML = Views.notFound();
    }

    // Update active nav
    this.updateActiveNav();
  },

  updateActiveNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      const route = item.dataset.route;
      const active = this.currentRoute === route ||
        (this.currentRoute === '/' && route === '/') ||
        (route !== '/' && this.currentRoute.startsWith(route));
      item.classList.toggle('active', active);
    });
  }
};
