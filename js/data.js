/* ============================================
   AniVerse — Mock Data Layer
   Ready for API integration — replace with fetch calls
   ============================================ */

const API_BASE = 'http://localhost:5000/api';

// Helper to generate poster URLs using gradient-based placeholders
function poster(id, seed) {
  return `https://picsum.photos/seed/${seed || id}/300/450`;
}

function banner(id, seed) {
  return `https://picsum.photos/seed/${seed || id}-banner/800/450`;
}

function episodeThumb(id, ep) {
  return `https://picsum.photos/seed/${id}-ep${ep}/320/180`;
}

// Genre list
const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural',
  'Thriller', 'Mecha', 'Psychological', 'Historical'
];

// Anime Database
const ANIME_DATA = [
  {
    id: 1,
    title: 'Crimson Blade Chronicles',
    titleJp: '緋色の剣',
    poster: poster(1, 'crimson'),
    banner: banner(1, 'crimson'),
    rating: 9.4,
    year: 2024,
    season: 'Fall 2024',
    status: 'Ongoing',
    episodesTotal: 24,
    episodesAired: 18,
    duration: 24,
    studio: 'Ufotable',
    genres: ['Action', 'Supernatural', 'Adventure'],
    synopsis: 'In a world where demonic spirits roam free, a young swordsman inherits the legendary Crimson Blade and must master its power before darkness consumes the realm. As he journeys through war-torn provinces, he discovers that the blade\'s true power lies not in its edge, but in the bonds he forges along the way.',
    featured: true,
    trending: true,
    popular: true,
    episodes: Array.from({ length: 18 }, (_, i) => ({
      id: `${1}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(1, i + 1),
      duration: 24,
      synopsis: `The journey continues as our hero faces new challenges in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 2,
    title: 'Neon Skyline Riders',
    titleJp: 'ネオン・スカイライン',
    poster: poster(2, 'neon'),
    banner: banner(2, 'neon'),
    rating: 8.9,
    year: 2024,
    season: 'Summer 2024',
    status: 'Ongoing',
    episodesTotal: 12,
    episodesAired: 12,
    duration: 23,
    studio: 'Trigger',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    synopsis: 'In a neon-drenched megacity, a group of hoverbike riders discover a corporate conspiracy that could change the fate of millions. Racing through holographic canyons and dodging AI enforcers, they fight for freedom and the truth.',
    featured: true,
    trending: true,
    popular: true,
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: `${2}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(2, i + 1),
      duration: 23,
      synopsis: `High-speed action unfolds in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 3,
    title: 'Whispers of the Sakura',
    titleJp: '桜のささやき',
    poster: poster(3, 'sakura'),
    banner: banner(3, 'sakura'),
    rating: 9.1,
    year: 2024,
    season: 'Spring 2024',
    status: 'Completed',
    episodesTotal: 13,
    episodesAired: 13,
    duration: 24,
    studio: 'Kyoto Animation',
    genres: ['Romance', 'Slice of Life', 'Drama'],
    synopsis: 'A quiet love story set in a small town where cherry blossoms never stop falling. Two souls connected by a childhood promise must navigate the complexities of growing up, distance, and the courage to say what truly matters.',
    featured: false,
    trending: true,
    popular: true,
    episodes: Array.from({ length: 13 }, (_, i) => ({
      id: `${3}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(3, i + 1),
      duration: 24,
      synopsis: `Emotions deepen in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 4,
    title: 'Mecha Genesis: Zero Protocol',
    titleJp: 'メカジェネシス',
    poster: poster(4, 'mecha'),
    banner: banner(4, 'mecha'),
    rating: 8.7,
    year: 2024,
    season: 'Fall 2024',
    status: 'Ongoing',
    episodesTotal: 26,
    episodesAired: 10,
    duration: 24,
    studio: 'Sunrise',
    genres: ['Mecha', 'Sci-Fi', 'Action', 'Drama'],
    synopsis: 'When Earth\'s last defense system activates an experimental mech with a mind of its own, a reluctant pilot must bond with the machine to save humanity from an approaching alien fleet.',
    featured: true,
    trending: true,
    popular: false,
    episodes: Array.from({ length: 10 }, (_, i) => ({
      id: `${4}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(4, i + 1),
      duration: 24,
      synopsis: `The battle intensifies in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 5,
    title: 'Shadow Realm Academy',
    titleJp: '影の領域',
    poster: poster(5, 'shadow'),
    banner: banner(5, 'shadow'),
    rating: 8.5,
    year: 2024,
    season: 'Summer 2024',
    status: 'Ongoing',
    episodesTotal: 24,
    episodesAired: 15,
    duration: 23,
    studio: 'Bones',
    genres: ['Supernatural', 'Action', 'Mystery'],
    synopsis: 'Hidden beneath a prestigious academy lies a realm where students learn to harness shadow magic. But when students start disappearing, one girl must uncover the truth before she becomes the next victim.',
    featured: false,
    trending: true,
    popular: true,
    episodes: Array.from({ length: 15 }, (_, i) => ({
      id: `${5}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(5, i + 1),
      duration: 23,
      synopsis: `Mystery deepens in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 6,
    title: 'Stellar Voyage: Beyond',
    titleJp: '星の航海',
    poster: poster(6, 'stellar'),
    banner: banner(6, 'stellar'),
    rating: 9.0,
    year: 2024,
    season: 'Spring 2024',
    status: 'Completed',
    episodesTotal: 24,
    episodesAired: 24,
    duration: 24,
    studio: 'Wit Studio',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    synopsis: 'A deep space exploration crew discovers a signal from beyond the known galaxy. Their journey to find its source will test the limits of human endurance, friendship, and the very nature of reality itself.',
    featured: false,
    trending: false,
    popular: true,
    episodes: Array.from({ length: 24 }, (_, i) => ({
      id: `${6}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(6, i + 1),
      duration: 24,
      synopsis: `The voyage continues in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 7,
    title: 'Café Lumière Dreams',
    titleJp: 'カフェ・ルミエール',
    poster: poster(7, 'cafe'),
    banner: banner(7, 'cafe'),
    rating: 8.3,
    year: 2024,
    season: 'Fall 2024',
    status: 'Ongoing',
    episodesTotal: 12,
    episodesAired: 6,
    duration: 23,
    studio: 'P.A. Works',
    genres: ['Slice of Life', 'Romance', 'Comedy'],
    synopsis: 'A magical café where the coffee grants temporary dreams. The young barista must learn the recipes, handle eccentric customers, and discover the secret of the café\'s enigmatic owner.',
    featured: false,
    trending: false,
    popular: true,
    episodes: Array.from({ length: 6 }, (_, i) => ({
      id: `${7}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(7, i + 1),
      duration: 23,
      synopsis: `A new dream brews in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 8,
    title: 'Frostfire Saga',
    titleJp: '氷炎のサーガ',
    poster: poster(8, 'frost'),
    banner: banner(8, 'frost'),
    rating: 9.2,
    year: 2024,
    season: 'Fall 2024',
    status: 'Ongoing',
    episodesTotal: 24,
    episodesAired: 8,
    duration: 24,
    studio: 'MAPPA',
    genres: ['Fantasy', 'Action', 'Adventure'],
    synopsis: 'In a land divided between eternal ice and eternal flame, twin siblings with opposing powers must reunite to prevent a catastrophic war. But ancient forces manipulate them from the shadows.',
    featured: true,
    trending: true,
    popular: true,
    episodes: Array.from({ length: 8 }, (_, i) => ({
      id: `${8}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(8, i + 1),
      duration: 24,
      synopsis: `Fire and ice collide in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 9,
    title: 'Digital Phantom',
    titleJp: 'デジタルファントム',
    poster: poster(9, 'phantom'),
    banner: banner(9, 'phantom'),
    rating: 8.6,
    year: 2024,
    season: 'Summer 2024',
    status: 'Completed',
    episodesTotal: 11,
    episodesAired: 11,
    duration: 24,
    studio: 'Production I.G',
    genres: ['Psychological', 'Thriller', 'Sci-Fi'],
    synopsis: 'A hacker discovers a digital ghost living inside the city\'s network. As they communicate, the line between virtual and reality blurs, leading to a conspiracy that spans both worlds.',
    featured: false,
    trending: true,
    popular: false,
    episodes: Array.from({ length: 11 }, (_, i) => ({
      id: `${9}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(9, i + 1),
      duration: 24,
      synopsis: `The truth unravels in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 10,
    title: 'Samurai of the Last Dawn',
    titleJp: '最後の暁の侍',
    poster: poster(10, 'samurai'),
    banner: banner(10, 'samurai'),
    rating: 9.3,
    year: 2024,
    season: 'Spring 2024',
    status: 'Completed',
    episodesTotal: 26,
    episodesAired: 26,
    duration: 24,
    studio: 'Madhouse',
    genres: ['Action', 'Historical', 'Drama'],
    synopsis: 'In the final days of the samurai era, one warrior refuses to give up his sword. His journey through a changing Japan is a tale of honor, loss, and the eternal spirit of the warrior.',
    featured: false,
    trending: false,
    popular: true,
    episodes: Array.from({ length: 26 }, (_, i) => ({
      id: `${10}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(10, i + 1),
      duration: 24,
      synopsis: `The last dawn approaches in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 11,
    title: 'Pixel Quest Heroes',
    titleJp: 'ピクセルクエスト',
    poster: poster(11, 'pixel'),
    banner: banner(11, 'pixel'),
    rating: 8.1,
    year: 2024,
    season: 'Fall 2024',
    status: 'Ongoing',
    episodesTotal: 12,
    episodesAired: 4,
    duration: 23,
    studio: 'A-1 Pictures',
    genres: ['Comedy', 'Adventure', 'Fantasy'],
    synopsis: 'Three friends are sucked into a retro video game and must level up to find their way home. Along the way, they discover that the game holds secrets about their own world.',
    featured: false,
    trending: false,
    popular: false,
    episodes: Array.from({ length: 4 }, (_, i) => ({
      id: `${11}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(11, i + 1),
      duration: 23,
      synopsis: `The quest continues in episode ${i + 1}.`,
      aired: true
    }))
  },
  {
    id: 12,
    title: 'Ocean Kingdom Rebellion',
    titleJp: '海洋王国の反乱',
    poster: poster(12, 'ocean'),
    banner: banner(12, 'ocean'),
    rating: 8.8,
    year: 2024,
    season: 'Summer 2024',
    status: 'Ongoing',
    episodesTotal: 24,
    episodesAired: 12,
    duration: 24,
    studio: 'Science SARU',
    genres: ['Fantasy', 'Adventure', 'Action'],
    synopsis: 'Beneath the waves lies a kingdom on the brink of revolution. A young princess must choose between her royal duty and the freedom of her people as ancient sea creatures awaken.',
    featured: true,
    trending: true,
    popular: true,
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: `${12}-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: episodeThumb(12, i + 1),
      duration: 24,
      synopsis: `The tides turn in episode ${i + 1}.`,
      aired: true
    }))
  }
];

// Mock Reviews
const REVIEWS = {
  1: [
    { user: 'AkiraT', avatar: 'A', rating: 5, date: '2 days ago', text: 'Absolutely breathtaking animation and storytelling. The fight choreography is on another level.' },
    { user: 'SakuraX', avatar: 'S', rating: 4, date: '5 days ago', text: 'Great series but some pacing issues in the middle episodes. Overall a fantastic watch.' },
    { user: 'KenjiM', avatar: 'K', rating: 5, date: '1 week ago', text: 'This is the anime of the year. No contest. The emotional depth is incredible.' }
  ],
  2: [
    { user: 'NeonRider', avatar: 'N', rating: 5, date: '3 days ago', text: 'Trigger does it again! Pure adrenaline from start to finish.' },
    { user: 'MechaFan', avatar: 'M', rating: 4, date: '1 week ago', text: 'Loved the art style and soundtrack. Wished it was longer.' }
  ]
};

// Mock Notifications
const NOTIFICATIONS = [
  { id: 1, type: 'new_episode', title: 'New Episode Available', text: 'Crimson Blade Chronicles Episode 19 is now streaming', time: '2 hours ago', icon: 'play' },
  { id: 2, type: 'download', title: 'Download Complete', text: 'Neon Skyline Riders Episode 12 downloaded', time: '5 hours ago', icon: 'download' },
  { id: 3, type: 'recommendation', title: 'New Recommendation', text: 'Based on your watch history, try Frostfire Saga', time: '1 day ago', icon: 'star' }
];

// Data access functions (simulate API)
const AnimeAPI = {
  getAll: () => ANIME_DATA,

  getById: (id) => ANIME_DATA.find(a => a.id === parseInt(id)),

  getFeatured: () => ANIME_DATA.filter(a => a.featured),

  getTrending: () => ANIME_DATA.filter(a => a.trending),

  getPopular: () => ANIME_DATA.filter(a => a.popular),

  getLatestEpisodes: () => {
    const episodes = [];
    ANIME_DATA.forEach(anime => {
      // Get the last 2 aired episodes for each anime to simulate "latest"
      const latestEps = anime.episodes.slice(-2);
      latestEps.forEach(ep => {
        episodes.push({
          ...ep,
          anime: {
            id: anime.id,
            title: anime.title,
            poster: anime.poster
          }
        });
      });
    });
    // Randomize slightly and take top 12
    return episodes.sort(() => Math.random() - 0.5).slice(0, 12);
  },

  getByGenre: (genre) => ANIME_DATA.filter(a => a.genres.includes(genre)),

  getByYear: (year) => ANIME_DATA.filter(a => a.year === parseInt(year)),

  search: (query) => {
    const q = query.toLowerCase();
    return ANIME_DATA.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.titleJp.includes(q) ||
      a.genres.some(g => g.toLowerCase().includes(q)) ||
      a.studio.toLowerCase().includes(q)
    );
  },

  getReviews: (animeId) => REVIEWS[animeId] || []
};
