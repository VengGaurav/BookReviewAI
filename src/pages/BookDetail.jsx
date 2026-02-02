import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, BookOpen, Clock, TrendingUp, Heart, Share2, 
  MessageCircle, Sparkles, Brain, Users, ShoppingCart,
  ExternalLink, ThumbsUp, ThumbsDown, Zap
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, GlassCard } from '../components/Card';
import { TextArea } from '../components/Input';
import { mockReviews } from '../services/mockData';
import { aiService } from '../services/aiService';
import { useReading } from '../context/ReadingContext';
import { AIFeaturesTab, ReviewsTab, ExternalTab } from './BookDetailTabs';
import { bookService } from '../services/bookService';
import { reviewService } from '../services/reviewService';

export const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiReview, setAiReview] = useState('');
  const [aiTone, setAiTone] = useState('casual');
  const [aiSummary, setAiSummary] = useState('');
  const [summaryMode, setSummaryMode] = useState('30second');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatPersona, setChatPersona] = useState('author');
  const [loading, setLoading] = useState({});
  const [userReview, setUserReview] = useState('');
  const [reviewComparison, setReviewComparison] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const { getBookStatus, setBookStatus, readAgain, wishlist, currentlyReading, removeFromList } = useReading();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'ai-features', label: 'AI Features', icon: Brain },
    { id: 'reviews', label: 'Reviews', icon: MessageCircle },
    { id: 'external', label: 'Buy & Reviews', icon: ShoppingCart }
  ];

  useEffect(() => {
    const load = async () => {
      const bookData = await bookService.getById(id);
      setBook(bookData);
      if (bookData) setMyReviews(reviewService.list(bookData.id));
    };
    load();
  }, [id]);

  const generateAIReview = async () => {
    setLoading({ ...loading, review: true });
    const review = await aiService.generateReview(book, aiTone);
    setAiReview(review);
    setLoading({ ...loading, review: false });
  };

  const currentStatus = book && getBookStatus ? getBookStatus(book.id) : null;
  const isReading = !!book && currentStatus === 'currentlyReading';
  const isCompleted = !!book && currentStatus === 'completed';
  const isInWishlist = !!book && (currentStatus === 'wantToRead' || wishlist.some((b) => b.id === book.id));

  const handleStartOrComplete = () => {
    if (!book) return;
    if (isCompleted && readAgain) {
      readAgain(book);
    } else if (isReading && setBookStatus) {
      setBookStatus(book, 'completed');
    } else if (!currentStatus || currentStatus === 'wantToRead') {
      setBookStatus?.(book, 'currentlyReading');
    }
  };

  const handleWishlistToggle = () => {
    if (!book || isCompleted) return;
    if (isInWishlist) {
      removeFromList?.(book.id, 'wishlist');
    } else {
      setBookStatus?.(book, 'wantToRead');
    }
  };

  const handleShare = () => {
    if (!book) return;
    const url = window.location.href;
    const data = { title: book.title, text: `Check out "${book.title}"`, url };
    if (navigator.share) {
      navigator.share(data).catch(() => {});
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  const generateSummary = async () => {
    if (loading.summary) return;
    setLoading((l) => ({ ...l, summary: true }));
    try {
      const summary = await aiService.generateSummary(book, summaryMode);
      setAiSummary(summary || '');
    } catch (e) {
      console.error('AI summary failed', e);
      setAiSummary('Summary could not be generated. Please try again.');
    } finally {
      setLoading((l) => ({ ...l, summary: false }));
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');

    setLoading({ ...loading, chat: true });
    const response = await aiService.chatWithBook(book, chatPersona, chatInput);
    setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
    setLoading({ ...loading, chat: false });
  };

  const compareReviews = async () => {
    if (!userReview.trim()) return;
    
    setLoading({ ...loading, compare: true });
    const comparison = await aiService.compareReviews(book, userReview);
    setReviewComparison(comparison);
    setLoading({ ...loading, compare: false });
  };

  const saveMyReview = () => {
    if (!book) return;
    const item = reviewService.add(book.id, userReview);
    if (!item) return;
    setMyReviews((prev) => [item, ...prev]);
    setUserReview('');
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading book details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 via-neon-magenta/20 to-neon-amber/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all" />
                <img
                  src={book.cover}
                  alt={book.title}
                  className="relative w-full rounded-2xl shadow-2xl"
                />
              </motion.div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={BookOpen}
                  onClick={handleStartOrComplete}
                >
                  {isCompleted ? 'Read again' : isReading ? 'Mark as completed' : 'Start reading'}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    icon={Heart}
                    onClick={handleWishlistToggle}
                    disabled={isCompleted}
                    className={isInWishlist ? 'bg-red-500/20' : ''}
                  >
                    {isInWishlist ? 'In Wishlist' : 'Wishlist'}
                  </Button>
                  <Button variant="secondary" icon={Share2} onClick={handleShare}>
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-2">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-300 mb-4">by {book.author}</p>
                </div>
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 text-neon-amber fill-neon-amber" />
                  <span className="font-bold text-lg">{book.rating}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {book.genre.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 
                             text-neon-cyan border border-neon-cyan/30 text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <GlassCard className="text-center p-4">
                  <BookOpen className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
                  <div className="text-2xl font-bold">{book.pages}</div>
                  <div className="text-sm text-gray-400">Pages</div>
                </GlassCard>
                <GlassCard className="text-center p-4">
                  <Clock className="w-6 h-6 text-neon-magenta mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round(book.pages / 250)}h</div>
                  <div className="text-sm text-gray-400">Reading Time</div>
                </GlassCard>
                <GlassCard className="text-center p-4">
                  <TrendingUp className="w-6 h-6 text-neon-amber mx-auto mb-2" />
                  <div className="text-2xl font-bold">{book.publishYear}</div>
                  <div className="text-sm text-gray-400">Published</div>
                </GlassCard>
              </div>

              {/* Description */}
              <GlassCard>
                <h3 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-cyan" />
                  About This Book
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">{book.description}</p>
                <p className="text-gray-400 text-sm italic">
                  AI Summary: {book.aiSummary}
                </p>
              </GlassCard>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-magenta text-white'
                    : 'glass text-gray-300 hover:bg-white/10'
                  }
                `}
              >
                <tab.icon size={18} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <OverviewTab book={book} />}
            {activeTab === 'ai-features' && (
              <AIFeaturesTab
                book={book}
                aiReview={aiReview}
                aiTone={aiTone}
                setAiTone={setAiTone}
                generateAIReview={generateAIReview}
                aiSummary={aiSummary}
                summaryMode={summaryMode}
                setSummaryMode={setSummaryMode}
                generateSummary={generateSummary}
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                chatPersona={chatPersona}
                setChatPersona={setChatPersona}
                sendChatMessage={sendChatMessage}
                loading={loading}
              />
            )}
            {activeTab === 'reviews' && (
              <ReviewsTab
                book={book}
                userReview={userReview}
                setUserReview={setUserReview}
                compareReviews={compareReviews}
                reviewComparison={reviewComparison}
                myReviews={myReviews}
                saveMyReview={saveMyReview}
                loading={loading}
              />
            )}
            {activeTab === 'external' && <ExternalTab book={book} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ book }) => (
  <div className="space-y-6">
    <GlassCard>
      <h3 className="font-display text-2xl font-bold mb-4">Key Themes</h3>
      <div className="flex flex-wrap gap-3">
        {book.keywords?.map((keyword, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="px-4 py-2 bg-neon-magenta/20 text-neon-magenta rounded-lg border border-neon-magenta/30"
          >
            #{keyword}
          </motion.span>
        ))}
      </div>
    </GlassCard>

    <GlassCard>
      <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-neon-cyan" />
        Reader Sentiment
      </h3>
      <div className="space-y-3">
        <SentimentBar label="Positive" value={book.sentiment?.positive} color="bg-green-500" />
        <SentimentBar label="Neutral" value={book.sentiment?.neutral} color="bg-yellow-500" />
        <SentimentBar label="Critical" value={book.sentiment?.critical} color="bg-red-500" />
      </div>
    </GlassCard>
  </div>
);

const SentimentBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between mb-1 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-bold">{value}%</span>
    </div>
    <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);
