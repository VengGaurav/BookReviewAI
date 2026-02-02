import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const PasswordStrength = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return { level: 0, text: '', color: '' };
    let s = 0;
    if (password.length >= 8) s++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^a-zA-Z0-9]/.test(password)) s++;
    const levels = [
      { level: 1, text: 'Weak', color: 'bg-red-500' },
      { level: 2, text: 'Fair', color: 'bg-yellow-500' },
      { level: 3, text: 'Good', color: 'bg-blue-500' },
      { level: 4, text: 'Strong', color: 'bg-green-500' },
    ];
    return levels[s - 1] || { level: 0, text: '', color: '' };
  }, [password]);

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all ${level <= strength.level ? strength.color : 'bg-gray-700'}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">Password strength: {strength.text}</p>
    </div>
  );
};

export const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || 'mock-token';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) return setError('Invalid or expired reset link.');
    if (!password || password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setDone(true);

    // Mock success: redirect after a beat
    setTimeout(() => navigate('/signin'), 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-20" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-amber/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="inline-block mb-4">
            <Sparkles className="w-12 h-12 text-neon-magenta" />
          </motion.div>
          <h1 className="font-display text-4xl font-bold gradient-text mb-2">Set new password</h1>
          <p className="text-gray-400">Secure your account (mock)</p>
        </div>

        <div className="glass-dark rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="New password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
              <PasswordStrength password={password} />
            </div>

            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              icon={Lock}
              required
            />

            {error && <div className="alert alert-error">{error}</div>}

            {done && (
              <div className="alert alert-success">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>Password updated. Redirecting…</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full" icon={ArrowRight}>
              {loading ? 'Updating...' : 'Update password'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <Link to="/signin" className="text-neon-cyan hover:underline font-medium">
              Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

