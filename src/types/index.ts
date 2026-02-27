export interface UrlCard {
  id: string;
  url: string;
  title: string;
  description: string;
  favicon: string;
  ogImage: string;
  domain: string;
  category: CategoryKey;
  sectionId?: string;
  subsectionId?: string;
  position: number;
  visitCount: number;
  lastVisited: string;
  tags: string[];
  createdAt: string;
}

export interface Subsection {
  id: string;
  name: string;
  icon: string;
  position: number;
}

export interface Section {
  id: string;
  name: string;
  icon: string;
  color: string;
  slug: string;
  position: number;
  isExpanded: boolean;
  subsections: Subsection[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  theme: 'dark' | 'light';
}

export type CategoryKey =
  | 'work' | 'dev' | 'finance' | 'entertainment'
  | 'shopping' | 'health' | 'social' | 'news'
  | 'learning' | 'personal';

export const CATEGORY_META: Record<CategoryKey, { color: string; icon: string; label: string; bg: string }> = {
  work:          { color: '#6366f1', bg: '#6366f115', icon: '💼', label: 'Work' },
  dev:           { color: '#14b8a6', bg: '#14b8a615', icon: '⚡', label: 'Development' },
  finance:       { color: '#10b981', bg: '#10b98115', icon: '💰', label: 'Finance' },
  entertainment: { color: '#f59e0b', bg: '#f59e0b15', icon: '🎬', label: 'Entertainment' },
  shopping:      { color: '#ec4899', bg: '#ec489915', icon: '🛒', label: 'Shopping' },
  health:        { color: '#ef4444', bg: '#ef444415', icon: '❤️', label: 'Health' },
  social:        { color: '#3b82f6', bg: '#3b82f615', icon: '💬', label: 'Social' },
  news:          { color: '#64748b', bg: '#64748b15', icon: '📰', label: 'News' },
  learning:      { color: '#f97316', bg: '#f9731615', icon: '📚', label: 'Learning' },
  personal:      { color: '#8b5cf6', bg: '#8b5cf615', icon: '🏠', label: 'Personal' },
};

export const DEFAULT_SECTIONS: Section[] = [
  { id: 'work', name: 'Work', icon: '💼', color: '#6366f1', slug: 'work', position: 0, isExpanded: true, subsections: [] },
  { id: 'dev', name: 'Development', icon: '⚡', color: '#14b8a6', slug: 'dev', position: 1, isExpanded: true, subsections: [] },
  { id: 'finance', name: 'Finance', icon: '💰', color: '#10b981', slug: 'finance', position: 2, isExpanded: true, subsections: [] },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#f59e0b', slug: 'entertainment', position: 3, isExpanded: true, subsections: [] },
  { id: 'shopping', name: 'Shopping', icon: '🛒', color: '#ec4899', slug: 'shopping', position: 4, isExpanded: false, subsections: [] },
  { id: 'health', name: 'Health', icon: '❤️', color: '#ef4444', slug: 'health', position: 5, isExpanded: false, subsections: [] },
  { id: 'social', name: 'Social', icon: '💬', color: '#3b82f6', slug: 'social', position: 6, isExpanded: true, subsections: [] },
  { id: 'news', name: 'News', icon: '📰', color: '#64748b', slug: 'news', position: 7, isExpanded: false, subsections: [] },
  { id: 'learning', name: 'Learning', icon: '📚', color: '#f97316', slug: 'learning', position: 8, isExpanded: false, subsections: [] },
  { id: 'personal', name: 'Personal', icon: '🏠', color: '#8b5cf6', slug: 'personal', position: 9, isExpanded: true, subsections: [] },
];
