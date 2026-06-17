# Live Schedule

Aplikasi web mobile-first untuk mengelola jadwal live streaming dan input sales streamer di online shop.

## Fitur

- **Admin/Manager**: kelola streamer, buat jadwal live, lihat laporan sales
- **Streamer**: login dengan PIN, lihat jadwal, input sales setelah live
- **Mobile-friendly**: responsive + PWA (bisa di-install di Android/iOS)

## Quick Start

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Login Default

| Role | PIN |
|------|-----|
| Admin | `1234` |
| Streamer Sari | `1111` |
| Streamer Budi | `2222` |
| Streamer Dewi | `3333` |

## Install di HP (PWA)

1. Buka aplikasi di Chrome (Android) atau Safari (iOS)
2. **Android**: Menu → "Add to Home screen" / "Install app"
3. **iOS**: Share → "Add to Home Screen"

## Tech Stack

- Next.js 16 (App Router)
- SQLite (better-sqlite3) — data tersimpan lokal di folder `data/`
- Tailwind CSS 4
- PWA manifest

## Production

Set environment variables:

```
ADMIN_PIN=your-secure-pin
SESSION_SECRET=long-random-string
```

```bash
npm run build
npm start
```
