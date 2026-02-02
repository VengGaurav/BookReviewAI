// External Insights Service - Mock implementation (backend-ready)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const currency = (n) => (typeof n === 'number' ? n.toFixed(2) : '—');

const pickBestDeal = (offers) => {
  const priced = offers.filter((o) => typeof o.price === 'number' && Number.isFinite(o.price));
  if (priced.length === 0) return null;
  return priced.reduce((best, cur) => (cur.price < best.price ? cur : best), priced[0]);
};

export const externalInsightsService = {
  getBuyingLinks: async (book) => {
    await delay(400);

    // Backend-ready shape: vendor, url, format, price, rating.
    const offers = [
      {
        vendor: 'Amazon',
        format: 'Paperback',
        price: book?.price?.amazon,
        rating: 4.6,
        url: `https://www.amazon.com/s?k=${encodeURIComponent(`${book?.title || ''} ${book?.author || ''}`)}`,
      },
      {
        vendor: 'Flipkart',
        format: 'Paperback',
        price: book?.price?.flipkart,
        rating: 4.4,
        url: `https://www.flipkart.com/search?q=${encodeURIComponent(`${book?.title || ''} ${book?.author || ''}`)}`,
      },
      {
        vendor: 'Google Books',
        format: 'eBook',
        price: typeof book?.price?.kindle === 'number' ? Math.max(book.price.kindle - 1, 1.99) : undefined,
        rating: 4.5,
        url: `https://books.google.com/books?q=${encodeURIComponent(`${book?.title || ''} ${book?.author || ''}`)}`,
      },
      {
        vendor: 'Kindle',
        format: 'Kindle',
        price: book?.price?.kindle,
        rating: 4.7,
        url: `https://www.amazon.com/s?k=${encodeURIComponent(`${book?.title || ''} kindle`)}`,
      },
    ];

    return {
      offers,
      bestDeal: pickBestDeal(offers),
      formatPrice: currency,
    };
  },

  getInternetPulse: async (book) => {
    await delay(450);

    const sentiment = book?.sentiment || { positive: 0, neutral: 0, critical: 0 };
    const keywords = book?.keywords || [];

    // Mock “AI-generated public opinion summary”
    const summary = `Across major platforms, readers consistently highlight "${keywords[0] || 'the core theme'}" and praise the book’s ${keywords[1] || 'readability'}. Criticism clusters around pacing and expectations vs genre framing. Overall sentiment is strongly positive.`;

    return {
      summary,
      sentiment,
      keywords,
      lovedPoints: [
        `Compelling take on ${keywords[0] || 'the central idea'}`,
        'Accessible writing and strong momentum',
        'Memorable moments that spark reflection',
      ],
      criticizedPoints: [
        'Pacing feels uneven for some readers',
        'A few concepts are under-explored',
        'Ending may divide opinions',
      ],
      sources: ['Amazon', 'Goodreads', 'Google Books'],
    };
  },
};

