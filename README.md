# Tawn Extension

> Smart URL Organizer — Beautiful new tab experience

Built with **Vite + React + TypeScript + CRXJS** for Chrome MV3.

## 🚀 Install in Chrome (Now)

The extension is **already built** in `dist/`. Load it directly:

1. Open Chrome → navigate to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder in this directory
5. Open a **new tab** → Tawn launches! 🎉

## 📁 Structure

```
tawn-extension/
├── dist/               ← Built extension (load this in Chrome)
│   ├── manifest.json
│   ├── newtab.html     ← New tab page
│   ├── popup.html      ← Toolbar popup
│   ├── service-worker-loader.js
│   └── assets/
├── src/
│   ├── newtab/         ← Main new tab UI
│   ├── popup/          ← Toolbar popup
│   ├── background/     ← Service worker (URL capture)
│   ├── store/          ← Zustand state
│   ├── lib/            ← Categorizer, API client
│   └── types/          ← TypeScript types
├── manifest.json       ← Extension manifest
└── vite.config.ts      ← Vite + CRXJS config
```

## 🛠 Development

```bash
npm install

# Development build (watch mode)
npm run dev

# Production build
npm run build
# → dist/ folder updated
```

## ⚙️ Environment

Create `.env`:
```
VITE_API_URL=http://localhost:4000/api/v1
VITE_WEB_URL=http://localhost:3000
```

## Features

- **New Tab Replacement**: Replaces Chrome new tab with Tawn launcher
- **Auto URL Capture**: Tracks every URL you visit, auto-categorized
- **10 Smart Categories**: Work, Dev, Finance, Entertainment, Shopping, Health, Social, News, Learning, Personal
- **Rich URL Cards**: OG images, favicon, description, visit count
- **Drag & Drop**: Reorder cards across sections
- **Context Menu**: Right-click any card → Move / Open / Delete
- **Offline First**: Stores 500 URLs locally, syncs when signed in
- **Dark / Light Mode**: Toggle in top bar
- **Authentication**: Sign in to sync across all your devices

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vite + CRXJS | Chrome extension bundler |
| React 18 + TypeScript | UI framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| @dnd-kit | Drag & drop |
| Zustand | State management |
| lucide-react | Icons |
