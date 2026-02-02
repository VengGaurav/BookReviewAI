import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    // Mock: simulate email send
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStatus({
      type: 'success',
      message: 'If an account exists for this email, we sent a reset link.',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-20" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="inline-block mb-4">
            <Sparkles className="w-12 h-12 text-neon-cyan" />
          </motion.div>
          <h1 className="font-display text-4xl font-bold gradient-text mb-2">Reset access</h1>
          <p className="text-gray-400">We’ll send a secure reset link (mock)</p>
        </div>

        <div className="glass-dark rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            {status.type === 'success' && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
                {status.message}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full" icon={ArrowRight}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Remembered your password?{' '}
            <Link to="/signin" className="text-neon-cyan hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

