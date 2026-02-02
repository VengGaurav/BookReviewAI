import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, MessageCircle, Send, Loader, 
  ShoppingBag, ExternalLink, TrendingUp, DollarSign,
  ThumbsUp, ThumbsDown, AlertCircle, Award
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../components/Button';
import { GlassCard } from '../components/Card';
import { TextArea } from '../components/Input';
import { mockReviews } from '../services/mockData';
import { externalInsightsService } from '../services/externalInsightsService';

// AI Features Tab
export const AIFeaturesTab = ({
  book, aiReview, aiTone, setAiTone, generateAIReview,
  aiSummary, summaryMode, setSummaryMode, generateSummary,
  chatMessages, chatInput, setChatInput, chatPersona, setChatPersona,
  sendChatMessage, loading
}) => {
  const tones = ['casual', 'expert', 'student', 'motivational'];
  const summaryModes = [
    { id: '30second', label: '30-Second Summary' },
    { id: 'chapter', label: 'Chapter Breakdown' },
    { id: 'bullet', label: 'Bullet Points' },
    { id: 'eli10', label: 'Explain Like I\'m 10' }
  ];
  const personas = ['author', 'character', 'critic'];

  return (
    <div className="space-y-6">
      {/* AI Review Generator */}
      <GlassCard>
        <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-neon-cyan" />
          AI Review Generator
        </h3>
        <p className="text-gray-400 mb-4">Generate intelligent book reviews in different tones</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Tone:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tones.map(tone => (
              <motion.button
                key={tone}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAiTone(tone)}
                className={`
                  px-4 py-2 rounded-lg capitalize font-medium transition-all
                  ${aiTone === tone
                    ? 'bg-neon-cyan text-dark-900'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                  }
                `}
              >
                {tone}
              </motion.button>
            ))}
          </div>
        </div>

        <Button
          onClick={generateAIReview}
          disabled={loading.review}
          icon={loading.review ? Loader : Sparkles}
          className="mb-4"
        >
          {loading.review ? 'Generating...' : 'Generate Review'}
        </Button>

        {aiReview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800 rounded-lg p-4 border border-neon-cyan/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm text-neon-cyan font-medium">AI Generated Review</span>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{aiReview}</p>
          </motion.div>
        )}
      </GlassCard>

      {/* AI Summary */}
      <GlassCard>
        <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-neon-magenta" />
          AI Book Summary
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Summary Mode:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {summaryModes.map(mode => (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSummaryMode(mode.id)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${summaryMode === mode.id
                    ? 'bg-neon-magenta text-white'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                  }
                `}
              >
                {mode.label}
              </motion.button>
            ))}
          </div>
        </div>

        <Button
          onClick={generateSummary}
          disabled={loading.summary}
          icon={loading.summary ? Loader : Sparkles}
          variant="outline"
          className="mb-4"
        >
          {loading.summary ? 'Generating...' : 'Generate Summary'}
        </Button>

        {aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800 rounded-lg p-4 border border-neon-magenta/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-neon-magenta" />
              <span className="text-sm text-neon-magenta font-medium">AI Generated Summary</span>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
          </motion.div>
        )}
      </GlassCard>

      {/* Chat with Book */}
      <GlassCard>
        <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-neon-amber" />
          Chat with the Book
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Chat as:</label>
          <div className="grid grid-cols-3 gap-2">
            {personas.map(persona => (
              <motion.button
                key={persona}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChatPersona(persona)}
                className={`
                  px-4 py-2 rounded-lg capitalize font-medium transition-all
                  ${chatPersona === persona
                    ? 'bg-neon-amber text-dark-900'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                  }
                `}
              >
                {persona}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-dark-800 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto space-y-3">
          {chatMessages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Start a conversation! Ask anything about the book.
            </p>
          ) : (
            chatMessages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] p-3 rounded-lg
                    ${msg.role === 'user'
                      ? 'bg-neon-cyan text-dark-900'
                      : 'bg-dark-700 text-gray-300'
                    }
                  `}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))
          )}
          {loading.chat && (
            <div className="flex justify-start">
              <div className="bg-dark-700 p-3 rounded-lg">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            placeholder="Ask a question..."
            className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-white 
                     placeholder-gray-500 focus:border-neon-amber focus:outline-none"
          />
          <Button onClick={sendChatMessage} icon={Send} disabled={loading.chat}>
            Send
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

// Reviews Tab
export const ReviewsTab = ({ book, userReview, setUserReview, compareReviews, reviewComparison, myReviews, saveMyReview, loading }) => {
  return (
    <div className="space-y-6">
      {/* Write Review */}
      <GlassCard>
        <h3 className="font-display text-2xl font-bold mb-4">Write Your Review</h3>
        <TextArea
          placeholder="Share your thoughts about this book..."
          value={userReview}
          onChange={(e) => setUserReview(e.target.value)}
          rows={6}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            onClick={compareReviews}
            disabled={!userReview.trim() || loading.compare}
            icon={loading.compare ? Loader : Sparkles}
          >
            {loading.compare ? 'Analyzing...' : 'Compare with AI'}
          </Button>
          <Button
            variant="secondary"
            onClick={typeof saveMyReview === 'function' ? saveMyReview : undefined}
            disabled={!userReview.trim()}
          >
            Save review
          </Button>
        </div>
      </GlassCard>

      {/* My Saved Reviews */}
      {Array.isArray(myReviews) && myReviews.length > 0 && (
        <GlassCard>
          <h3 className="font-display text-2xl font-bold mb-4">My Reviews</h3>
          <div className="space-y-3">
            {myReviews.map((r) => (
              <div key={r.id} className="bg-dark-800 rounded-lg p-4 border border-dark-600">
                <div className="text-xs text-gray-400 mb-2">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="text-gray-300 whitespace-pre-wrap">{r.text}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Review Comparison */}
      {reviewComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-neon-cyan" />
              Review Analysis
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Similarity Score</div>
                <div className="text-3xl font-bold text-neon-cyan">{reviewComparison.similarity}%</div>
              </div>
              <div className="bg-dark-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Originality Score</div>
                <div className="text-3xl font-bold text-neon-magenta">{reviewComparison.originalityScore}%</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  Your Unique Insights
                </h4>
                <ul className="space-y-1">
                  {reviewComparison.uniquePoints.map((point, idx) => (
                    <li key={idx} className="text-gray-300 text-sm pl-6">• {point}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  Common Perspectives
                </h4>
                <ul className="space-y-1">
                  {reviewComparison.commonPoints.map((point, idx) => (
                    <li key={idx} className="text-gray-300 text-sm pl-6">• {point}</li>
                  ))}
                </ul>
              </div>

              {reviewComparison.contradictions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ThumbsDown className="w-4 h-4 text-red-500" />
                    Different Views
                  </h4>
                  <ul className="space-y-1">
                    {reviewComparison.contradictions.map((point, idx) => (
                      <li key={idx} className="text-gray-300 text-sm pl-6">• {point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

// External Tab
export const ExternalTab = ({ book }) => {
  const [buying, setBuying] = React.useState({ offers: [], bestDeal: null, formatPrice: (n) => n });
  const [pulse, setPulse] = React.useState(null);
  const [loading, setLoading] = React.useState({ offers: true, pulse: true });

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading({ offers: true, pulse: true });
      const [b, p] = await Promise.all([
        externalInsightsService.getBuyingLinks(book),
        externalInsightsService.getInternetPulse(book),
      ]);
      if (!mounted) return;
      setBuying(b);
      setPulse(p);
      setLoading({ offers: false, pulse: false });
    };
    load();
    return () => {
      mounted = false;
    };
  }, [book]);

  const internetReviews = mockReviews[book.id] || [];
  const sentimentData = pulse
    ? [
        { name: 'Positive', value: pulse.sentiment.positive, color: '#00ffff' },
        { name: 'Neutral', value: pulse.sentiment.neutral, color: '#ffbf00' },
        { name: 'Critical', value: pulse.sentiment.critical, color: '#ff00ff' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Buying Links */}
      <GlassCard>
        <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-neon-cyan" />
          Where to Buy
        </h3>
        {loading.offers ? (
          <div className="text-gray-400">Loading buying options...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {buying.offers.map((offer) => (
              <motion.a
                key={`${offer.vendor}-${offer.format}`}
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-dark-800 rounded-lg p-4 border border-dark-600 hover:border-neon-cyan transition-all ${
                  buying.bestDeal && offer.vendor === buying.bestDeal.vendor ? 'border-green-500/60' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-neon-cyan" />
                    <span className="font-bold">{offer.vendor}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>

                <div className="text-sm text-gray-400 mb-2">Format: {offer.format}</div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">
                      {typeof offer.price === 'number' ? `$${buying.formatPrice(offer.price)}` : '—'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">Rating: {offer.rating}</div>
                </div>

                {buying.bestDeal && offer.vendor === buying.bestDeal.vendor && (
                  <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                    <TrendingUp className="w-4 h-4" />
                    Best deal
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        )}
        
        {/* Best Deal */}
        {!loading.offers && buying.bestDeal && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-500 font-medium">
                Best Deal: {buying.bestDeal.vendor} ({buying.bestDeal.format}) at ${buying.formatPrice(buying.bestDeal.price)}
              </span>
            </div>
            <a
              href={buying.bestDeal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neon-cyan hover:underline flex items-center gap-1"
            >
              Open <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </GlassCard>

      {/* Internet Reviews Summary */}
      <GlassCard>
        <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-neon-magenta" />
          What the Internet Says
        </h3>

        {loading.pulse ? (
          <div className="text-gray-400">Aggregating public opinion...</div>
        ) : (
          pulse && (
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="glass-dark rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">AI-generated public opinion summary</div>
                  <div className="text-gray-200">{pulse.summary}</div>
                </div>

                <div className="glass-dark rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Common keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {pulse.keywords.map((k) => (
                      <span
                        key={k}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-neon-cyan/15 to-neon-magenta/15 text-neon-cyan border border-neon-cyan/20 text-xs font-medium"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-dark rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Source attribution</div>
                  <div className="flex flex-wrap gap-2">
                    {pulse.sources.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-dark rounded-xl p-4 border border-white/10">
                <div className="text-sm text-gray-400 mb-3">Sentiment distribution</div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`sent-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ff00ff' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-500" />
                      Most loved
                    </div>
                    <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                      {pulse.lovedPoints.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-500" />
                      Most criticized
                    </div>
                    <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                      {pulse.criticizedPoints.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
        
        {internetReviews.length > 0 ? (
          <div className="space-y-4">
            {internetReviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-800 rounded-lg p-4 border border-dark-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-neon-cyan capitalize">{review.source}</span>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-neon-amber" />
                    <span className="font-bold">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm italic">&ldquo;{review.excerpt}&rdquo;</p>
                <div className={`
                  mt-2 inline-block px-2 py-1 rounded text-xs font-medium
                  ${review.sentiment === 'positive' ? 'bg-green-500/20 text-green-500' : 
                    review.sentiment === 'neutral' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                  }
                `}>
                  {review.sentiment}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No external reviews available yet.</p>
        )}
      </GlassCard>
    </div>
  );
};
