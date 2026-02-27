import { categorizeUrl } from '../lib/categorizer';

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  const url = tab.url;
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) return;

  try {
    const result = await chrome.storage.local.get(['tawn_token', 'tawn_urls']);
    const existingUrls = (result.tawn_urls as any[]) || [];
    const token = result.tawn_token;
    const exists = existingUrls.find(u => u.url === url);

    if (exists) {
      const updated = existingUrls.map(u =>
        u.url === url ? { ...u, visitCount: (u.visitCount || 0) + 1, lastVisited: new Date().toISOString() } : u
      );
      await chrome.storage.local.set({ tawn_urls: updated });
    } else {
      const category = categorizeUrl(url);
      const hostname = new URL(url).hostname.replace('www.', '');
      const newCard = {
        id: `local_${Date.now()}`,
        url,
        title: tab.title || hostname,
        description: '',
        favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
        ogImage: '',
        domain: hostname,
        category,
        position: existingUrls.length,
        visitCount: 1,
        lastVisited: new Date().toISOString(),
        tags: [],
        createdAt: new Date().toISOString(),
      };
      const updated = [newCard, ...existingUrls.slice(0, 499)];
      await chrome.storage.local.set({ tawn_urls: updated });

      if (token) {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
        fetch(`${API}/urls/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ url }),
        }).catch(console.error);
      }
    }
  } catch (e) { console.error('[Tawn BG]', e); }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'tawn-save', title: 'Save to Tawn', contexts: ['page', 'link'] });
});
