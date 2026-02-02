import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-7 h-7 text-neon-magenta" />
            <h1 className="font-display text-5xl font-bold gradient-text">Settings</h1>
          </div>
          <p className="text-gray-400">Personalize your reading cockpit.</p>
        </motion.div>

        <div className="grid gap-6">
          <GlassCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-gray-400">Toggle Dark / Light mode</div>
              </div>
              <Button variant="secondary" icon={theme === 'dark' ? Sun : Moon} onClick={toggleTheme}>
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

