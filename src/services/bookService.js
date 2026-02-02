import { mockBooks } from './mockData';

const STORAGE_KEY = 'customBooks';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const safeArray = (v) => (Array.isArray(v) ? v : []);

const getCustomBooks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return safeArray(parsed);
  } catch {
    return [];
  }
};

const setCustomBooks = (books) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

const normalizeBook = (book) => {
  const nowYear = new Date().getFullYear();
  return {
    id: String(book.id),
    title: book.title || 'Untitled',
    author: book.author || 'Unknown',
    isbn: book.isbn || '',
    cover:
      book.cover ||
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    rating: typeof book.rating === 'number' ? book.rating : 4.2,
    pages: typeof book.pages === 'number' ? book.pages : 250,
    publishYear: typeof book.publishYear === 'number' ? book.publishYear : nowYear,
    genre: safeArray(book.genre).length ? safeArray(book.genre) : ['General'],
    description: book.description || 'No description available.',
    aiSummary: book.aiSummary || 'AI summary will appear here.',
    price: book.price || { amazon: 0, flipkart: 0, kindle: 0 },
    buyUrls: book.buyUrls || { amazon: '', flipkart: '', kindle: '' },
    sentiment: book.sentiment || { positive: 70, neutral: 20, critical: 10 },
    keywords: safeArray(book.keywords),
    popularity: typeof book.popularity === 'number' ? book.popularity : 70,
    source: book.source || 'local',
    readCount: typeof book.readCount === 'number' ? book.readCount : 0,
    readingHistory: safeArray(book.readingHistory),
  };
};

const googleToBook = (item) => {
  const info = item.volumeInfo || {};
  const id = item.id ? `gb:${item.id}` : `gb:${Math.random().toString(16).slice(2)}`;
  return normalizeBook({
    id,
    title: info.title,
    author: safeArray(info.authors).join(', ') || 'Unknown',
    isbn: (safeArray(info.industryIdentifiers)[0] && safeArray(info.industryIdentifiers)[0].identifier) || '',
    cover: info.imageLinks?.thumbnail?.replace('http://', 'https://') || info.imageLinks?.smallThumbnail?.replace('http://', 'https://'),
    rating: typeof info.averageRating === 'number' ? info.averageRating : 4.2,
    pages: typeof info.pageCount === 'number' ? info.pageCount : 250,
    publishYear: info.publishedDate ? Number(String(info.publishedDate).slice(0, 4)) : undefined,
    genre: safeArray(info.categories).slice(0, 3),
    description: info.description ? String(info.description).replace(/<[^>]+>/g, '') : '',
    aiSummary: '',
    keywords: [],
    popularity: 70,
    source: 'google',
  });
};

export const bookService = {
  // “All books” = mock + custom (local). API books are fetched on search.
  listAll: async () => {
    await delay(150);
    const custom = getCustomBooks().map(normalizeBook);
    return [...custom, ...mockBooks.map((b) => normalizeBook({ ...b, source: 'mock' }))];
  },

  search: async (query) => {
    const q = String(query || '').trim();
    if (!q) return bookService.listAll();

    // Prefer external API for search, with safe fallback to local/mock.
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20`);
      if (!res.ok) throw new Error('google_books_failed');
      const data = await res.json();
      const apiBooks = safeArray(data.items).map(googleToBook);
      const local = await bookService.listAll();
      // Merge (dedupe by id)
      const byId = new Map();
      [...apiBooks, ...local].forEach((b) => byId.set(b.id, b));
      return Array.from(byId.values());
    } catch {
      const local = await bookService.listAll();
      const lower = q.toLowerCase();
      return local.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower) ||
          b.genre.some((g) => String(g).toLowerCase().includes(lower))
      );
    }
  },

  getById: async (id) => {
    const all = await bookService.listAll();
    const found = all.find((b) => b.id === id);
    if (found) return found;

    // If it's a Google Books id, fetch details.
    if (String(id).startsWith('gb:')) {
      const volumeId = String(id).slice(3);
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(volumeId)}`);
        if (!res.ok) return null;
        const data = await res.json();
        return googleToBook(data);
      } catch {
        return null;
      }
    }

    return null;
  },

  addCustomBook: async (bookInput) => {
    await delay(150);
    const custom = getCustomBooks();
    const id = `local:${Date.now().toString(36)}`;
    const newBook = normalizeBook({ ...bookInput, id, source: 'local' });
    setCustomBooks([newBook, ...custom]);
    return newBook;
  },
};

