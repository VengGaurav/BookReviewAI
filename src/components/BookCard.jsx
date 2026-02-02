import React from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BookCard = ({ book, variant = 'default' }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass rounded-xl overflow-hidden cursor-pointer group relative"
      onClick={() => navigate(`/book/${book.id}`)}
    >
      {/* Aura Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 via-neon-magenta/0 to-neon-amber/0 
                      group-hover:from-neon-cyan/10 group-hover:via-neon-magenta/10 group-hover:to-neon-amber/10 
                      transition-all duration-500 rounded-xl" />
      
      {/* Book Cover */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={book.cover} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />
        
        {/* Floating Rating */}
        <div className="absolute top-3 right-3 glass px-3 py-1.5 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-neon-amber fill-neon-amber" />
          <span className="text-sm font-bold">{book.rating}</span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-5">
        <h3 className="font-display text-lg font-bold mb-1 line-clamp-2 group-hover:text-neon-cyan transition-colors">
          {book.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3">{book.author}</p>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-3">
          {book.genre.slice(0, 2).map((genre, idx) => (
            <span 
              key={idx}
              className="text-xs px-2 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{book.pages} pages</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{Math.round(book.pages / 250)} hrs</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/95 to-transparent 
                     flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <p className="text-sm text-gray-300 line-clamp-3">{book.description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const CompactBookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-lg p-4 flex gap-4 cursor-pointer"
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <img 
        src={book.cover} 
        alt={book.title}
        className="w-16 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h4 className="font-semibold mb-1 line-clamp-1">{book.title}</h4>
        <p className="text-sm text-gray-400 mb-2">{book.author}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-neon-amber fill-neon-amber" />
            <span className="text-xs">{book.rating}</span>
          </div>
          <span className="text-xs text-gray-500">{book.genre[0]}</span>
        </div>
      </div>
    </motion.div>
  );
};
