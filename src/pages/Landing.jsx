import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Book, Brain, TrendingUp, Users, Sparkles, ArrowRight, Zap, Target, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const Landing = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const [currentText, setCurrentText] = useState(0);
  const heroTexts = [
    'AI-Powered Reading',
    'Smart Book Discovery',
    'Reading Analytics',
    'Intelligent Reviews'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI Book Analysis',
      description: 'Get instant AI-generated reviews, summaries, and insights',
      color: 'text-neon-cyan'
    },
    {
      icon: TrendingUp,
      title: 'Reading Analytics',
      description: 'Track your reading habits, speed, and progress with smart insights',
      color: 'text-neon-magenta'
    },
    {
      icon: Users,
      title: 'Community Reviews',
      description: 'Compare your thoughts with millions of readers worldwide',
      color: 'text-neon-amber'
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions based on your reading DNA',
      color: 'text-neon-purple'
    }
  ];

  const stats = [
    { value: '10M+', label: 'Books Analyzed' },
    { value: '500K+', label: 'Active Readers' },
    { value: '50M+', label: 'Reviews Generated' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 grid-background opacity-10" />
        <motion.div 
          className="absolute top-0 left-1/4 w-[420px] h-[420px] bg-neon-cyan/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-neon-magenta/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />

        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 text-center px-4 max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 glass rounded-full">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-neon-cyan text-sm font-medium">The Future of Reading</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-5 tracking-tight">
              <span className="gradient-text">
                {heroTexts[currentText]}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience books like never before with AI-powered insights, 
              intelligent analytics, and a reading ecosystem that understands you
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link to="/signup">
                <Button size="lg" icon={ArrowRight} className="text-base px-8 py-4">
                  Start Reading Smarter
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="lg" variant="outline" className="text-base px-8 py-4">
                  Explore Books
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * idx }}
                  className="glass rounded-xl p-4"
                >
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-neon-cyan rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-neon-cyan rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-5xl font-bold gradient-text mb-4">
              Powered by Intelligence
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to elevate your reading experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-800 mb-4`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-magenta/10 to-neon-amber/10" />
            <div className="relative z-10">
              <Star className="w-16 h-16 text-neon-cyan mx-auto mb-6" />
              <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-6">
                Ready to Transform Your Reading?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of readers who've discovered the future of books
              </p>
              <Link to="/signup">
                <Button size="lg" icon={Sparkles} className="text-lg px-10 py-4">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
