'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GlassCard } from '../ui/GlassCard';
import { GlassInput, GlassTextarea } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(3, 'Title required'),
  slug: z.string().min(3, 'Slug required'),
  category: z.string().min(1, 'Category required'),
  excerpt: z.string().min(10, 'Excerpt required'),
  content: z.string().min(20, 'Content required'),
  banner: z.string().min(1, 'Banner URL required'),
  author: z.string().default('Rimuru Security Team'),
  readTime: z.string().default('4 min read'),
  isPublished: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export const GuideForm: React.FC<{ initialData?: any; isEditing?: boolean }> = ({
  initialData,
  isEditing = false,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      category: initialData?.category || 'PC Executors',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      banner:
        initialData?.banner ||
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      author: initialData?.author || 'Rimuru Security Team',
      readTime: initialData?.readTime || '4 min read',
      isPublished: initialData?.isPublished ?? true,
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);
    if (!isEditing) {
      const s = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', s);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const url = isEditing
        ? `/api/admin/guides/${initialData.id}`
        : '/api/admin/guides';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to save guide');
      toast.success(
        isEditing ? 'Guide updated successfully!' : 'Guide created successfully!'
      );
      router.push('/rimurudev.vn/guides');
      router.refresh();
    } catch {
      toast.error('Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isEditing ? 'Edit Guide Article' : 'Write New Guide'}
          </h1>
          <p className="text-xs text-white/50">
            Publish Roblox executor tutorials and anticheat safety guides.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GlassButton type="button" variant="secondary" size="sm" onClick={() => router.back()}>
            Cancel
          </GlassButton>
          <GlassButton type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {isEditing ? 'Save Guide' : 'Publish Guide'}
          </GlassButton>
        </div>
      </div>

      <GlassCard className="p-6 sm:p-8 border-sky-500/20 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">Guide Title *</label>
          <GlassInput {...register('title')} onChange={handleTitleChange} placeholder="e.g. How to Safely Inject Delta on Android" />
          {errors.title && <span className="text-xs text-red-400">{errors.title.message}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Slug *</label>
            <GlassInput {...register('slug')} placeholder="how-to-inject-delta-android" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Category *</label>
            <select
              {...register('category')}
              className="w-full bg-white/[0.06] text-white border border-sky-500/20 rounded-2xl md:rounded-full px-4 py-3 text-xs backdrop-blur-xl outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="PC Executors" className="bg-[#050b14]">PC Executors</option>
              <option value="Mobile Guide" className="bg-[#050b14]">Mobile Guide</option>
              <option value="Security & Safety" className="bg-[#050b14]">Security & Safety</option>
              <option value="Troubleshooting" className="bg-[#050b14]">Troubleshooting</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">Banner Image URL *</label>
          <GlassInput {...register('banner')} placeholder="https://..." />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">Short Excerpt *</label>
          <GlassTextarea {...register('excerpt')} rows={2} placeholder="A short description summarizing the guide..." />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">Full Article Content (Markdown) *</label>
          <GlassTextarea {...register('content')} rows={10} placeholder="Write step-by-step instructions and notes..." />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Author</label>
            <GlassInput {...register('author')} placeholder="Rimuru Security Team" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Estimated Read Time</label>
            <GlassInput {...register('readTime')} placeholder="4 min read" />
          </div>
        </div>
      </GlassCard>
    </form>
  );
};
