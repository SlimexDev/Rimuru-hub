'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDropzone } from 'react-dropzone';
import { GlassCard } from '../ui/GlassCard';
import { GlassInput, GlassTextarea } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import { GlassDialog } from '../ui/Dialog';
import {
  UploadCloud,
  X,
  Plus,
  Trash2,
  Gamepad2,
  FileCode,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  gameId: z.string().min(1, 'Game selection is required'),
  banner: z.string().min(1, 'Banner image is required'),
  videoUrl: z.string().optional(),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  code: z.string().min(5, 'Raw Lua script code is required'),
  executors: z.array(z.string()).min(1, 'Select at least 1 executor'),
  features: z.array(z.string()).min(1, 'Add at least 1 feature tag'),
  isPublished: z.boolean().default(true),
  isVerified: z.boolean().default(true),
  isKeyless: z.boolean().default(true),
  author: z.string().default('Rimuru Dev'),
  version: z.string().default('v1.0.0'),
  unlockSteps: z.array(
    z.object({
      label: z.string().min(1, 'Step label required'),
      description: z.string(),
      targetUrl: z.string().min(1, 'Target URL required'),
      order: z.number().default(0),
      isActive: z.boolean().default(true),
    })
  ).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface ScriptFormProps {
  initialData?: any;
  games: { id: string; name: string; slug: string }[];
  isEditing?: boolean;
}

export const ScriptForm: React.FC<ScriptFormProps> = ({
  initialData,
  games: initialGames,
  isEditing = false,
}) => {
  const router = useRouter();
  const [gamesList, setGamesList] = useState(initialGames);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Quick Add Game Modal State
  const [addGameModalOpen, setAddGameModalOpen] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [addingGame, setAddingGame] = useState(false);

  const defaultExecutors = ['Delta', 'Solara', 'Wave', 'Codex', 'Hydrogen', 'Arceus X'];

  const initialExecutors = initialData?.executors
    ? typeof initialData.executors === 'string'
      ? JSON.parse(initialData.executors)
      : initialData.executors
    : ['Delta', 'Solara', 'Wave', 'Codex'];

  const initialFeatures = initialData?.features
    ? typeof initialData.features === 'string'
      ? JSON.parse(initialData.features)
      : initialData.features
    : ['Auto Farm', 'Fast Attack', 'ESP'];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      gameId: initialData?.gameId || gamesList[0]?.id || '',
      banner:
        initialData?.banner ||
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      videoUrl: initialData?.videoUrl || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      code:
        initialData?.code ||
        `loadstring(game:HttpGet("https://raw.githubusercontent.com/RimuruScript/Hub/main/loader.lua"))()`,
      executors: initialExecutors,
      features: initialFeatures,
      isPublished: initialData?.isPublished ?? true,
      isVerified: initialData?.isVerified ?? true,
      isKeyless: initialData?.isKeyless ?? true,
      author: initialData?.author || 'Rimuru Dev',
      version: initialData?.version || 'v1.0.0',
      unlockSteps: initialData?.unlockSteps || [],
    },
  });

  const banner = watch('banner');
  const selectedGameId = watch('gameId');
  const selectedExecutors = watch('executors') || [];
  const selectedFeatures = watch('features') || [];
  const content = watch('content');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'unlockSteps',
  });

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug);
    }
  };

  // Quick Add Game Action
  const handleQuickAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim()) {
      toast.error('Please enter a game name');
      return;
    }

    setAddingGame(true);
    try {
      const res = await fetch('/api/admin/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGameName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create game');

      setGamesList((prev) => [...prev, data.game]);
      setValue('gameId', data.game.id, { shouldValidate: true });
      toast.success(`Game "${data.game.name}" created successfully!`);
      setNewGameName('');
      setAddGameModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error creating game');
    } finally {
      setAddingGame(false);
    }
  };

  // Drag and drop image upload
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        setValue('banner', data.url);
        toast.success('Banner uploaded successfully!');
      } catch (err: any) {
        toast.error(err.message || 'Image upload failed');
      } finally {
        setUploading(false);
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
  });

  const toggleExecutor = (name: string) => {
    const current = [...selectedExecutors];
    const exists = current.includes(name);
    const updated = exists
      ? current.filter((x) => x !== name)
      : [...current, name];
    setValue('executors', updated, { shouldValidate: true });
  };

  const addFeature = () => {
    if (!newFeatureInput.trim()) return;
    const current = [...selectedFeatures];
    if (!current.includes(newFeatureInput.trim())) {
      setValue('features', [...current, newFeatureInput.trim()], {
        shouldValidate: true,
      });
      setNewFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    const current = [...selectedFeatures];
    current.splice(index, 1);
    setValue('features', current, { shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const url = isEditing
        ? `/api/admin/scripts/${initialData.id}`
        : '/api/admin/scripts';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Operation failed');

      toast.success(
        isEditing ? 'Script updated successfully!' : 'Script created successfully!'
      );
      router.push('/rimurudev.vn/scripts');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Submission error');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isEditing ? `Edit: ${initialData?.title}` : 'Add New Roblox Script'}
            </h1>
            <p className="text-xs sm:text-sm text-white/50">
              Fill in metadata, Lua loadstring, and configure custom unlock steps with YouTube & Discord links.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => router.back()}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              {isEditing ? 'Save Changes' : 'Publish Script'}
            </GlassButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Core Fields */}
          <div className="lg:col-span-8 space-y-6">
            {/* Main Info Card */}
            <GlassCard className="p-6 sm:p-8 border-sky-500/20 space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight border-b border-sky-500/15 pb-3">
                Basic Script Details
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/80">Script Title *</label>
                <GlassInput
                  {...register('title')}
                  onChange={handleTitleChange}
                  placeholder="e.g. Redz Hub Blox Fruits - Auto Farm & Sea 3"
                />
                {errors.title && (
                  <span className="text-[11px] text-red-400">{errors.title.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/80">URL Slug *</label>
                  <GlassInput {...register('slug')} placeholder="redz-hub-blox-fruits" />
                  {errors.slug && (
                    <span className="text-[11px] text-red-400">{errors.slug.message}</span>
                  )}
                </div>

                {/* Game Select + Quick Add Game Button */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-white/80">Game *</label>
                    <button
                      type="button"
                      onClick={() => setAddGameModalOpen(true)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> + New Game
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      {...register('gameId')}
                      className="w-full bg-white/[0.06] hover:bg-white/[0.09] text-white border border-sky-500/20 rounded-2xl md:rounded-full px-4 py-3 text-xs backdrop-blur-xl outline-none focus:ring-2 focus:ring-sky-500/20"
                    >
                      {gamesList.map((g) => (
                        <option key={g.id} value={g.id} className="bg-[#050b14] text-white">
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.gameId && (
                    <span className="text-[11px] text-red-400">{errors.gameId.message}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/80">
                  Short Excerpt (SEO / Card Description) *
                </label>
                <GlassTextarea
                  {...register('excerpt')}
                  rows={2}
                  placeholder="A concise summary of what this script does..."
                />
                {errors.excerpt && (
                  <span className="text-[11px] text-red-400">{errors.excerpt.message}</span>
                )}
              </div>
            </GlassCard>

            {/* Banner Dropzone */}
            <GlassCard className="p-6 border-sky-500/20 space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight border-b border-sky-500/15 pb-3">
                Banner & Media
              </h3>

              <div
                {...getRootProps()}
                className={`p-6 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-sky-400 bg-sky-500/10'
                    : 'border-sky-500/20 hover:border-sky-400/50 bg-white/[0.02]'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-full bg-sky-500/10 border border-sky-500/20">
                    <UploadCloud className="w-6 h-6 text-sky-400" />
                  </div>
                  <p className="text-xs text-white/80 font-medium">
                    {uploading
                      ? 'Uploading image...'
                      : isDragActive
                      ? 'Drop image here...'
                      : 'Drag & drop banner image here, or click to browse'}
                  </p>
                  <span className="text-[11px] text-white/40">
                    Supports PNG, JPG, WEBP (Saved locally in /public/uploads)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/80">Or Image URL</label>
                <GlassInput {...register('banner')} placeholder="https://..." />
              </div>

              {banner && (
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/40 border border-sky-500/20 mt-2">
                  <Image src={banner} alt="Preview" fill className="object-cover" />
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-medium text-white/80">
                  Showcase Video URL (Optional YouTube embed)
                </label>
                <GlassInput
                  {...register('videoUrl')}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </GlassCard>

            {/* Lua Code Box */}
            <GlassCard className="p-6 border-sky-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-sky-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Raw Lua Script Code (Loadstring) *
                  </h3>
                </div>
                <GlassBadge variant="cyan" size="sm">
                  HIDDEN UNTIL UNLOCKED
                </GlassBadge>
              </div>

              <textarea
                {...register('code')}
                rows={5}
                className="w-full bg-black/60 font-mono text-xs text-sky-300 p-4 rounded-2xl border border-sky-500/20 outline-none focus:ring-2 focus:ring-sky-500/20 leading-relaxed selection:bg-sky-500/30"
                placeholder='loadstring(game:HttpGet("https://raw.githubusercontent.com/..."))()'
              />
              <p className="text-[11px] text-white/40">
                🔒 This loadstring code is masked and only revealed to users after completing verification tasks.
              </p>
              {errors.code && (
                <span className="text-[11px] text-red-400">{errors.code.message}</span>
              )}
            </GlassCard>

            {/* Documentation Content Editor */}
            <GlassCard className="p-6 border-sky-500/20 space-y-4">
              <div className="flex items-center justify-between border-b border-sky-500/15 pb-3">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Script Overview & Documentation *
                </h3>
                <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-full border border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'edit'
                        ? 'bg-sky-500/30 text-sky-300'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'preview'
                        ? 'bg-sky-500/30 text-sky-300'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === 'edit' ? (
                <GlassTextarea
                  {...register('content')}
                  rows={8}
                  placeholder="Write detailed descriptions, instructions and feature notes..."
                />
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-sky-500/15 text-xs text-white/80 whitespace-pre-line leading-relaxed min-h-[160px]">
                  {content || 'No content written yet.'}
                </div>
              )}
              {errors.content && (
                <span className="text-[11px] text-red-400">{errors.content.message}</span>
              )}
            </GlassCard>

            {/* Custom Unlock Steps Builder with YouTube & Discord Quick Presets */}
            <GlassCard className="p-6 border-sky-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/15 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Custom Unlock Steps (YouTube / Discord / Links)
                  </h3>
                  <p className="text-[11px] text-white/50">
                    Add tasks requiring users to subscribe to YouTube or join Discord before revealing script.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <GlassButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      append({
                        label: 'Subscribe to YouTube Channel',
                        description: 'Subscribe to our official channel for daily script updates',
                        targetUrl: 'https://youtube.com',
                        order: fields.length + 1,
                        isActive: true,
                      })
                    }
                  >
                    <Image src="/youtube.png" alt="YT" width={16} height={16} className="mr-1 inline-block" />
                    + Add YouTube
                  </GlassButton>
                  <GlassButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      append({
                        label: 'Join Discord Server',
                        description: 'Join Rimuru Discord community for support and bypass keys',
                        targetUrl: 'https://discord.com',
                        order: fields.length + 1,
                        isActive: true,
                      })
                    }
                  >
                    <Image src="/discord.png" alt="Discord" width={16} height={16} className="mr-1 inline-block" />
                    + Add Discord
                  </GlassButton>
                </div>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => {
                  const currentUrl = watch(`unlockSteps.${index}.targetUrl` as const) || '';
                  const isYT = currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be');
                  const isDiscord = currentUrl.includes('discord.com') || currentUrl.includes('discord.gg');

                  return (
                    <div
                      key={field.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-sky-500/20 space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-500/20 text-red-400"
                        title="Remove step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {isYT ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-[11px] font-bold text-red-300">
                            <Image src="/youtube.png" alt="YouTube" width={16} height={16} />
                            YouTube Task
                          </div>
                        ) : isDiscord ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[11px] font-bold text-indigo-300">
                            <Image src="/discord.png" alt="Discord" width={16} height={16} />
                            Discord Task
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-[11px] font-bold text-sky-300">
                            <Globe className="w-3.5 h-3.5" />
                            Website Task
                          </div>
                        )}
                        <span className="text-xs text-white/50">Step #{index + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-white/70">
                            Step Title *
                          </label>
                          <GlassInput
                            {...register(`unlockSteps.${index}.label` as const)}
                            placeholder="e.g. Subscribe to YouTube Channel"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-white/70">
                            Target URL *
                          </label>
                          <GlassInput
                            {...register(`unlockSteps.${index}.targetUrl` as const)}
                            placeholder="https://youtube.com/@channel or https://discord.gg/..."
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-white/70">
                          Step Description
                        </label>
                        <GlassInput
                          {...register(`unlockSteps.${index}.description` as const)}
                          placeholder="Short description displayed below the title..."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Settings, Executors, Features */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publication & Status Card */}
            <GlassCard className="p-6 border-sky-500/20 space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight border-b border-sky-500/15 pb-3">
                Status & Visibility
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-sky-500/15 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Published</span>
                    <span className="text-[11px] text-white/50">Visible on public Script Hub</span>
                  </div>
                  <input
                    type="checkbox"
                    {...register('isPublished')}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 accent-sky-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-sky-500/15 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Verified Badge</span>
                    <span className="text-[11px] text-white/50">Passed anti-malware sandbox audit</span>
                  </div>
                  <input
                    type="checkbox"
                    {...register('isVerified')}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 accent-sky-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-sky-500/15 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Keyless Script</span>
                    <span className="text-[11px] text-white/50">No daily key system required</span>
                  </div>
                  <input
                    type="checkbox"
                    {...register('isKeyless')}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 accent-sky-500 cursor-pointer"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-white/70">Version</label>
                  <GlassInput {...register('version')} placeholder="v3.2.0" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-white/70">Author</label>
                  <GlassInput {...register('author')} placeholder="Rimuru Dev" />
                </div>
              </div>
            </GlassCard>

            {/* Compatible Executors Multi-select */}
            <GlassCard className="p-6 border-sky-500/20 space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight border-b border-sky-500/15 pb-3">
                Supported Executors
              </h3>
              <div className="flex flex-wrap gap-2">
                {defaultExecutors.map((exec) => {
                  const isSelected = selectedExecutors.includes(exec);
                  return (
                    <button
                      key={exec}
                      type="button"
                      onClick={() => toggleExecutor(exec)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-sky-500/30 text-sky-300 border border-sky-400/40 shadow-sm'
                          : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {exec} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Feature Tags List */}
            <GlassCard className="p-6 border-sky-500/20 space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight border-b border-sky-500/15 pb-3">
                Feature Tags
              </h3>
              <div className="flex gap-2">
                <GlassInput
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  placeholder="e.g. Fast Attack"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <GlassButton type="button" size="sm" variant="secondary" onClick={addFeature}>
                  Add
                </GlassButton>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-sky-500/10 text-sky-200 border border-sky-500/20"
                  >
                    {feat}
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </form>

      {/* Quick Add Game Dialog Modal */}
      <GlassDialog
        isOpen={addGameModalOpen}
        onClose={() => setAddGameModalOpen(false)}
        title="Add New Game"
        description="Enter Roblox game name to add into catalogue and select immediately."
      >
        <form onSubmit={handleQuickAddGame} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Game Name *</label>
            <GlassInput
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              placeholder="e.g. Rivals, Deepwoken, Anime Vanguards..."
              autoFocus
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setAddGameModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              isLoading={addingGame}
            >
              Add & Select Game
            </GlassButton>
          </div>
        </form>
      </GlassDialog>
    </>
  );
};
