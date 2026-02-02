import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setAvatarPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateProfile({ name, avatar: avatarPreview || user?.avatar });
    setSaving(false);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-7 h-7 text-neon-cyan" />
            <h1 className="font-display text-5xl font-bold gradient-text">Profile</h1>
          </div>
          <p className="text-gray-400">Your identity, preferences, and AI persona seed.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-1 text-center">
            <img src={avatarPreview || user?.avatar} alt={user?.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            <div className="text-xl font-bold">{user?.name}</div>
            <div className="text-gray-400 text-sm">{user?.email}</div>
            <div className="mt-4">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-neon-cyan cursor-pointer">
                <ImageIcon size={16} />
                <span>Change avatar (optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, or GIF. Stored only in your browser.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <div className="grid gap-5">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} icon={User} />
              <Input label="Email" value={user?.email || ''} disabled icon={Mail} />
              <div className="flex justify-end">
                <Button icon={Save} disabled={saving} onClick={onSave}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

