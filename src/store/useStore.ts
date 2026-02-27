import { create } from 'zustand';
import type { Section, UrlCard, User } from '../types/index';
import { DEFAULT_SECTIONS } from '../types/index';

interface TawnStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  sections: Section[];
  setSections: (s: Section[]) => void;
  addSection: (s: Section) => void;
  toggleSection: (id: string) => void;
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;
  urls: UrlCard[];
  setUrls: (u: UrlCard[]) => void;
  addUrl: (u: UrlCard) => void;
  removeUrl: (id: string) => void;
  updateUrl: (id: string, data: Partial<UrlCard>) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  search: string;
  setSearch: (s: string) => void;
}

export const useTawnStore = create<TawnStore>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),

  sections: DEFAULT_SECTIONS,
  setSections: (sections) => set({ sections }),
  addSection: (section) => set(s => ({ sections: [...s.sections, section] })),
  toggleSection: (id) => set(s => ({
    sections: s.sections.map(sec => sec.id === id ? { ...sec, isExpanded: !sec.isExpanded } : sec),
  })),
  activeSection: null,
  setActiveSection: (id) => set({ activeSection: id }),

  urls: [],
  setUrls: (urls) => set({ urls }),
  addUrl: (url) => set(s => ({ urls: [url, ...s.urls] })),
  removeUrl: (id) => set(s => ({ urls: s.urls.filter(u => u.id !== id) })),
  updateUrl: (id, data) => set(s => ({
    urls: s.urls.map(u => u.id === id ? { ...u, ...data } : u),
  })),

  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  search: '',
  setSearch: (search) => set({ search }),
}));
