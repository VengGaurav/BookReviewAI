const STORAGE_KEY = 'myReviewsByBookId';

const safeArray = (v) => (Array.isArray(v) ? v : []);

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeAll = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const reviewService = {
  list: (bookId) => {
    const all = readAll();
    return safeArray(all[bookId]).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  },

  add: (bookId, text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed) return null;
    const all = readAll();
    const item = {
      id: `rev:${Date.now().toString(36)}`,
      text: trimmed,
      createdAt: Date.now(),
    };
    const prev = safeArray(all[bookId]);
    all[bookId] = [item, ...prev];
    writeAll(all);
    return item;
  },
};

