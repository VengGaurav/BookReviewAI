import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, TrendingUp, Clock, Star, Plus, Image as ImageIcon } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { bookService } from '../services/bookService';
import { useReading } from '../context/ReadingContext';

export const Explore = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    title: '',
    author: '',
    pages: 250,
    publishYear: new Date().getFullYear(),
    genre: 'General',
    cover: '',
    description: '',
    amazonUrl: '',
    flipkartUrl: '',
    kindleUrl: '',
  });
  const reading = useReading();

  const genres = ['Fiction', 'Science Fiction', 'Fantasy', 'Self-Help', 'Psychology', 
                  'Business', 'History', 'Philosophy', 'Biography', 'Romance'];

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular', icon: TrendingUp },
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'recent', label: 'Recently Added', icon: Clock }
  ];

  useEffect(() => {
    loadBooks();
  }, [searchQuery, selectedGenres, sortBy]);

  const loadBooks = async () => {
    setLoading(true);
    let results = await bookService.search(searchQuery);
    
    // Filter by genre
    if (selectedGenres.length > 0) {
      results = results.filter(book => 
        book.genre.some(g => selectedGenres.includes(g))
      );
    }

    // Sort
    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'recent') {
      results.sort((a, b) => b.publishYear - a.publishYear);
    } else {
      results.sort((a, b) => b.popularity - a.popularity);
    }

    setBooks(results);
    setLoading(false);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const onAddChange = (key, value) => setAddForm((f) => ({ ...f, [key]: value }));

  const onCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onAddChange('cover', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const submitAdd = async () => {
    if (!addForm.title.trim() || !addForm.author.trim()) return;
    await bookService.addCustomBook({
      title: addForm.title.trim(),
      author: addForm.author.trim(),
      pages: Number(addForm.pages) || 250,
      publishYear: Number(addForm.publishYear) || new Date().getFullYear(),
      genre: [addForm.genre || 'General'],
      cover: addForm.cover.trim(),
      description: addForm.description.trim(),
      buyUrls: {
        amazon: addForm.amazonUrl.trim(),
        flipkart: addForm.flipkartUrl.trim(),
        kindle: addForm.kindleUrl.trim(),
      },
      aiSummary: '',
      keywords: [],
      popularity: 80,
      rating: 4.5,
    });
    setShowAdd(false);
    setAddForm({
      title: '',
      author: '',
      pages: 250,
      publishYear: new Date().getFullYear(),
      genre: 'General',
      cover: '',
      description: '',
      amazonUrl: '',
      flipkartUrl: '',
      kindleUrl: '',
    });
    loadBooks();
  };

  const getStatusForBook = (bookId) => {
    return reading.getBookStatus ? reading.getBookStatus(bookId) : null;
  };

  const updateBookStatus = (book, status) => {
    if (!reading.setBookStatus) return;
    reading.setBookStatus(book, status);
    // No need to reload books; Explore list comes from search, Dashboard listens to context.
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-5xl font-bold gradient-text mb-4">
            Explore Books
          </h1>
          <p className="text-xl text-gray-400">
            Discover your next favorite read powered by AI
          </p>
        </motion.div>

        {/* Search & Filters Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search books, authors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => setShowAdd(true)}
            >
              Add Book
            </Button>
            <Button
              variant="secondary"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex gap-3 flex-wrap">
            {sortOptions.map(option => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy(option.value)}
                className={`
                  px-4 py-2 rounded-lg flex items-center gap-2 transition-all
                  ${sortBy === option.value 
                    ? 'bg-neon-cyan text-dark-900 font-medium' 
                    : 'glass text-gray-300 hover:bg-white/10'
                  }
                `}
              >
                <option.icon size={16} />
                {option.label}
              </motion.button>
            ))}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-lg font-bold">Filter by Genre</h3>
                {selectedGenres.length > 0 && (
                  <button
                    onClick={() => setSelectedGenres([])}
                    className="text-sm text-neon-cyan hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <motion.button
                    key={genre}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleGenre(genre)}
                    className={`
                      px-4 py-2 rounded-full text-sm transition-all
                      ${selectedGenres.includes(genre)
                        ? 'bg-neon-magenta text-white'
                        : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                      }
                    `}
                  >
                    {genre}
                    {selectedGenres.includes(genre) && (
                      <X className="inline-block ml-1 w-3 h-3" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Active Filters */}
          {selectedGenres.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Active filters:</span>
              {selectedGenres.map(genre => (
                <span key={genre} className="px-2 py-1 bg-neon-magenta/20 rounded-full text-neon-magenta">
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading books...</p>
          </motion.div>
        ) : books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-4 text-gray-400">
              Found {books.length} {books.length === 1 ? 'book' : 'books'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book, idx) => {
                const status = getStatusForBook(book.id);
                const isCompleted = status === 'completed';
                const isCurrent = status === 'currentlyReading';
                const isInLibrary = status === 'wantToRead' || isCurrent || isCompleted;

                let statusLabel = 'Not in library';
                if (isCurrent) statusLabel = 'Currently reading';
                else if (isCompleted) statusLabel = 'Completed';
                else if (status === 'wantToRead') statusLabel = 'In library';

                let primaryActionLabel = 'Add to library';
                let primaryAction;
                let primaryDisabled = false;

                if (!status) {
                  primaryAction = () => updateBookStatus(book, 'wantToRead');
                } else if (status === 'wantToRead') {
                  primaryActionLabel = 'Start reading';
                  primaryAction = () => updateBookStatus(book, 'currentlyReading');
                } else if (status === 'currentlyReading') {
                  primaryActionLabel = 'Mark as completed';
                  primaryAction = () => updateBookStatus(book, 'completed');
                } else {
                  primaryActionLabel = 'Completed';
                  primaryDisabled = true;
                }

                return (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="space-y-2"
                  >
                    <BookCard book={book} />
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`
                          inline-flex items-center px-2 py-1 rounded-full
                          ${isCompleted
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : isCurrent
                            ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'
                            : isInLibrary
                            ? 'bg-slate-700 text-slate-200 border border-slate-500'
                            : 'bg-slate-800 text-slate-300 border border-slate-600'
                          }
                        `}
                      >
                        {statusLabel}
                      </span>
                      <Button
                        size="sm"
                        variant={primaryDisabled ? 'secondary' : 'primary'}
                        disabled={primaryDisabled}
                        onClick={primaryAction}
                      >
                        {primaryActionLabel}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Add Book Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowAdd(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full max-w-2xl glass-dark rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4">
                <div>
                  <h3 className="font-display text-2xl font-bold">Add a book</h3>
                  <p className="text-sm text-gray-400">
                    Enter the key details, then (optionally) add a cover and store links.
                  </p>
                </div>
                <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white">
                  <X />
                </button>
              </div>

              <div className="space-y-6 px-6 pb-4 overflow-y-auto modal-scroll">
                {/* Basic details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Title" value={addForm.title} onChange={(e) => onAddChange('title', e.target.value)} />
                  <Input label="Author" value={addForm.author} onChange={(e) => onAddChange('author', e.target.value)} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="Pages"
                    type="number"
                    value={addForm.pages}
                    onChange={(e) => onAddChange('pages', e.target.value)}
                  />
                  <Input
                    label="Publish Year"
                    type="number"
                    value={addForm.publishYear}
                    onChange={(e) => onAddChange('publishYear', e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                    <select
                      value={addForm.genre}
                      onChange={(e) => onAddChange('genre', e.target.value)}
                      className="w-full glass px-4 py-3 rounded-lg bg-transparent border border-white/10 text-gray-200"
                    >
                      {['General', ...genres].map((g) => (
                        <option key={g} value={g} className="bg-dark-800">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Media & description */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Cover image (optional)
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-sm text-gray-200 cursor-pointer hover:bg-white/5">
                        <ImageIcon size={16} />
                        <span>Upload image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onCoverFileChange}
                        />
                      </label>
                      <Input
                        label="Image URL"
                        value={addForm.cover}
                        onChange={(e) => onAddChange('cover', e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload from your device or paste an image URL. If empty, a default cover is used.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={addForm.description}
                      onChange={(e) => onAddChange('description', e.target.value)}
                      rows={4}
                      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all duration-300 resize-none"
                      placeholder="Short description..."
                    />
                  </div>
                </div>

                {/* Store links */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="Amazon URL (optional)"
                    type="url"
                    value={addForm.amazonUrl}
                    onChange={(e) => onAddChange('amazonUrl', e.target.value)}
                  />
                  <Input
                    label="Flipkart URL (optional)"
                    type="url"
                    value={addForm.flipkartUrl}
                    onChange={(e) => onAddChange('flipkartUrl', e.target.value)}
                  />
                  <Input
                    label="Kindle URL (optional)"
                    type="url"
                    value={addForm.kindleUrl}
                    onChange={(e) => onAddChange('kindleUrl', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 px-6 pb-6 flex justify-end gap-3 shrink-0 border-t border-white/5">
                <Button variant="secondary" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button onClick={submitAdd} icon={Plus} disabled={!addForm.title.trim() || !addForm.author.trim()}>
                  Add Book
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
