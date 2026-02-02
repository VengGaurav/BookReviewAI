import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Gauge, Brain, Heart, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

const Slider = ({ label, icon: Icon, value, onChange, colorClass }) => (
  <div className="glass-dark rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <span className="font-medium">{label}</span>
      </div>
      <span className={`text-sm ${colorClass}`}>{value}</span>
    </div>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-cyan-400"
    />
  </div>
);

export const Onboarding = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const initial = useMemo(
    () => user?.readingDNA || { speed: 50, depth: 50, consistency: 50, emotionalEngagement: 50 },
    [user]
  );

  const [speed, setSpeed] = useState(initial.speed);
  const [depth, setDepth] = useState(initial.depth);
  const [consistency, setConsistency] = useState(initial.consistency);
  const [emotionalEngagement, setEmotionalEngagement] = useState(initial.emotionalEngagement);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    updateProfile({
      readingDNA: { speed, depth, consistency, emotionalEngagement },
      onboardingCompleted: true,
    });
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-7 h-7 text-neon-cyan" />
            <h1 className="font-display text-4xl font-bold gradient-text">AI Onboarding</h1>
          </div>
          <p className="text-gray-400">
            Calibrate your Reading DNA to unlock personalized insights (mock).
          </p>
        </motion.div>

        <div className="grid gap-4">
          <Slider label="Speed" icon={Gauge} value={speed} onChange={setSpeed} colorClass="text-neon-cyan" />
          <Slider label="Depth" icon={Brain} value={depth} onChange={setDepth} colorClass="text-neon-magenta" />
          <Slider label="Consistency" icon={Calendar} value={consistency} onChange={setConsistency} colorClass="text-neon-amber" />
          <Slider label="Emotional engagement" icon={Heart} value={emotionalEngagement} onChange={setEmotionalEngagement} colorClass="text-neon-purple" />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" size="lg" icon={ArrowRight} disabled={loading} onClick={handleComplete}>
            {loading ? 'Saving...' : 'Complete onboarding'}
          </Button>
        </div>
      </div>
    </div>
  );
};

