'use client';

import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GlassInput, GlassTextarea } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message sent successfully!', {
        description: 'Our security and support team will respond within 24 hours.',
      });
    }, 1000);
  };

  if (submitted) {
    return (
      <GlassCard className="p-8 text-center space-y-4 border-emerald-500/30">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/30">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">Thank You!</h3>
        <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
          Your inquiry has been received. Our team will review your report and get back to you at <strong>{formData.email}</strong>.
        </p>
        <GlassButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', category: 'general', message: '' });
          }}
        >
          Send Another Message
        </GlassButton>
      </GlassCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">Your Name / Nickname</label>
          <GlassInput
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. ShadowScript"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">Email Address</label>
          <GlassInput
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@domain.com"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-white/80">Inquiry Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full bg-white/[0.06] hover:bg-white/[0.09] text-white border border-white/15 rounded-2xl px-4 py-3 text-sm backdrop-blur-xl outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
        >
          <option value="general" className="bg-[#050b14] text-white">General Question</option>
          <option value="bug" className="bg-[#050b14] text-white">Report Broken Script / Bug</option>
          <option value="dmca" className="bg-[#050b14] text-white">DMCA / Copyright Takedown</option>
          <option value="security" className="bg-[#050b14] text-white">Security Vulnerability Report</option>
          <option value="partner" className="bg-[#050b14] text-white">Developer Partnership / Submit Script</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-white/80">Message</label>
        <GlassTextarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please describe your question, issue or request in detail..."
          rows={5}
          required
        />
      </div>

      <GlassButton
        type="submit"
        variant="primary"
        size="lg"
        isLoading={loading}
        className="w-full justify-center"
        rightIcon={<Send className="w-4 h-4" />}
      >
        Submit Message
      </GlassButton>
    </form>
  );
};
