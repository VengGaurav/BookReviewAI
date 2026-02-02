export const mockBooks = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    isbn: '9780525559474',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    rating: 4.5,
    pages: 304,
    publishYear: 2020,
    genre: ['Fiction', 'Philosophy', 'Fantasy'],
    description: 'A dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author of Reasons to Stay Alive and How To Stop Time.',
    aiSummary: 'A woman discovers a library between life and death, where she can explore alternate versions of her life based on different choices she could have made.',
    price: {
      amazon: 14.99,
      flipkart: 12.99,
      kindle: 9.99
    },
    sentiment: {
      positive: 78,
      neutral: 15,
      critical: 7
    },
    keywords: ['life choices', 'parallel universes', 'redemption', 'hope'],
    popularity: 95
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
    rating: 4.8,
    pages: 320,
    publishYear: 2018,
    genre: ['Self-Help', 'Psychology', 'Productivity'],
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones - A revolutionary system for getting 1% better every day.',
    aiSummary: 'A comprehensive guide to building better habits through small, incremental changes that compound over time.',
    price: {
      amazon: 16.99,
      flipkart: 15.49,
      kindle: 11.99
    },
    sentiment: {
      positive: 92,
      neutral: 6,
      critical: 2
    },
    keywords: ['habit formation', 'self-improvement', 'productivity', 'behavior change'],
    popularity: 98
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    isbn: '9780593135204',
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
    rating: 4.7,
    pages: 496,
    publishYear: 2021,
    genre: ['Science Fiction', 'Space Opera', 'Adventure'],
    description: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the author of The Martian.',
    aiSummary: 'An astronaut wakes up alone on a spaceship with no memory, discovering he\'s humanity\'s last hope to save Earth from extinction.',
    price: {
      amazon: 18.99,
      flipkart: 17.99,
      kindle: 12.99
    },
    sentiment: {
      positive: 94,
      neutral: 4,
      critical: 2
    },
    keywords: ['space exploration', 'problem-solving', 'humor', 'survival'],
    popularity: 96
  },
  {
    id: '4',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    isbn: '9780857197689',
    cover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=600&fit=crop',
    rating: 4.6,
    pages: 256,
    publishYear: 2020,
    genre: ['Finance', 'Psychology', 'Business'],
    description: "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know. It's about how you behave.",
    aiSummary: 'Explores the strange ways people think about money and teaches you how to make better sense of one of life\'s most important topics.',
    price: {
      amazon: 15.99,
      flipkart: 14.99,
      kindle: 10.99
    },
    sentiment: {
      positive: 89,
      neutral: 8,
      critical: 3
    },
    keywords: ['wealth building', 'financial behavior', 'investing', 'money mindset'],
    popularity: 93
  },
  {
    id: '5',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    isbn: '9780593318171',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    rating: 4.3,
    pages: 320,
    publishYear: 2021,
    genre: ['Science Fiction', 'Literary Fiction', 'Dystopian'],
    description: 'From the Nobel Prize-winning author of Never Let Me Go and The Remains of the Day comes a stunning new novel about artificial intelligence and the human heart.',
    aiSummary: 'An AI companion observes and learns about human nature while trying to save the life of the child she loves.',
    price: {
      amazon: 17.99,
      flipkart: 16.49,
      kindle: 13.99
    },
    sentiment: {
      positive: 76,
      neutral: 18,
      critical: 6
    },
    keywords: ['artificial intelligence', 'love', 'consciousness', 'humanity'],
    popularity: 85
  },
  {
    id: '6',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn: '9780062316110',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    rating: 4.6,
    pages: 464,
    publishYear: 2015,
    genre: ['History', 'Anthropology', 'Science'],
    description: 'A Brief History of Humankind - How did our species succeed in the battle for dominance?',
    aiSummary: 'A sweeping narrative spanning the entirety of human history, from the evolution of Homo sapiens to the present day.',
    price: {
      amazon: 19.99,
      flipkart: 18.99,
      kindle: 14.99
    },
    sentiment: {
      positive: 88,
      neutral: 9,
      critical: 3
    },
    keywords: ['human evolution', 'civilization', 'cognitive revolution', 'history'],
    popularity: 97
  }
];

export const mockReviews = {
  '1': [
    {
      source: 'amazon',
      rating: 4.5,
      excerpt: 'A thought-provoking exploration of regret and possibility.',
      sentiment: 'positive'
    },
    {
      source: 'goodreads',
      rating: 4.2,
      excerpt: 'Beautiful premise but execution felt a bit repetitive.',
      sentiment: 'neutral'
    }
  ],
  '2': [
    {
      source: 'amazon',
      rating: 4.9,
      excerpt: 'Life-changing book on habit formation. Highly practical.',
      sentiment: 'positive'
    },
    {
      source: 'goodreads',
      rating: 4.8,
      excerpt: 'The best book on habits I\'ve ever read.',
      sentiment: 'positive'
    }
  ]
};

export const getRandomBooks = (count = 6) => {
  return mockBooks.slice(0, count);
};

export const searchBooks = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return mockBooks.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.genre.some(g => g.toLowerCase().includes(lowercaseQuery))
  );
};

export const getBookById = (id) => {
  return mockBooks.find(book => book.id === id);
};
