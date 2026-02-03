import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Wand2,
  MessageCircle,
  FileText,
  Scale,
  Loader2,
} from "lucide-react";
import { useReading } from "../context/ReadingContext";
import { aiService } from "../services/aiService";
import { GlassCard } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

const tones = [
  { id: "casual", label: "Casual Reader" },
  { id: "expert", label: "Literature Expert" },
  { id: "student", label: "Student" },
  { id: "motivational", label: "Motivational Speaker" },
];

const summaryModes = [
  { id: "30second", label: "30-second summary" },
  { id: "chapter", label: "Chapter-wise breakdown" },
  { id: "bullet", label: "Bullet summary" },
  { id: "eli10", label: "Explain like I'm 10" },
];

const personas = [
  { id: "author", label: "Author" },
  { id: "character", label: "Character" },
  { id: "critic", label: "Literary Critic" },
];

export const AIReviewStudio = () => {
  const reading = useReading();
  const bookOptions = useMemo(() => {
    const all = [
      ...(reading.currentlyReading || []),
      ...(reading.booksRead || []),
    ];
    return all;
  }, [reading.booksRead, reading.currentlyReading]);

  const [selectedBookId, setSelectedBookId] = useState(
    bookOptions[0]?.id || "",
  );
  const book = useMemo(
    () => bookOptions.find((b) => b.id === selectedBookId),
    [bookOptions, selectedBookId],
  );

  const [tone, setTone] = useState("casual");
  const [summaryMode, setSummaryMode] = useState("30second");
  const [persona, setPersona] = useState("author");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userReview, setUserReview] = useState("");

  const [reviewOut, setReviewOut] = useState("");
  const [summaryOut, setSummaryOut] = useState("");
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState({
    review: false,
    summary: false,
    chat: false,
    compare: false,
  });

  const requireBook = () => {
    if (!book) return false;
    return true;
  };

  const generateReview = async () => {
    if (!requireBook()) return;
    setLoading((l) => ({ ...l, review: true }));
    const out = await aiService.generateReview(book, tone);
    setReviewOut(out);
    setLoading((l) => ({ ...l, review: false }));
  };

  const generateSummary = async () => {
    if (!requireBook() || loading.summary) return;
    setLoading((l) => ({ ...l, summary: true }));
    try {
      const modeMap = {
        "30second": "short",
        chapter: "chapter",
        bullet: "bullets",
        eli10: "short",
      };
      const apiMode = modeMap[summaryMode] || "short";
      const text = book.description || book.aiSummary || "No text available";

      const response = await fetch(
        "https://bookreviewai.onrender.com/api/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, mode: apiMode }),
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setSummaryOut(data.result || "No summary generated");
    } catch (error) {
      console.error("Summary generation failed:", error);
      setSummaryOut("Summary could not be generated. Please try again.");
    } finally {
      setLoading((l) => ({ ...l, summary: false }));
    }
  };

  const sendChat = async () => {
    if (!requireBook() || !chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((m) => [...m, { role: "user", text: msg }]);
    setLoading((l) => ({ ...l, chat: true }));
    const out = await aiService.chatWithBook(book, persona, msg);
    setChatMessages((m) => [...m, { role: "ai", text: out }]);
    setLoading((l) => ({ ...l, chat: false }));
  };

  const compare = async () => {
    if (!requireBook() || !userReview.trim()) return;
    setLoading((l) => ({ ...l, compare: true }));
    const out = await aiService.compareReviews(book, userReview.trim());
    setComparison(out);
    setLoading((l) => ({ ...l, compare: false }));
  };

  const hasBooks = bookOptions.length > 0;

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-7 h-7 text-neon-cyan" />
            <h1 className="font-display text-5xl font-bold gradient-text">
              AI Review Studio
            </h1>
          </div>
          <p className="text-gray-400">
            Generate reviews, summaries, comparisons, and chat personas (mock
            AI).
          </p>
        </motion.div>

        <div className="grid gap-6">
          <GlassCard>
            {hasBooks ? (
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                  <div className="font-medium">Select a book</div>
                  <div className="text-sm text-gray-400">
                    Books shown here come from your library / reading lists and
                    power all AI tools below.
                  </div>
                </div>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full md:w-80 px-4 py-2 rounded-lg
                             bg-white dark:bg-dark-800
                             border border-slate-200 dark:border-dark-600
                             text-slate-900 dark:text-gray-100
                             shadow-sm focus:outline-none
                             focus:ring-2 focus:ring-neon-cyan/20 focus:border-neon-cyan"
                >
                  <option
                    value=""
                    className="bg-white dark:bg-dark-800 text-slate-500 dark:text-gray-400"
                  >
                    Choose a book…
                  </option>
                  {bookOptions.map((b) => (
                    <option
                      key={b.id}
                      value={b.id}
                      className="bg-white dark:bg-dark-800 text-slate-900 dark:text-gray-100"
                    >
                      {b.title} — {b.author}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                  <div className="font-medium">
                    No books in your library yet
                  </div>
                  <div className="text-sm text-gray-400">
                    Add books to your reading list to unlock AI reviews,
                    summaries, and chat for them.
                  </div>
                </div>
                <Link to="/explore">
                  <Button variant="primary">Go to Explore</Button>
                </Link>
              </div>
            )}
          </GlassCard>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Review Generator */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-5 h-5 text-neon-magenta" />
                <h3 className="font-display text-xl font-bold">
                  AI Review Generator
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      tone === t.id
                        ? "bg-neon-magenta text-dark-900 font-medium"
                        : "glass text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <Button
                icon={Wand2}
                onClick={generateReview}
                disabled={loading.review || !book}
              >
                {loading.review ? "Generating..." : "Generate review"}
              </Button>
              {!book && (
                <p className="mt-2 text-xs text-gray-400">
                  Select a book above to generate a tailored AI review.
                </p>
              )}

              {reviewOut && (
                <div className="mt-4 p-4 rounded-xl glass-dark whitespace-pre-wrap text-gray-200">
                  {reviewOut}
                </div>
              )}
            </GlassCard>

            {/* Summary */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-neon-amber" />
                <h3 className="font-display text-xl font-bold">
                  AI Summary Modes
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {summaryModes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSummaryMode(m.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      summaryMode === m.id
                        ? "bg-neon-amber text-dark-900 font-medium"
                        : "glass text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <Button
                icon={loading.summary ? Loader2 : FileText}
                onClick={generateSummary}
                disabled={loading.summary || !book}
              >
                {loading.summary ? "Summarizing..." : "Generate summary"}
              </Button>
              {!book && (
                <p className="mt-2 text-xs text-gray-400">
                  Select a book above to generate summaries.
                </p>
              )}

              {summaryOut && (
                <div className="mt-4 p-4 rounded-xl glass-dark whitespace-pre-wrap text-gray-200">
                  {summaryOut}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Chat */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-neon-cyan" />
              <h3 className="font-display text-xl font-bold">
                Chat with the Book
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    persona === p.id
                      ? "bg-neon-cyan text-dark-900 font-medium"
                      : "glass text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="glass-dark rounded-xl p-4 h-72 overflow-auto">
                {chatMessages.length === 0 ? (
                  <div className="text-gray-400 text-sm">
                    Ask something to start a conversation.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`text-sm ${m.role === "user" ? "text-white" : "text-gray-300"}`}
                      >
                        <span
                          className={`font-medium ${m.role === "user" ? "text-neon-cyan" : "text-neon-magenta"}`}
                        >
                          {m.role === "user" ? "You" : "AI"}:
                        </span>{" "}
                        {m.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Input
                  label="Message"
                  placeholder="Ask about themes, characters, decisions..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <Button
                  icon={MessageCircle}
                  onClick={sendChat}
                  disabled={loading.chat || !book}
                >
                  {loading.chat ? "Thinking..." : "Send"}
                </Button>
                {!book && (
                  <p className="mt-1 text-xs text-gray-400">
                    Select a book above to start a conversation about it.
                  </p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Comparison */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-neon-purple" />
              <h3 className="font-display text-xl font-bold">
                AI Review Comparison
              </h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Your review
                </label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  className="w-full h-40 glass-dark rounded-xl p-4 outline-none border border-white/10 text-gray-200 placeholder:text-gray-500"
                  placeholder="Write your review..."
                />
                <div className="mt-3 space-y-1">
                  <Button
                    icon={Scale}
                    onClick={compare}
                    disabled={loading.compare || !book}
                  >
                    {loading.compare
                      ? "Comparing..."
                      : "Compare with internet reviews"}
                  </Button>
                  {!book && (
                    <p className="text-xs text-gray-400">
                      Select a book above to compare your review.
                    </p>
                  )}
                </div>
              </div>

              <div className="glass-dark rounded-xl p-4">
                {!comparison ? (
                  <div className="text-gray-400 text-sm">
                    Run a comparison to see similarity, originality, and
                    highlights.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Similarity</span>
                      <span className="text-neon-cyan font-bold">
                        {comparison.similarity}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Originality</span>
                      <span className="text-neon-magenta font-bold">
                        {comparison.originalityScore}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">
                        Unique points
                      </div>
                      <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                        {comparison.uniquePoints?.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">
                        Common points
                      </div>
                      <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                        {comparison.commonPoints?.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-1">
                        Contradictions
                      </div>
                      <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                        {comparison.contradictions?.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
