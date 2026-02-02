const callAI = async (payload, { timeoutMs = 20000 } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error('AI request failed');
    }

    const json = await res.json();
    if (!json || typeof json.text !== 'string') {
      throw new Error('Invalid AI response');
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
};

export const aiService = {
  // Generate book review in different tones via backend AI
  generateReview: async (book, tone = 'casual') => {
    const { text } = await callAI({
      mode: 'review',
      book,
      userInput: '',
      extra: { tone },
    });
    return text;
  },

  // Chat with book via backend AI
  chatWithBook: async (book, persona, message) => {
    const { text } = await callAI({
      mode: 'chat',
      book,
      userInput: message,
      extra: { persona },
    });
    return text;
  },

  // Generate summaries via backend AI
  generateSummary: async (book, mode = '30second') => {
    const { text } = await callAI({
      mode: 'summary',
      book,
      userInput: '',
      extra: { summaryMode: mode },
    });
    return text;
  },

  // Compare reviews (kept as lightweight mock analytics for now)
  compareReviews: async (book, userReview) => {
    // This remains a simple local helper to avoid overloading AI with analytics.
    const base = (userReview || '').length || 1;
    const similarity = Math.min(90, 40 + Math.floor(base % 40));
    const originalityScore = Math.min(95, 65 + Math.floor((base * 1.3) % 30));
    return {
      similarity,
      originalityScore,
      uniquePoints: [
        'Your perspective on character development is unique.',
        'You noticed themes that many readers overlook.',
      ],
      commonPoints: [
        `You and other readers both highlight ${book.keywords?.[0] || 'the main theme'}.`,
        'Your rating is close to the overall community sentiment.',
      ],
      contradictions: [
        'You found some pacing issues where others did not.',
      ],
    };
  },

  // Generate reading persona (still a simple local helper)
  generatePersona: async (readingDNA) => {
    await delay(1000);
    
    const { speed, depth, consistency, emotionalEngagement } = readingDNA;
    
    let persona = '';
    
    if (speed > 70 && depth > 70) {
      persona = 'The Voracious Scholar - You consume books rapidly while extracting deep insights';
    } else if (depth > 80) {
      persona = 'The Deep Diver - You prioritize understanding over speed, mining every detail';
    } else if (consistency > 80) {
      persona = 'The Disciplined Reader - Your reading habits are remarkably consistent';
    } else if (emotionalEngagement > 80) {
      persona = 'The Emotional Explorer - You deeply connect with characters and themes';
    } else {
      persona = 'The Balanced Reader - You maintain a healthy mix of all reading qualities';
    }
    
    return {
      persona,
      strengths: ['Deep comprehension', 'Consistent habits', 'Emotional intelligence'],
      recommendations: ['Try speed reading techniques', 'Join a book club', 'Explore new genres']
    };
  },

  // Get reading time suggestions
  getReadingSuggestions: async (userData) => {
    await delay(800);
    
    return {
      bestTime: '7:00 PM - 9:00 PM',
      reason: 'Based on your reading patterns, evening sessions show highest focus',
      burnoutRisk: 'Low',
      weeklyGoal: '5 hours',
      genreSuggestion: 'Consider exploring Science Fiction based on your recent patterns'
    };
  }
};
