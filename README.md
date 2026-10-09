# SAVANA Architecture

> **Small studio in Jakarta — Houses that know how to breathe.**  
> Architecture portfolio + product catalog + journal, dengan CMS ringan berbasis **Next.js + Supabase**.

Live design reference: editorial, minimal, tipografi serif + neo-grotesque sans — dark/light theme, framer-motion, full-image efficient.

---

## ✨ Fitur

| Area | Deskripsi |
|---|---|
| **Works** | Grid project (cover + gallery 100 foto + 4 video), kategori `Residential / Hospitality / Cultural / Commercial / Studio`, status `Built / Ongoing / Concept`. Detail page `/works/[id]` + listing `/works` dengan filter. Header scalable: `{n} categories · Since 2018`. |
| **Objects** | Katalog produk furniture/material (`/objects`, `/objects/[id]`), harga, stock `Ready / Pre-Order`, gallery 10 foto. |
| **Studio & People** | Logo magnetic repel + headline outline typography, quote, about. People cards grayscale → color on hover, stagger framer-motion. Philosophy chips dipindah ke **Contact** biar Studio bersih. |
| **Journal** | TinyMCE rich text (heading, image, table). Listing `/journal` (preview 4, Show more) + detail `/journal/[id]` dengan **sidebar TOC otomatis dari H2/H3**, Simpan (localStorage) & **popup Bagikan** (WA, FB, X, Telegram, Salin tautan). 4 artikel related tanpa judul section. |
| **Contact** | Layout merapat ke gambar kayak Studio (`gap-8 xl:gap-12 items-center`), `Let's build` headline, WA CTA, social underline animation. |
| **Nav / Footer** | Navbar `Works · Objects · Studio · Team` + Footer `Connect / Office` — semua dengan **animated underline** `scale-x-0 → 100 origin-left`. Logo support dark/light (`savanaarsitekwhite/black.png`). |
| **Admin `/admin`** | Login, sidebar pakai logo theme-aware. Tabs: Dashboard · Projects · Products · Team · Journal · Setting Studio. Inline `list ↔ form` pakai `useState<'list'|'form'>` + `AnimatePresence`, tanpa ganti URL. |
| **Upload** | **Single multi-upload**: pilih banyak file sekaligus, drag & drop premium (dashed + dot icon kayak single upload). **Cover dipilih via ⭐ di tiap thumbnail** (amber border + badge Cover, auto fallback ke foto pertama). Kompres `canvas → WebP 1600px 0.7` sebelum upload. Gallery component terpisah video. |

---

## 🧱 Tech Stack

- **Framework**: Next.js `16.3.6` (Turbopack, App Router), React `19`, TypeScript `5`
- **Styling**: Tailwind CSS `4`, CSS variables `--bg / --card / --ink / --line`, `globals.css`, `next/font` (Inter as `--font-display`, serif, mono)
- **Animasi**: `framer-motion 13` — entrance, stagger, magnetic (`useMotionValue + useSpring + useTransform`), underline, share popup
- **Editor**: `@tinymce/tinymce-react 6` — dynamic import, `images_upload_handler` + `file_picker_callback` → `compressImageToBlob → /api/upload`
- **Icons**: `@heroicons/react 2`
- **DB & Storage**: `@supabase/supabase-js 2` — Postgres + Storage bucket `savana` (public). RLS: anon `SELECT` only, write via `service_role` di API route.
- **Package manager**: `pnpm 11`

---

## 📁 Struktur

```
app/
  page.tsx              # landing (Hero, Works, Studio, Objects, Contact, JournalSection)
  layout.tsx            # font, ThemeProvider, metadata
  globals.css
  icon.png
  works/[id]/page.tsx   # detail project
  works/page.tsx        # listing + category filter
  objects/[id]/page.tsx
  objects/page.tsx
  journal/[id]/page.tsx # detail + TOC + share popup + 4 related
  journal/page.tsx
  admin/page.tsx        # sidebar logo, tabs, persist via /api/cms
  api/cms/route.ts      # GET anon read, POST service_role upsert (ADMIN_TOKEN optional)
  api/upload/route.ts   # POST file → supabase storage savana/{folder}/… → public URL
components/
  landing/  Navbar, Hero, Works, Studio, Objects, TeamJournal, Contact, Footer, theme.tsx
  admin/    LoginForm, AdminModal, TinyEditor, ImageUpload (single), MediaGallery (multi+cover ⭐), DashboardTab, ProjectsTab, ProductsTab, TeamTab, JournalTab, StudioTab
lib/
  cms.ts           # loadCMS / saveCMS aman (fetch /api/cms → localStorage fallback), types re-export
  cms.defaults.ts  # DEFAULT_PROJECTS / JOURNAL / TEAM / PRODUCTS / STUDIO, type definitions
  supabase.ts      # getSupabaseBrowser (anon) & getSupabaseAdmin (service_role)
  compress.ts      # compressImageToBlob (createImageBitmap → canvas WebP)
  upload.ts        # uploadToSupabase(file, folder) → POST /api/upload
public/
  savanaarsitekwhite.png / savanaarsitekblack.png
supabase-setup.sql # table site_settings + storage bucket + RLS policies
```

