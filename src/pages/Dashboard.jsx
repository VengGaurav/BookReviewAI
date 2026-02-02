import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Zap, Target, Calendar, Activity } from 'lucide-react';
import { GlassCard } from '../components/Card';
import { Button } from '../components/Button';
import { useReading } from '../context/ReadingContext';
import { useAuth } from '../context/AuthContext';
import { CompactBookCard } from '../components/BookCard';

export const Dashboard = () => {
  const { user } = useAuth();
  const reading = useReading();
  const navigate = useNavigate();
  const [sessionPages, setSessionPages] = useState(0);

  const sessions = reading.readingSessions || [];
  const booksRead = reading.booksRead || [];
  const currentlyReading = reading.currentlyReading || [];
  const wishlist = reading.wishlist || [];

  // Today reading time (in minutes) based on real sessions
  const todayMinutes = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    return sessions
      .filter((s) => (s.date || '').slice(0, 10) === todayKey)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
  }, [sessions]);

  // Weekly consistency data (real, but shown as simple bars)
  const { weeklyMinutes, maxWeeklyMinutes } = useMemo(() => {
    const minutes = Array(7).fill(0);
    sessions.forEach((s) => {
      const d = new Date(s.date || '');
      if (!Number.isNaN(d.getTime())) {
        const day = d.getDay(); // 0 = Sun
        minutes[day] += s.duration || 0;
      }
    });
    return {
      weeklyMinutes: minutes,
      maxWeeklyMinutes: Math.max(0, ...minutes),
    };
  }, [sessions]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSessionPagesChange = (value) => {
    const raw = value.replace(/\D/g, '');
    setSessionPages(raw === '' ? 0 : Number(raw));
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-5xl font-bold gradient-text mb-2">
            Reading Dashboard
          </h1>
          <p className="text-xl text-gray-400">
            See your reading at a glance and decide what to do next.
          </p>
        </motion.div>

        {/* Reading Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Today</p>
                <p className="font-semibold text-sm">Reading time</p>
              </div>
              <Clock className="w-6 h-6 text-neon-cyan" />
            </div>
            <div className="text-3xl font-bold mb-1">{todayMinutes || 0} min</div>
            <p className="text-xs text-gray-500 mb-3">We’ll track from your next session.</p>
            <Button size="sm" onClick={() => navigate('/explore')}>
              Start reading
            </Button>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Streak</p>
                <p className="font-semibold text-sm">Current reading streak</p>
              </div>
              <Activity className="w-6 h-6 text-neon-cyan" />
            </div>
            <div className="text-3xl font-bold mb-1">{reading.streak || 0}</div>
            <p className="text-xs text-gray-500">Days in a row you’ve read.</p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Library</p>
                <p className="font-semibold text-sm">Books completed</p>
              </div>
              <BookOpen className="w-6 h-6 text-neon-cyan" />
            </div>
            <div className="text-3xl font-bold mb-1">{booksRead.length}</div>
            <p className="text-xs text-gray-500 mb-3">Log finished books to see your progress.</p>
            <Button size="sm" variant="secondary" onClick={() => navigate('/explore')}>
              Add a book
            </Button>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Now reading</p>
                <p className="font-semibold text-sm">Currently reading</p>
              </div>
              <Target className="w-6 h-6 text-neon-cyan" />
            </div>
            {currentlyReading.length ? (
              <>
                <div className="text-sm font-semibold mb-1 line-clamp-2">
                  {currentlyReading[0].title}
                </div>
                <p className="text-xs text-gray-500 mb-3">Pick up where you left off.</p>
                <Button
                  size="sm"
                  onClick={() => navigate(`/book/${currentlyReading[0].id}`)}
                >
                  Continue reading
                </Button>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold mb-1">0</div>
                <p className="text-xs text-gray-500 mb-3">No active book yet.</p>
                <Button size="sm" variant="secondary" onClick={() => navigate('/explore')}>
                  Pick a book
                </Button>
              </>
            )}
          </GlassCard>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            {/* Session Tracker */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-neon-cyan" />
                  Reading Session
                </h3>
                <div className="text-sm text-gray-400 mb-4">
                  Track a focused reading session and log how many pages you read.
                </div>

                <div className="mb-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Pages read this session
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={sessionPages}
                      onChange={(e) => handleSessionPagesChange(e.target.value)}
                      className="w-28 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20"
                      placeholder="0"
                    />
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      Adjust this at any time while you read.
                    </span>
                  </div>
                </div>

                {!reading.activeSession ? (
                  <Button
                    onClick={() =>
                      reading.startSession(
                        reading.currentlyReading?.[0]?.id || reading.booksRead?.[0]?.id
                      )
                    }
                    disabled={!reading.currentlyReading?.[0] && !reading.booksRead?.[0]}
                    icon={Zap}
                  >
                    Start session
                  </Button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={reading.pauseSession}>
                      Pause
                    </Button>
                    <Button variant="secondary" onClick={reading.resumeSession}>
                      Resume
                    </Button>
                    <Button onClick={() => reading.endSession(sessionPages)} icon={Target}>
                      End session
                    </Button>
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Reading Consistency */}
            <GlassCard>
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-neon-cyan" />
                Reading Consistency
              </h3>
              {!sessions.length ? (
                <p className="text-sm text-gray-400">
                  Your reading pattern will appear here once you log some sessions.
                </p>
              ) : (
                <div className="space-y-3">
                  {dayLabels.map((label, idx) => {
                    const minutes = weeklyMinutes[idx];
                    const width =
                      maxWeeklyMinutes === 0 ? 0 : Math.max(8, (minutes / maxWeeklyMinutes) * 100);
                    return (
                      <div key={label} className="flex items-center gap-3 text-sm">
                        <span className="w-10 text-gray-400">{label}</span>
                        <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                          {minutes > 0 && (
                            <div
                              className="h-full bg-neon-cyan rounded-full"
                              style={{ width: `${width}%` }}
                            />
                          )}
                        </div>
                        <span className="w-12 text-right text-xs text-gray-500">
                          {minutes ? `${minutes}m` : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>

            {/* My Reading Shelf */}
            <GlassCard>
              <h3 className="font-display text-xl font-bold mb-4">My Reading Shelf</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Currently Reading */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Currently reading</h4>
                  {currentlyReading.length ? (
                    <div className="space-y-2">
                      {currentlyReading.slice(0, 2).map((book) => (
                        <CompactBookCard key={book.id} book={book} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 space-y-2">
                      <p>You haven&apos;t started a book yet.</p>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate('/explore')}
                      >
                        Pick a book
                      </Button>
                    </div>
                  )}
                </div>

                {/* Want to Read */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Want to read</h4>
                  {wishlist.length ? (
                    <div className="space-y-2">
                      {wishlist.slice(0, 2).map((book) => (
                        <CompactBookCard key={book.id} book={book} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 space-y-2">
                      <p>Save books you want to come back to.</p>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate('/explore')}
                      >
                        Browse books
                      </Button>
                    </div>
                  )}
                </div>

                {/* Finished */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Finished</h4>
                  {booksRead.length ? (
                    <div className="space-y-3">
                      {booksRead.slice(0, 2).map((book) => (
                        <div key={book.id} className="space-y-1">
                          <CompactBookCard book={book} />
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>
                              Times read:{' '}
                              <span className="font-semibold text-gray-200">
                                {book.readCount || 1}
                              </span>
                            </span>
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => reading.readAgain?.(book)}
                            >
                              Read again
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 space-y-2">
                      <p>Finished books will live here.</p>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate('/explore')}
                      >
                        Add a finished book
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right-side column */}
          <div className="space-y-6">
            {/* Reader Insights */}
            <GlassCard>
              <h3 className="font-display text-xl font-bold mb-3">Reader insights</h3>
              <p className="text-sm text-gray-400 mb-2">Not enough data yet.</p>
              <p className="text-xs text-gray-500">
                As you log sessions and finish books, this area will summarize simple patterns like
                your most active days and preferred formats—no heavy analytics, just helpful clues.
              </p>
            </GlassCard>

            {/* Next Steps */}
            <GlassCard>
              <h3 className="font-display text-xl font-bold mb-3">Next steps</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">Add your first book</p>
                    <p className="text-xs text-gray-500">
                      Search the catalog or create your own book in Explore.
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => navigate('/explore')}>
                    Go to Explore
                  </Button>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">Start a session</p>
                    <p className="text-xs text-gray-500">
                      Pick a book and track a focused block of reading time.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Open session
                  </Button>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">Use AI in Studio</p>
                    <p className="text-xs text-gray-500">
                      Once you have books in your shelf, generate reviews and summaries.
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => navigate('/studio')}>
                    Open Studio
                  </Button>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

