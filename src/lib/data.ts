import fs from 'fs';
import path from 'path';

export interface GameItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  banner: string;
  createdAt: string;
}

export interface UnlockStepItem {
  id: string;
  label: string;
  description: string;
  targetUrl: string;
  order: number;
  isActive: boolean;
  scriptId?: string | null;
  createdAt?: string;
}

export interface ScriptItem {
  id: string;
  slug: string;
  title: string;
  gameId: string;
  game?: GameItem;
  banner: string;
  videoUrl?: string | null;
  excerpt: string;
  content: string;
  code: string;
  executors: string[] | string;
  features: string[] | string;
  isPublished: boolean;
  isVerified: boolean;
  isKeyless: boolean;
  views: number;
  downloads: number;
  rating: number;
  author: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  unlockSteps?: UnlockStepItem[];
}

export interface GuideItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  banner: string;
  author: string;
  readTime: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type SiteSettings = Record<string, string>;

// Helper to get absolute path to /data files
function getDataPath(fileName: string): string {
  return path.join(process.cwd(), 'data', fileName);
}

// Read JSON file with error resilience
function readJsonFile<T>(fileName: string, defaultValue: T): T {
  try {
    const filePath = getDataPath(fileName);
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return defaultValue;
  }
}

// Games Data
export function getGames(): GameItem[] {
  return readJsonFile<GameItem[]>('games.json', []);
}

export function getGameBySlug(slug: string): GameItem | undefined {
  const games = getGames();
  return games.find((g) => g.slug === slug);
}

export function getGameById(id: string): GameItem | undefined {
  const games = getGames();
  return games.find((g) => g.id === id);
}

// Unlock Steps Data
export function getUnlockSteps(): UnlockStepItem[] {
  return readJsonFile<UnlockStepItem[]>('unlock-steps.json', []).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}

// Scripts Data
export function getScripts(): ScriptItem[] {
  const scripts = readJsonFile<ScriptItem[]>('scripts.json', []);
  const games = getGames();
  const globalSteps = getUnlockSteps();

  return scripts.map((s) => {
    const game = games.find((g) => g.id === s.gameId);
    const steps =
      s.unlockSteps && s.unlockSteps.length > 0 ? s.unlockSteps : globalSteps;

    // Normalizing executors and features to arrays
    const executors = Array.isArray(s.executors)
      ? s.executors
      : typeof s.executors === 'string'
      ? JSON.parse(s.executors || '[]')
      : ['Delta', 'Solara', 'Wave', 'Codex'];

    const features = Array.isArray(s.features)
      ? s.features
      : typeof s.features === 'string'
      ? JSON.parse(s.features || '[]')
      : ['Auto Farm', 'Fast Attack'];

    return {
      ...s,
      game,
      executors,
      features,
      unlockSteps: steps,
    };
  });
}

export function getPublishedScripts(): ScriptItem[] {
  return getScripts().filter((s) => s.isPublished);
}

export function getScriptBySlug(slug: string): ScriptItem | undefined {
  const scripts = getScripts();
  return scripts.find((s) => s.slug === slug);
}

export function getScriptById(id: string): ScriptItem | undefined {
  const scripts = getScripts();
  return scripts.find((s) => s.id === id);
}

// Guides Data
export function getGuides(): GuideItem[] {
  return readJsonFile<GuideItem[]>('guides.json', []);
}

export function getPublishedGuides(): GuideItem[] {
  return getGuides().filter((g) => g.isPublished);
}

export function getGuideBySlug(slug: string): GuideItem | undefined {
  const guides = getGuides();
  return guides.find((g) => g.slug === slug);
}

export function getGuideById(id: string): GuideItem | undefined {
  const guides = getGuides();
  return guides.find((g) => g.id === id);
}

// Site Settings Data
export function getSiteSettings(): SiteSettings {
  return readJsonFile<SiteSettings>('site-settings.json', {
    site_name: 'Rimuru Script Hub',
    site_description: 'Premier Roblox Script Hub',
    announcement: '⚡ Rimuru Script Hub v3 is live!',
    is_maintenance: 'false',
  });
}
