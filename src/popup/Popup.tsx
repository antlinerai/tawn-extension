import { useState, useEffect } from 'react';
import { Zap, ExternalLink, Globe } from 'lucide-react';

export default function Popup() {
  const [recentUrls, setRecentUrls] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    chrome.storage.local.get(['tawn_urls', 'tawn_user']).then((r: any) => {
      setRecentUrls(((r.tawn_urls as any[]) || []).slice(0, 6));
      setUser(r.tawn_user);
    });
  }, []);

  const openNewtab = () => {
    chrome.tabs.create({ url: 'chrome://newtab' });
    window.close();
  };

  return (
    <div className="w-72 bg-[#0d0d15] text-white min-h-[200px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm">tawn</span>
        </div>
        {user && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold">
            {user.name?.[0]}
          </div>
        )}
      </div>

      <div className="px-3 py-3">
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2 px-1">Recent</p>
        {recentUrls.length === 0 ? (
          <p className="text-zinc-600 text-xs text-center py-6">Browse the web to start tracking</p>
        ) : (
          <div className="space-y-0.5">
            {recentUrls.map((u, i) => (
              <button key={i} onClick={() => { chrome.tabs.create({ url: u.url }); window.close(); }}
                className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-white/[0.06] transition-colors text-left group">
                {u.favicon ? (
                  <img src={u.favicon} alt="" className="w-3.5 h-3.5 rounded flex-shrink-0" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                )}
                <span className="text-zinc-300 text-xs truncate flex-1">{u.title || u.domain}</span>
                <ExternalLink className="w-3 h-3 text-zinc-700 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 pb-3 border-t border-white/[0.06] pt-3">
        <button onClick={openNewtab}
          className="w-full py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 text-violet-400 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5">
          <Globe className="w-3.5 h-3.5" /> Open Dashboard
        </button>
        {!user && <p className="text-zinc-700 text-[10px] text-center mt-2">Sign in to sync across devices →</p>}
      </div>
    </div>
  );
}
