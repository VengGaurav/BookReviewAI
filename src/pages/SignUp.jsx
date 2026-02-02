import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { level: 1, text: 'Weak', color: 'bg-red-500' },
      { level: 2, text: 'Fair', color: 'bg-yellow-500' },
      { level: 3, text: 'Good', color: 'bg-blue-500' },
      { level: 4, text: 'Strong', color: 'bg-green-500' }
    ];

    return levels[strength - 1] || { level: 0, text: '', color: '' };
  };

  const strength = getStrength();

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all ${
              level <= strength.level ? strength.color : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">Password strength: {strength.text}</p>
    </div>
  );
};

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/onboarding');
    } catch (err) {
      setErrors({ general: 'Failed to create account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 grid-background opacity-20" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-amber/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-neon-magenta" />
          </motion.div>
          <h1 className="font-display text-4xl font-bold gradient-text mb-2">
            Join BookAI
          </h1>
          <p className="text-gray-400">Start your intelligent reading journey</p>
        </div>

        {/* Sign Up Form */}
        <div className="glass-dark rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              error={errors.name}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              error={errors.email}
              required
            />

            <div>
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                error={errors.password}
                required
              />
              <PasswordStrength password={formData.password} />
            </div>

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              error={errors.confirmPassword}
              required
            />

            {errors.general && <div className="alert alert-error">{errors.general}</div>}

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1" />
              <span className="text-sm text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-neon-cyan hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-neon-cyan hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
              icon={ArrowRight}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="text-neon-cyan hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 glass-dark rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-3">What you'll get:</p>
          <div className="space-y-2">
            {[
              'AI-powered book recommendations',
              'Advanced reading analytics',
              'Personalized reading insights',
              'Connect with book lovers'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-neon-cyan" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
