import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Sun, Moon, LogOut, ExternalLink, Trash2, Move,
  MoreHorizontal, GripVertical, Globe, Settings, Zap, X, ChevronDown, ChevronRight
} from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, useSortable, arrayMove, rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTawnStore } from '../store/useStore';
import { categorizeUrl } from '../lib/categorizer';
import type { UrlCard, CategoryKey } from '../types';
import { CATEGORY_META } from '../types';

// ─── URL Card Component ──────────────────────────────────────────────────────

function UrlCardItem({ card, onDelete, onMove, sections, isAuth }: {
  card: UrlCard;
  onDelete: (id: string) => void;
  onMove: (id: string, sectionId: string) => void;
  sections: any[];
  isAuth: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const meta = CATEGORY_META[card.category] || CATEGORY_META.personal;

  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-[#111118] hover:bg-[#141420] border border-white/[0.06] hover:border-violet-500/20 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer select-none"
      onClick={() => window.open(card.url, '_blank')}
    >
      {/* Drag handle */}
      <div
        {...attributes} {...listeners}
        onClick={e => e.stopPropagation()}
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-60 transition-opacity cursor-grab z-10"
      >
        <GripVertical className="w-3.5 h-3.5 text-zinc-500" />
      </div>

      {/* OG Image or fallback */}
      {card.ogImage ? (
        <div className="h-32 overflow-hidden">
          <img
            src={card.ogImage}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      ) : (
        <div
          className="h-20 flex items-center justify-center"
          style={{ background: meta.bg }}
        >
          <span className="text-3xl">{meta.icon}</span>
        </div>
      )}

      <div className="p-3">
        {/* Favicon + domain */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <img
            src={card.favicon}
            alt=""
            className="w-4 h-4 rounded flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23334155"/></svg>'; }}
          />
          <span className="text-zinc-500 text-[11px] truncate flex-1">{card.domain}</span>
          <span className="text-zinc-600 text-[10px] flex-shrink-0">{card.visitCount}×</span>
        </div>

        {/* Title */}
        <h3 className="text-zinc-100 text-[13px] font-medium leading-snug line-clamp-2 mb-1 group-hover:text-violet-300 transition-colors">
          {card.title || card.domain}
        </h3>

        {/* Description */}
        {card.description && (
          <p className="text-zinc-500 text-[11px] line-clamp-2 leading-relaxed mb-2">
            {card.description}
          </p>
        )}

        {/* Category pill */}
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.icon} {meta.label}
        </div>
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="w-6 h-6 rounded-md bg-black/70 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-7 w-44 bg-[#1c1c2a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              <button onClick={e => { e.stopPropagation(); window.open(card.url, '_blank'); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-zinc-300 hover:bg-white/5 text-xs">
                <ExternalLink className="w-3 h-3" /> Open in new tab
              </button>
              <button onClick={e => { e.stopPropagation(); setShowMove(!showMove); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-zinc-300 hover:bg-white/5 text-xs">
                <Move className="w-3 h-3" /> Move to section
              </button>
              {showMove && sections.map(s => (
                <button key={s.id}
                  onClick={e => { e.stopPropagation(); onMove(card.id, s.id); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full pl-8 pr-3 py-1.5 text-zinc-400 hover:bg-white/5 text-[11px]">
                  {s.icon} {s.name}
                </button>
              ))}
              <div className="h-px bg-white/[0.06] my-1" />
              <button onClick={e => { e.stopPropagation(); onDelete(card.id); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:bg-red-500/5 text-xs">
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Add URL Modal ───────────────────────────────────────────────────────────

function AddUrlModal({ onClose, onAdd }: { onClose: () => void; onAdd: (url: string) => void }) {
  const [url, setUrl] = useState('');
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#12121c] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Add URL</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && url && onAdd(url)}
          className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/40 transition-all mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors">Cancel</button>
          <button
            onClick={() => url && onAdd(url)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all"
          >Add</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Login Modal ─────────────────────────────────────────────────────────────

function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (user: any, token: string) => void }) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  const handle = async () => {
    setLoading(true); setError('');
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
      const body = tab === 'login' ? { email: form.email, password: form.password } : form;
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      onLogin(data.user, data.access_token);
      onClose();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#12121c] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">tawn</span>
        </div>
        <div className="flex gap-1 bg-white/[0.05] rounded-lg p-1 mb-5">
          {(['login','signup'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
              {t === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>
        {error && <div className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs mb-4">{error}</div>}
        <div className="space-y-3">
          {tab === 'signup' && (
            <input type="text" placeholder="Full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/40 transition-all" />
          )}
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/40 transition-all" />
          <input type="password" placeholder="Password" value={form.password}
            onKeyDown={e => e.key === 'Enter' && handle()}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/40 transition-all" />
          <button onClick={handle} disabled={loading}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (tab === 'login' ? 'Sign in' : 'Create account')}
          </button>
        </div>
        <p className="text-zinc-600 text-xs text-center mt-4">
          Or{' '}
          <button onClick={onClose} className="text-violet-400 hover:text-violet-300">continue without account</button>
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main New Tab Page ────────────────────────────────────────────────────────

export default function NewTab() {
  const {
    user, token, setAuth, clearAuth,
    sections, setSections, addSection, toggleSection,
    activeSection, setActiveSection,
    urls, setUrls, addUrl, removeUrl, updateUrl,
    theme, toggleTheme, search, setSearch,
  } = useTawnStore();

  const [showAdd, setShowAdd] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Load from storage on mount
  useEffect(() => {
    const loadLocal = async () => {
      try {
        const result = await chrome.storage.local.get(['tawn_urls', 'tawn_store']);
        if (result.tawn_urls) setUrls(result.tawn_urls as any);
      } catch (e) {}
      setLoading(false);
    };
    loadLocal();
  }, []);

  // Sync from backend if logged in
  useEffect(() => {
    if (!token) return;
    const sync = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
        const [sRes, uRes] = await Promise.all([
          fetch(`${API}/sections`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/urls`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (sRes.ok) setSections(await sRes.json());
        if (uRes.ok) setUrls(await uRes.json());
      } catch (e) {}
    };
    sync();
  }, [token]);

  const filteredUrls = urls.filter(u => {
    const matchSection = activeSection
      ? u.category === activeSection || u.sectionId === activeSection
      : true;
    const matchSearch = search
      ? u.title.toLowerCase().includes(search.toLowerCase()) ||
        u.domain.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchSection && matchSearch;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = urls.findIndex(u => u.id === active.id);
    const newIdx = urls.findIndex(u => u.id === over.id);
    setUrls(arrayMove(urls, oldIdx, newIdx));
  };

  const handleAddUrl = async (url: string) => {
    const hostname = new URL(url).hostname.replace('www.', '');
    const category = categorizeUrl(url);
    const newCard: UrlCard = {
      id: `local_${Date.now()}`,
      url,
      title: hostname,
      description: '',
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
      ogImage: '',
      domain: hostname,
      category,
      position: 0,
      visitCount: 1,
      lastVisited: new Date().toISOString(),
      tags: [],
      createdAt: new Date().toISOString(),
    };
    addUrl(newCard);

    // Sync to backend
    if (token) {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
      try {
        const res = await fetch(`${API}/urls`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ url }),
        });
        if (res.ok) {
          const data = await res.json();
          updateUrl(newCard.id, { ...data, id: data._id });
        }
      } catch {}
    }
    setShowAdd(false);
  };

  const handleDelete = async (id: string) => {
    removeUrl(id);
    if (token) {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
      fetch(`${API}/urls/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  const handleMove = async (urlId: string, sectionId: string) => {
    updateUrl(urlId, { sectionId, category: sectionId as CategoryKey });
    if (token) {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
      fetch(`${API}/urls/${urlId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sectionId }),
      }).catch(() => {});
    }
  };

  const handleLogin = (u: any, t: string) => {
    setAuth(u, t);
    chrome.storage.local.set({ tawn_token: t, tawn_user: u });
  };

  const handleLogout = () => {
    clearAuth();
    chrome.storage.local.remove(['tawn_token', 'tawn_user']);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0a0a0f] text-white' : 'bg-[#f8f8fc] text-gray-900'}`}>
      {/* ── Sidebar ───────────────────────── */}
      <div className={`w-52 flex-shrink-0 flex flex-col ${isDark ? 'bg-[#0d0d15] border-r border-white/[0.06]' : 'bg-white border-r border-black/[0.06]'}`}>
        {/* Logo */}
        <div className={`flex items-center gap-2 px-4 py-4 border-b ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">tawn</span>
        </div>

        {/* Add URL */}
        <div className="px-3 py-3">
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 text-violet-400 text-sm font-medium transition-all">
            <Plus className="w-4 h-4" /> Add URL
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-2">
          <button
            onClick={() => setActiveSection(null)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all ${!activeSection ? (isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.06] text-gray-900') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-800')}`}
          >
            <Globe className="w-3.5 h-3.5" /> All URLs
            <span className={`ml-auto text-[10px] ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>{urls.length}</span>
          </button>

          <div className="pt-2 pb-1 px-3">
            <span className={`text-[10px] uppercase tracking-widest font-medium ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>Sections</span>
          </div>

          {sections.map(s => {
            const count = urls.filter(u => u.category === s.id || u.sectionId === s.id).length;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(isActive ? null : s.id)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all`}
                style={isActive ? { background: `${s.color}20`, color: s.color } : {}}
              >
                <span className="text-base leading-none">{s.icon}</span>
                <span className={`flex-1 text-left ${!isActive ? (isDark ? 'text-zinc-400' : 'text-gray-600') : ''}`}>{s.name}</span>
                {count > 0 && <span className={`text-[10px] ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>{count}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t p-3 ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user.name?.[0] || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{user.name}</div>
                <div className={`text-[10px] truncate ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>{user.email}</div>
              </div>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="w-full py-2 text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors text-center"
            >
              Sign in to sync →
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content ──────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className={`flex items-center gap-3 px-5 py-3 border-b ${isDark ? 'bg-[#0d0d15] border-white/[0.06]' : 'bg-white border-black/[0.06]'}`}>
          <div className="relative flex-1 max-w-xl">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your URLs..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-zinc-600 focus:border-violet-500/40'
                  : 'bg-black/[0.04] border border-black/[0.08] text-gray-900 placeholder-gray-400 focus:border-violet-400/40'
              }`}
            />
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isDark ? 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400' : 'bg-black/[0.04] hover:bg-black/[0.08] text-gray-500'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Section title */}
        <div className="px-5 pt-4 pb-2">
          <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {activeSection
              ? sections.find(s => s.id === activeSection)?.name || 'Section'
              : search ? `Results for "${search}"` : 'All URLs'}
          </h2>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
            {filteredUrls.length} {filteredUrls.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-64 text-center rounded-2xl border border-dashed ${isDark ? 'border-white/[0.06]' : 'border-black/[0.08]'}`}>
              <Globe className={`w-10 h-10 mb-3 ${isDark ? 'text-zinc-700' : 'text-gray-300'}`} />
              <h3 className={`font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                {search ? 'No results found' : 'No URLs yet'}
              </h3>
              <p className={`text-sm max-w-xs ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                {search ? 'Try a different search term' : 'Browse the web and Tawn will automatically track your URLs'}
              </p>
              {!search && (
                <button
                  onClick={() => setShowAdd(true)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 text-violet-400 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" /> Add manually
                </button>
              )}
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredUrls.map(u => u.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredUrls.map(card => (
                    <UrlCardItem
                      key={card.id}
                      card={card}
                      onDelete={handleDelete}
                      onMove={handleMove}
                      sections={sections}
                      isAuth={!!token}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAdd && <AddUrlModal onClose={() => setShowAdd(false)} onAdd={handleAddUrl} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
      </AnimatePresence>
    </div>
  );
}