---

## 🚀 Quick Start

```bash
# 1. install
pnpm install

# 2. env
cp .env.example .env.local   # isi di bawah

# 3. dev
pnpm dev                     # http://localhost:3000
# admin → http://localhost:3000/admin
```

Build check:

```bash
pnpm build
pnpm start
```

Lint:

```bash
pnpm lint
```

---

## 🔐 Environment

Buat `.env.local` (jangan commit):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # jangan pakai prefix NEXT_PUBLIC — server only
# optional: proteksi POST /api/cms
ADMIN_TOKEN=isi-random-string-panjang
# TinyMCE cloud (opsional, bisa pakai self-host)
NEXT_PUBLIC_TINYMCE_API_KEY=xxx
```

Di **Vercel** → Project Settings → Environment Variables → tambah semua di atas (Production + Preview).

---

## 🗄️ Supabase Setup

1. Supabase Dashboard → SQL Editor → paste & Run `supabase-setup.sql`:
   - `create table site_settings (id text primary key, data jsonb)`
   - `enable RLS`, policy `anon SELECT only`
   - `storage bucket savana public` + storage policies anon read, authenticated/service write
2. Storage → cek bucket `savana` sudah **Public**.
3. Table `site_settings` → satu row `id = 'cms'` akan dibuat otomatis saat `POST /api/cms` pertama.

> Jika sudah pernah setup sebelum fix RLS, jalankan ulang bagian `DROP POLICY / CREATE POLICY` di file tersebut.

---

## 🖼️ Upload & Kompresi

- **Gambar**: `compressImageToBlob(file, 1600, 0.7)` → `File WebP` → `POST /api/upload` → `savana/{folder}/images/{uuid}.webp` → `getPublicUrl`. Folder: `projects`, `products`, `gallery`, `covers`, `editor`.
- **Video**: tanpa kompres, validasi `≤ 25MB` → `savana/{folder}/videos/…`.
- **TinyMCE**: handler yang sama, max sisi `1200px q 0.7`. Tidak pernah tulis ke `public/`.
- **Cover**: bukan field terpisah di upload — satu `MediaGallery` multi file, centang **⭐** di thumbnail untuk set `cover` / `image`. Hapus cover → otomatis pindah ke foto pertama.

---

## 🔧 CMS & Admin

- `lib/cms.ts`:
  - `loadCMS()` → `fetch /api/cms` → `localStorage savana:cms` → fallback `defaults` (normalize project `images`, product `images`). Dispatch `savana:update`.
  - `saveCMS(next)` → `POST /api/cms` (Bearer `ADMIN_TOKEN` jika diset) + optimistic localStorage.
- Tabs sudah inline list↔form, tombol `Simpan` → `persist()` dengan toast `Tersimpan ✓`.
- Reset: button `Reset Data Default` → `structuredClone(defaults)`.
- Creds admin: lihat `components/admin/LoginForm.tsx` (default dev, ganti sebelum production).

---

## 🎨 Desain & Animasi Penting

- **Navbar/Footer**: `group` + `span h-px scale-x-0 group-hover:scale-x-100 origin-left 300ms [0.22,1,0.36,1]`.
- **Hero/Contact/Studio headline**: `font-display font-black uppercase` + accent `text-transparent WebkitTextStroke 1px var(--ink) opacity-30`.
- **Studio**: logo `scale 0.92→1`, headline word stagger, philosophy → Contact, people card `y 22 + scale 0.97`, `whileHover y -4`, image `scale 1.08→1`.
- **Magnetic Studio**: `wrapRef onMouseMove` → `mx/my → useSpring → logoX = -v*0.55 / textX = v*0.18` — logo menghindar berlawanan kursor.
- **Contact**: `grid lg:grid-cols-2 gap-8 xl:gap-12 items-center` — tulisan merapat ke image (sebelumnya `gap-16` + `sticky`).
- **Works header**: dinamis `categories · Since 2018` bukan `2022–2025` (scalable).
- **Journal detail**: TOC `extractToc(/<h[2-3]>/) + injectIds + IntersectionObserver scroll-spy`, popup share `fixed inset-0 + backdrop-blur + grid 2 WA/FB/X/Telegram + salin tautan`.

---

## 📦 Deploy (Vercel + Supabase)

1. Push ke GitHub.
2. Vercel → New Project → import repo → set env di atas → Deploy.
3. Supabase → Settings → API → copy URL & anon/service keys ke Vercel.
4. Cek `next.config.ts` sudah allow `images.remotePatterns: *.supabase.co, images.unsplash.com`.

---

## 📝 Lisensi & Kredit

Studio Savana — Est. 2018, Jakarta.  
Stack by Vercel / Supabase / TinyMCE. Template custom, bukan `create-next-app` default lagi.
