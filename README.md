# SAVANA Architecture

> **Small studio in Jakarta — Houses that know how to breathe.**  
> Architecture portfolio + product catalog + journal, dengan CMS ringan berbasis **Next.js + Prisma Postgres + Vercel Blob**.

Live design reference: editorial, minimal, tipografi serif + neo-grotesque sans — dark/light theme, framer-motion, full-image efficient.

---

## ✨ Fitur

| Area | Deskripsi |
|---|---|
| **Works** | Grid project (cover + gallery), kategori `Residential / Hospitality / Cultural / Commercial / Studio`, status `Built / Ongoing / Concept`. Detail `/works/[id]` + listing `/works` filter. |
| **Objects** | Katalog produk furniture/material (`/objects`), harga, stock `Ready / Pre-Order`, gallery. |
| **Studio & People** | Logo magnetic repel + headline outline typography. People cards grayscale → color on hover. |
| **Journal** | TinyMCE rich text. Listing `/journal` + detail `/journal/[id]` dengan sidebar TOC otomatis, share popup. |
| **Contact** | `Let's build` headline, WA CTA, animated underline. |
| **Admin `/admin`** | Login, tabs: Dashboard · Projects · Products · Team · Journal · Setting Studio. Inline list↔form. |
| **Upload** | Pilih banyak file sekaligus, drag & drop, cover via ⭐, kompres `canvas → WebP 1600px 0.7` → Vercel Blob. |

---

## 🧱 Tech Stack

- **Framework**: Next.js `16.3.6` (Turbopack, App Router), React `19`, TypeScript `5`
- **Styling**: Tailwind CSS `4`, `framer-motion 13`, `next/font`
- **Editor**: `@tinymce/tinymce-react 6`
- **DB**: `Prisma 6` + Postgres (`POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` — Vercel Postgres / Neon)
- **Storage**: `@vercel/blob 2` + `sharp` — WebP compress, public blob URL
- **Package manager**: `pnpm 11`

---

## 📁 Struktur

```
app/
  api/cms/route.ts      # GET/POST via Prisma (auto-seed dari defaults jika DB kosong)
  api/upload/route.ts   # POST file → lib/storage → Vercel Blob
lib/
  cms.ts                # loadCMS / saveCMS (fetch /api/cms → localStorage fallback)
  cms.defaults.ts       # DEFAULT_* seed data
  prisma.ts             # PrismaClient singleton
  storage.ts            # sharp WebP + Vercel Blob (fallback local /public/uploads)
prisma/
  schema.prisma         # SavanaProject/Journal/Team/Product/Studio
  seed.ts               # seed dari defaults
```

---

## 🚀 Quick Start

```bash
pnpm install
cp .env.example .env.local   # isi POSTGRES_* + BLOB_READ_WRITE_TOKEN di bawah
pnpm db:generate
pnpm db:push                 # butuh POSTGRES_PRISMA_URL
pnpm db:seed                 # opsional — GET /api/cms juga auto-seed
pnpm dev
```

Build:

```bash
pnpm build
```

---

## 🔐 Environment

Buat `.env.local` (jangan commit):

```env
# Prisma Postgres (Vercel Postgres atau Neon)
POSTGRES_PRISMA_URL=postgres://...:6543/...?pgbouncer=true
POSTGRES_URL_NON_POOLING=postgres://...:5432/...
# atau DATABASE_URL (fallback)

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# optional: proteksi POST /api/cms & /api/upload via ADMIN_TOKEN
ADMIN_TOKEN=isi-random-string

# TinyMCE cloud (opsional)
NEXT_PUBLIC_TINYMCE_API_KEY=xxx
```

Di **Vercel** → Project Settings → Environment Variables → tambah semua di atas (Production + Preview). Jika belum ada Postgres, buat via **Vercel → Storage → Create Postgres**.

---

## 🗄️ Database

Schema di `prisma/schema.prisma`. Migrasi:

```bash
pnpm db:push   # prisma db push (tanpa file migrasi, cocok untuk Vercel)
# atau
pnpm prisma migrate dev --name init
```

Seed: `pnpm db:seed` atau biarkan `GET /api/cms` auto-seed saat tabel kosong.

---

## 🖼️ Upload & Kompresi

- **Gambar**: `compressImageToBlob(file, 1600, 0.7)` → WebP → `POST /api/upload` → `lib/storage.ts` → `uploads/{folder}/…` di Vercel Blob.
- **Video**: tanpa kompres, validasi `≤ 25MB`.
- Tanpa `BLOB_READ_WRITE_TOKEN` (lokal tanpa env): fallback ke `public/uploads` lokal.

---

## 🔧 CMS & Admin

- `lib/cms.ts`: `loadCMS()` → `fetch /api/cms` → `localStorage savana_cms_v11` → `defaults`. `saveCMS(next)` → `POST /api/cms` + optimistic localStorage.
- Tanpa `POSTGRES_*`, save tetap `200 {stored:"local"}` (hanya localStorage). Dengan DB, jadi `{stored:"prisma"}` persistent cross-device.

---

## 📦 Deploy (Vercel)

1. Push ke GitHub.
2. Vercel → New Project → import repo → set env di atas → Deploy.
3. Add **Vercel Postgres** dan **Vercel Blob Store** dari dashboard (otomatis inject env).
4. `next.config.ts` sudah allow `*.vercel-storage.com` + `images.unsplash.com`.

---

## 📝 Lisensi & Kredit

Studio Savana — Est. 2018, Jakarta.
