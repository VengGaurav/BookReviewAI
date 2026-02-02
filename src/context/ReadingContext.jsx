import React, { createContext, useContext, useState, useEffect } from 'react';

const ReadingContext = createContext();

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReading must be used within ReadingProvider');
  }
  return context;
};

export const ReadingProvider = ({ children }) => {
  const [readingData, setReadingData] = useState({
    booksRead: [],
    currentlyReading: [],
    wishlist: [],
    abandoned: [],
    readingSessions: [],
    totalHours: 0,
    streak: 0,
    achievements: []
  });
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('readingData');
    if (stored) {
      setReadingData(JSON.parse(stored));
    }
    const sessionStored = localStorage.getItem('activeReadingSession');
    if (sessionStored) {
      setActiveSession(JSON.parse(sessionStored));
    }
  }, []);

  useEffect(() => {
    if (activeSession) localStorage.setItem('activeReadingSession', JSON.stringify(activeSession));
    else localStorage.removeItem('activeReadingSession');
  }, [activeSession]);

  const saveData = (data) => {
    localStorage.setItem('readingData', JSON.stringify(data));
    setReadingData(data);
  };

  const getBookStatus = (bookId) => {
    if (readingData.currentlyReading.some((b) => b.id === bookId)) return 'currentlyReading';
    if (readingData.booksRead.some((b) => b.id === bookId)) return 'completed';
    if (readingData.wishlist.some((b) => b.id === bookId)) return 'wantToRead';
    return null;
  };

  const setBookStatus = (book, status) => {
    const id = book.id;
    if (!id) return;

    const base = { ...readingData };
    const now = new Date().toISOString();

    if (status === 'currentlyReading') {
      const inList = base.currentlyReading.some((b) => b.id === id);
      const currentlyReading = inList
        ? base.currentlyReading
        : [...base.currentlyReading, { ...book, addedDate: now }];
      const wishlist = base.wishlist.filter((b) => b.id !== id);
      saveData({ ...base, currentlyReading, wishlist });
    } else if (status === 'completed') {
      const booksRead = [...base.booksRead];
      const idx = booksRead.findIndex((b) => b.id === id);
      if (idx >= 0) {
        const existing = booksRead[idx];
        const history = existing.readingHistory || [];
        booksRead[idx] = {
          ...existing,
          finishedDate: now,
          readCount: typeof existing.readCount === 'number' ? existing.readCount : 1,
          readingHistory: [...history, { finishedAt: now }],
        };
      } else {
        booksRead.push({
          ...book,
          finishedDate: now,
          readCount: 1,
          readingHistory: [{ finishedAt: now }],
        });
      }
      const currentlyReading = base.currentlyReading.filter((b) => b.id !== id);
      const wishlist = base.wishlist.filter((b) => b.id !== id);
      saveData({ ...base, booksRead, currentlyReading, wishlist });
    } else if (status === 'wantToRead') {
      const inList = base.wishlist.some((b) => b.id === id);
      const wishlist = inList
        ? base.wishlist
        : [...base.wishlist, { ...book, addedDate: now }];
      const currentlyReading = base.currentlyReading.filter((b) => b.id !== id);
      saveData({ ...base, wishlist, currentlyReading });
    }
  };

  const addToList = (book, listName) => {
    const updated = {
      ...readingData,
      [listName]: [...readingData[listName], { ...book, addedDate: new Date().toISOString() }]
    };
    saveData(updated);
  };

  const removeFromList = (bookId, listName) => {
    const updated = {
      ...readingData,
      [listName]: readingData[listName].filter(b => b.id !== bookId)
    };
    saveData(updated);
  };

  const startReading = (book) => {
    addToList(book, 'currentlyReading');
  };

  const finishReading = (book, review) => {
    const finished = {
      ...book,
      finishedDate: new Date().toISOString(),
      review
    };
    
    const updated = {
      ...readingData,
      currentlyReading: readingData.currentlyReading.filter(b => b.id !== book.id),
      booksRead: [...readingData.booksRead, finished]
    };
    saveData(updated);
  };

  const logReadingSession = (bookId, duration, pages) => {
    const session = {
      bookId,
      duration,
      pages,
      date: new Date().toISOString()
    };
    
    const updated = {
      ...readingData,
      readingSessions: [...readingData.readingSessions, session],
      totalHours: readingData.totalHours + (duration / 60)
    };
    saveData(updated);
  };

  const startSession = (bookId) => {
    // Prevent multiple overlapping sessions
    if (!bookId) return;
    setActiveSession({
      bookId,
      startedAt: Date.now(),
      lastResumedAt: Date.now(),
      pausedAt: null,
      totalPausedMs: 0
    });
  };

  const pauseSession = () => {
    setActiveSession((s) => {
      if (!s || s.pausedAt) return s;
      return { ...s, pausedAt: Date.now() };
    });
  };

  const resumeSession = () => {
    setActiveSession((s) => {
      if (!s || !s.pausedAt) return s;
      const pausedMs = Date.now() - s.pausedAt;
      return { ...s, pausedAt: null, totalPausedMs: s.totalPausedMs + pausedMs, lastResumedAt: Date.now() };
    });
  };

  const endSession = (pages = 0) => {
    if (!activeSession) return;
    const s = activeSession;
    const endedAt = Date.now();
    const totalMs = endedAt - s.startedAt;
    const pausedMs = s.totalPausedMs + (s.pausedAt ? endedAt - s.pausedAt : 0);
    const activeMs = Math.max(0, totalMs - pausedMs);
    const durationMinutes = Math.round(activeMs / 60000);
    const focusScore = Math.max(0, Math.min(100, Math.round(100 - (pausedMs / 60000) * 8)));

    const updated = {
      ...readingData,
      readingSessions: [
        ...readingData.readingSessions,
        {
          bookId: s.bookId,
          duration: durationMinutes,
          pages,
          focusScore,
          pausedMinutes: Math.round(pausedMs / 60000),
          date: new Date().toISOString()
        }
      ],
      totalHours: readingData.totalHours + (durationMinutes / 60)
    };
    saveData(updated);
    setActiveSession(null);
  };

  useEffect(() => {
    // Auto-pause when tab is hidden (focus-aware session tracking)
    const onVis = () => {
      if (document.visibilityState === 'hidden') pauseSession();
      if (document.visibilityState === 'visible') resumeSession();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const readAgain = (book) => {
    const id = book.id;
    if (!id) return;
    const now = new Date().toISOString();

    const base = { ...readingData };
    const booksRead = [...base.booksRead];
    const idx = booksRead.findIndex((b) => b.id === id);

    if (idx >= 0) {
      const existing = booksRead[idx];
      const currentCount =
        typeof existing.readCount === 'number'
          ? existing.readCount
          : 1;
      const history = existing.readingHistory || [];
      booksRead[idx] = {
        ...existing,
        readCount: currentCount + 1,
        readingHistory: [...history, { startedAt: now }],
      };
    } else {
      booksRead.push({
        ...book,
        finishedDate: now,
        readCount: 1,
        readingHistory: [{ startedAt: now }],
      });
    }

    const currentlyReading = base.currentlyReading.some((b) => b.id === id)
      ? base.currentlyReading
      : [...base.currentlyReading, { ...book, addedDate: now }];
    const wishlist = base.wishlist.filter((b) => b.id !== id);

    saveData({ ...base, booksRead, currentlyReading, wishlist });
  };

  const value = {
    ...readingData,
    activeSession,
    addToList,
    removeFromList,
    startReading,
    finishReading,
    logReadingSession,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    getBookStatus,
    setBookStatus,
    readAgain
  };

  return <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>;
};
