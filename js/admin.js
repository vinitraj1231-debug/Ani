/* ============================================
   AniVerse — Admin Panel Logic
   ============================================ */

const AdminPanel = {
  currentSection: 'dashboard',

  init() {
    this.showSection('dashboard');
  },

  showSection(section) {
    this.currentSection = section;
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });

    const titles = {
      dashboard: 'Dashboard',
      anime: 'Anime Management',
      episodes: 'Episodes',
      users: 'User Management',
      analytics: 'Analytics',
      security: 'Security & IP Blocks',
      settings: 'Settings'
    };

    document.getElementById('page-title').textContent = titles[section] || 'Dashboard';

    const content = document.getElementById('admin-content');
    const renderFn = this.sections[section];
    content.innerHTML = renderFn ? renderFn.call(this) : this.sections.dashboard.call(this);
  },

  sections: {
    dashboard() {
      return `
        <div class="stats-grid">
          ${this.statCard('Total Anime', '247', 'purple', 'up', '+12%', 'tv')}
          ${this.statCard('Total Users', '48.2K', 'pink', 'up', '+8.3%', 'users')}
          ${this.statCard('Episodes Streamed', '2.1M', 'green', 'up', '+24%', 'play')}
          ${this.statCard('Active Downloads', '15.4K', 'orange', 'down', '-3%', 'download')}
        </div>

        <div style="display:grid;grid-template-columns:1fr;gap:20px;">
          <div class="admin-panel-section">
            <div class="section-title-bar">
              <h2>Streaming Activity (Last 7 Days)</h2>
            </div>
            <div class="chart-container">
              ${[60, 45, 80, 65, 90, 75, 100].map((v, i) => `
                <div style="flex:1;text-align:center;">
                  <div class="chart-bar" style="height:${v * 2}px" data-value="${v}K"></div>
                  <div class="chart-label">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="admin-panel-section">
            <div class="section-title-bar">
              <h2>Top Trending Anime</h2>
              <button class="add-btn" onclick="AdminPanel.showAddAnimeModal()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                Add Anime
              </button>
            </div>
            <div style="overflow-x:auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Anime</th><th>Rating</th><th>Views</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${ANIME_DATA.slice(0, 5).map(a => `
                    <tr>
                      <td>
                        <div style="display:flex;align-items:center;gap:10px;">
                          <img class="table-poster" src="${a.poster}" alt="${a.title}" />
                          <span>${a.title}</span>
                        </div>
                      </td>
                      <td>★ ${a.rating}</td>
                      <td>${(Math.random() * 1000).toFixed(0)}K</td>
                      <td><span class="status-badge ${a.status === 'Ongoing' ? 'active' : 'offline'}">${a.status}</span></td>
                      <td>
                        <button class="action-btn-sm" onclick="AdminPanel.editAnime(${a.id})">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="action-btn-sm danger" onclick="AdminPanel.deleteAnime(${a.id})">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    anime() {
      return `
        <div class="admin-panel-section">
          <div class="section-title-bar">
            <h2>All Anime (${ANIME_DATA.length})</h2>
            <button class="add-btn" onclick="AdminPanel.showAddAnimeModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Add New Anime
            </button>
          </div>
          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Anime</th><th>Genre</th><th>Rating</th><th>Episodes</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${ANIME_DATA.map(a => `
                  <tr>
                    <td>#${a.id}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:10px;">
                        <img class="table-poster" src="${a.poster}" alt="${a.title}" />
                        <div>
                          <div style="font-weight:600;">${a.title}</div>
                          <div style="font-size:0.72rem;color:var(--text-3);">${a.studio}</div>
                        </div>
                      </div>
                    </td>
                    <td>${a.genres.slice(0, 2).join(', ')}</td>
                    <td>★ ${a.rating}</td>
                    <td>${a.episodesAired}/${a.episodesTotal}</td>
                    <td><span class="status-badge ${a.status === 'Ongoing' ? 'active' : 'offline'}">${a.status}</span></td>
                    <td>
                      <button class="action-btn-sm" onclick="AdminPanel.editAnime(${a.id})" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button class="action-btn-sm" onclick="AdminPanel.toggleStatus(${a.id})" title="Toggle Status">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10"/></svg>
                      </button>
                      <button class="action-btn-sm danger" onclick="AdminPanel.deleteAnime(${a.id})" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    episodes() {
      return `
        <div class="admin-panel-section">
          <div class="section-title-bar">
            <h2>Recent Episodes</h2>
            <button class="add-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Add Episode
            </button>
          </div>
          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr><th>Anime</th><th>Episode</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                ${ANIME_DATA.flatMap(a => a.episodes.slice(-2).map(ep => `
                  <tr>
                    <td>${a.title}</td>
                    <td>Episode ${ep.number}</td>
                    <td>${ep.duration} min</td>
                    <td><span class="status-badge active">Published</span></td>
                    <td>
                      <button class="action-btn-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button class="action-btn-sm danger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                    </td>
                  </tr>
                `)).slice(0, 15).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    users() {
      const mockUsers = [
        { id: 1, name: 'Akira Tanaka', email: 'akira@anime.com', plan: 'Premium', status: 'active', joined: '2024-01-15' },
        { id: 2, name: 'Sakura Yamamoto', email: 'sakura@anime.com', plan: 'Premium', status: 'active', joined: '2024-02-20' },
        { id: 3, name: 'Kenji Sato', email: 'kenji@anime.com', plan: 'Free', status: 'active', joined: '2024-03-10' },
        { id: 4, name: 'Yuki Nakamura', email: 'yuki@anime.com', plan: 'Premium', status: 'suspended', joined: '2024-04-05' },
        { id: 5, name: 'Hiroshi Suzuki', email: 'hiroshi@anime.com', plan: 'Free', status: 'active', joined: '2024-05-12' },
        { id: 6, name: 'Mei Chen', email: 'mei@anime.com', plan: 'Premium', status: 'active', joined: '2024-06-18' },
        { id: 7, name: 'Raj Sharma', email: 'raj@anime.com', plan: 'Premium', status: 'active', joined: '2024-07-22' },
        { id: 8, name: 'Luna Park', email: 'luna@anime.com', plan: 'Free', status: 'pending', joined: '2024-08-30' }
      ];

      return `
        <div class="stats-grid">
          ${this.statCard('Total Users', '48,234', 'pink', 'up', '+8.3%', 'users')}
          ${this.statCard('Premium Users', '12,891', 'purple', 'up', '+15.2%', 'star')}
          ${this.statCard('Active Today', '8,432', 'green', 'up', '+3.1%', 'play')}
          ${this.statCard('Suspended', '124', 'orange', 'down', '-12%', 'ban')}
        </div>

        <div class="admin-panel-section">
          <div class="section-title-bar">
            <h2>User Management</h2>
            <input type="text" placeholder="Search users..." style="padding:8px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.85rem;" />
          </div>
          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr><th>User</th><th>Email</th><th>Plan</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                ${mockUsers.map(u => `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:32px;height:32px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">${u.name[0]}</div>
                        <span>${u.name}</span>
                      </div>
                    </td>
                    <td style="color:var(--text-2);">${u.email}</td>
                    <td><span class="status-badge ${u.plan === 'Premium' ? 'active' : 'pending'}">${u.plan}</span></td>
                    <td>${u.joined}</td>
                    <td><span class="status-badge ${u.status === 'active' ? 'active' : u.status === 'suspended' ? 'offline' : 'pending'}">${u.status}</span></td>
                    <td>
                      <button class="action-btn-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                      <button class="action-btn-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10"/></svg></button>
                      <button class="action-btn-sm danger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    analytics() {
      return `
        <div class="stats-grid">
          ${this.statCard('Total Streams', '2.1M', 'purple', 'up', '+24%', 'play')}
          ${this.statCard('Avg Watch Time', '47 min', 'pink', 'up', '+8%', 'clock')}
          ${this.statCard('Completion Rate', '78%', 'green', 'up', '+5%', 'check')}
          ${this.statCard('Bounce Rate', '12%', 'orange', 'down', '-3%', 'arrow')}
        </div>

        <div class="admin-panel-section">
          <div class="section-title-bar"><h2>Genre Performance</h2></div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${GENRES.slice(0, 8).map((g, i) => `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:0.85rem;">
                  <span>${g}</span>
                  <span style="color:var(--text-2);">${90 - i * 8}%</span>
                </div>
                <div style="height:8px;background:var(--bg-3);border-radius:4px;overflow:hidden;">
                  <div style="height:100%;width:${90 - i * 8}%;background:var(--grad);border-radius:4px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="admin-panel-section">
          <div class="section-title-bar"><h2>Monthly Views</h2></div>
          <div class="chart-container">
            ${[40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 88, 100].map((v, i) => `
              <div style="flex:1;text-align:center;">
                <div class="chart-bar" style="height:${v * 1.8}px" data-value="${v * 10}K"></div>
                <div class="chart-label">${['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    security() {
      return `
        <div class="ip-block-alert" style="background:rgba(16,185,129,0.1);border-color:var(--success);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--success);"><path d="M9 12l2 2 4-4M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          <div>
            <h4 style="color:var(--success);">System Secure</h4>
            <p>All security systems operational. 3-attempt IP blocking is active.</p>
          </div>
        </div>

        <div class="stats-grid">
          ${this.statCard('Failed Attempts (24h)', '7', 'orange', 'down', '-2', 'warning')}
          ${this.statCard('Blocked IPs', '2', 'danger', 'up', '+1', 'ban')}
          ${this.statCard('Active Sessions', '1', 'green', '', '', 'check')}
          ${this.statCard('Security Score', '94/100', 'purple', 'up', '+2', 'star')}
        </div>

        <div class="admin-panel-section">
          <div class="section-title-bar">
            <h2>Blocked IP Addresses</h2>
            <button class="add-btn" style="background:var(--danger);" onclick="AdminPanel.clearAllBlocks()">Clear All Blocks</button>
          </div>
          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr><th>IP Address</th><th>Attempts</th><th>Blocked At</th><th>Expires</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-family:monospace;">192.168.1.105</td>
                  <td><span style="color:var(--danger);font-weight:600;">3/3</span></td>
                  <td>2024-11-15 14:23:11</td>
                  <td>2024-11-16 14:23:11</td>
                  <td>
                    <button class="action-btn-sm" onclick="AdminPanel.unblockIP('192.168.1.105')" title="Unblock">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10"/></svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td style="font-family:monospace;">10.0.0.42</td>
                  <td><span style="color:var(--danger);font-weight:600;">3/3</span></td>
                  <td>2024-11-15 09:15:33</td>
                  <td>2024-11-16 09:15:33</td>
                  <td>
                    <button class="action-btn-sm" onclick="AdminPanel.unblockIP('10.0.0.42')" title="Unblock">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="admin-panel-section">
          <div class="section-title-bar"><h2>Recent Login Activity</h2></div>
          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr><th>User</th><th>IP</th><th>Status</th><th>Time</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>rajpapa</td>
                  <td style="font-family:monospace;">192.168.1.1</td>
                  <td><span class="status-badge active">Success</span></td>
                  <td>2 minutes ago</td>
                </tr>
                <tr>
                  <td>unknown</td>
                  <td style="font-family:monospace;">192.168.1.105</td>
                  <td><span class="status-badge offline">Failed (3/3)</span></td>
                  <td>1 hour ago</td>
                </tr>
                <tr>
                  <td>unknown</td>
                  <td style="font-family:monospace;">10.0.0.42</td>
                  <td><span class="status-badge offline">Failed (3/3)</span></td>
                  <td>6 hours ago</td>
                </tr>
                <tr>
                  <td>rajpapa</td>
                  <td style="font-family:monospace;">192.168.1.1</td>
                  <td><span class="status-badge active">Success</span></td>
                  <td>1 day ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    settings() {
      return `
        <div class="admin-panel-section">
          <div class="section-title-bar"><h2>Admin Credentials</h2></div>
          <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;">
            <div>
              <label style="display:block;font-size:0.82rem;color:var(--text-2);margin-bottom:6px;">Username</label>
              <input type="text" value="rajpapa" readonly style="width:100%;padding:12px 16px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text-2);font-size:0.9rem;" />
            </div>
            <div>
              <label style="display:block;font-size:0.82rem;color:var(--text-2);margin-bottom:6px;">New Password</label>
              <input type="password" placeholder="Enter new password" style="width:100%;padding:12px 16px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.9rem;" />
            </div>
            <div>
              <label style="display:block;font-size:0.82rem;color:var(--text-2);margin-bottom:6px;">Confirm Password</label>
              <input type="password" placeholder="Confirm new password" style="width:100%;padding:12px 16px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.9rem;" />
            </div>
            <button class="add-btn" style="align-self:flex-start;" onclick="alert('Password updated successfully!')">Update Password</button>
          </div>
        </div>

        <div class="admin-panel-section">
          <div class="section-title-bar"><h2>Security Settings</h2></div>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:14px;background:var(--bg-3);border-radius:10px;">
              <div>
                <h4 style="font-size:0.9rem;">IP Block After 3 Failed Attempts</h4>
                <p style="font-size:0.78rem;color:var(--text-3);">Automatically block IP for 24 hours</p>
              </div>
              <div class="toggle active" style="width:44px;height:24px;background:var(--grad);border-radius:12px;position:relative;">
                <div style="position:absolute;top:2px;right:2px;width:20px;height:20px;background:white;border-radius:50%;"></div>
              </div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:14px;background:var(--bg-3);border-radius:10px;">
              <div>
                <h4 style="font-size:0.9rem;">Block Duration</h4>
                <p style="font-size:0.78rem;color:var(--text-3);">How long to block IPs after failed attempts</p>
              </div>
              <select style="padding:8px 12px;background:var(--bg-4);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.85rem;">
                <option>1 hour</option>
                <option selected>24 hours</option>
                <option>7 days</option>
                <option>Permanent</option>
              </select>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:14px;background:var(--bg-3);border-radius:10px;">
              <div>
                <h4 style="font-size:0.9rem;">Log All Login Attempts</h4>
                <p style="font-size:0.78rem;color:var(--text-3);">Keep a record of all login attempts</p>
              </div>
              <div class="toggle active" style="width:44px;height:24px;background:var(--grad);border-radius:12px;position:relative;">
                <div style="position:absolute;top:2px;right:2px;width:20px;height:20px;background:white;border-radius:50%;"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  // Helper for stat cards
  statCard(label, value, color, trend, trendVal, icon) {
    const icons = {
      tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>',
      users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
      play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>',
      download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
      star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
      arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
    };

    return `
      <div class="stat-card">
        <div class="stat-card-header">
          <div class="stat-icon ${color}">${icons[icon] || icons.star}</div>
          ${trend ? `<span class="stat-trend ${trend}">${trendVal}</span>` : ''}
        </div>
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
      </div>
    `;
  },

  // Actions
  showAddAnimeModal() {
    const overlay = document.getElementById('modal-overlay');
    const card = document.getElementById('modal-card');
    card.innerHTML = `
      <h3>Add New Anime</h3>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div>
          <label style="display:block;font-size:0.82rem;color:var(--text-2);margin-bottom:6px;">Title</label>
          <input type="text" placeholder="Enter anime title" style="width:100%;padding:10px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.9rem;" />
        </div>
        <div>
          <label style="display:block;font-size:0.82rem;color:var(--text-2);margin-bottom:6px;">Japanese Title</label>
          <input type="text" placeholder="日本語タイトル" style="width:100%;padding:10px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.9rem;" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div>
            <label style="display:block;font-size:0.82rem;color:var(--text-2);margin-bottom:6px;">Year</label>
            <input type="number" placeholder="2024" style="width:100%;padding:10px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.9rem;" />
          </div>
          <div>
            <label style="display:block;font-size:0.82rem;color:var(--text-2);margin-bottom:6px;">Episodes</label>
            <input type="number" placeholder="12" style="width:100%;padding:10px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.9rem;" />
          </div>
        </div>
        <div>
          <label style="display:block;font-size:0.82rem;color:var(--text-2);margin-bottom:6px;">Genres</label>
          <input type="text" placeholder="Action, Adventure" style="width:100%;padding:10px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.9rem;" />
        </div>
        <div>
          <label style="display:block;font-size:0.82rem;color:var(--text-2);margin-bottom:6px;">Synopsis</label>
          <textarea placeholder="Enter synopsis..." rows="3" style="width:100%;padding:10px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.9rem;resize:none;"></textarea>
        </div>
      </div>
      <div class="modal-actions">
        <button class="logout-btn" onclick="AdminPanel.closeModal()">Cancel</button>
        <button class="add-btn" onclick="AdminPanel.closeModal();alert('Anime added successfully!')">Add Anime</button>
      </div>
    `;
    overlay.classList.add('show');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('show');
  },

  editAnime(id) {
    const anime = AnimeAPI.getById(id);
    alert(`Edit: ${anime.title}\n(Edit form would open here)`);
  },

  deleteAnime(id) {
    const anime = AnimeAPI.getById(id);
    if (confirm(`Are you sure you want to delete "${anime.title}"?`)) {
      alert(`${anime.title} has been deleted.`);
    }
  },

  toggleStatus(id) {
    const anime = AnimeAPI.getById(id);
    alert(`${anime.title} status toggled.`);
  },

  unblockIP(ip) {
    if (confirm(`Unblock IP: ${ip}?`)) {
      // Also clear local attempts if using fallback
      localStorage.removeItem('admin_login_attempts');
      alert(`IP ${ip} has been unblocked.`);
      this.showSection('security');
    }
  },

  clearAllBlocks() {
    if (confirm('Clear all blocked IPs?')) {
      localStorage.removeItem('admin_login_attempts');
      alert('All IP blocks cleared.');
      this.showSection('security');
    }
  }
};

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay') {
    AdminPanel.closeModal();
  }
});
