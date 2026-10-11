"use client";
import { useEffect, useState } from "react";
import { BriefcaseIcon, ShoppingBagIcon, UserGroupIcon, DocumentTextIcon, Cog8ToothIcon, ChartBarIcon, ArrowRightOnRectangleIcon, ArrowPathRoundedSquareIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/theme";
import { loadCMS, saveCMS, defaults, type CMS } from "@/lib/cms";
import { LoginForm } from "@/components/admin/LoginForm";
import { DashboardTab } from "@/components/admin/DashboardTab";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { TeamTab } from "@/components/admin/TeamTab";
import { JournalTab } from "@/components/admin/JournalTab";
import { StudioTab } from "@/components/admin/StudioTab";

type Tab = "dashboard" | "projects" | "products" | "team" | "journal" | "studio";

const MENUS: { id: Tab; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: ChartBarIcon, desc: "Ringkasan statistik pengunjung dan aktivitas" },
  { id: "projects", label: "Projects", icon: BriefcaseIcon, desc: "Kelola portofolio proyek dan karya arsitektur" },
  { id: "products", label: "Katalog Produk", icon: ShoppingBagIcon, desc: "Atur daftar produk material dan furniture" },
  { id: "team", label: "Tim Arsitek", icon: UserGroupIcon, desc: "Manajemen profil tim dan kolaborator studio" },
  { id: "journal", label: "Jurnal", icon: DocumentTextIcon, desc: "Tulis artikel, berita, dan publikasi studio" },
  { id: "studio", label: "Setting Studio", icon: Cog8ToothIcon, desc: "Konfigurasi info kontak, footer, dan profil" },
];

export default function AdminPage() {
  const [cms, setCms] = useState<CMS | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [auth, setAuth] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");
  const { theme } = useTheme();

  const AUTH_KEY = "savana_admin_auth";

  useEffect(() => { loadCMS().then(setCms); }, []);

  // restore auth from cookie/localStorage — so back/refresh doesn't logout
  useEffect(() => {
    try {
      const ls = localStorage.getItem(AUTH_KEY) === "1";
      const cookie = document.cookie.split("; ").some(c => c.startsWith(`${AUTH_KEY}=1`));
      if (ls || cookie) setAuth(true);
      else setAuth(false);
    } catch { setAuth(false); }
  }, []);

  const persistAuth = (v: boolean) => {
    setAuth(v);
    try {
      if (v) {
        localStorage.setItem(AUTH_KEY, "1");
        document.cookie = `${AUTH_KEY}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      } else {
        localStorage.removeItem(AUTH_KEY);
        document.cookie = `${AUTH_KEY}=; path=/; max-age=0`;
      }
    } catch {}
  };

  if (!cms || auth === null) return null;

  const persist = async (next: CMS) => { 
    setCms(next); 
    try {
      const res: any = await saveCMS(next); 
      if (res?.stored === "prisma") setMsg("Tersimpan ✓");
      else setMsg("Tersimpan ✓");
    } catch (e: any) {
      const m = e?.message ?? "";
      // saveCMS throws with warning when DB not ready — data still in localStorage, but show real status
      if (/localStorage|DB not ready|not configured/i.test(m)) {
        setMsg("Tersimpan lokal ⚠️ — DB belum siap (jalan pnpm db:push). Reload di device lain akan hilang.");
      } else if (m.includes("429")) setMsg("Terlalu sering — coba lagi sebentar");
      else if (m.includes("401")) setMsg("Sesi habis — login ulang");
      else setMsg(`Gagal simpan: ${m.slice(0,140)}`);
      console.error(e);
    }
    setTimeout(() => setMsg(""), 3500); 
  };

  if (!auth) {
    return <LoginForm onLogin={() => persistAuth(true)} />;
  }

  const activeMenu = MENUS.find(m => m.id === tab);

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-[var(--line)] bg-[var(--card)] flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="h-16 px-6 flex items-center border-b border-[var(--line)] shrink-0">
          <img
            src={theme === "dark" ? "/savanaarsitekwhite.png" : "/savanaarsitekblack.png"}
            alt="SAVANA Architecture"
            className="h-10 w-auto object-contain"
          />
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {MENUS.map(m => (
            <button
              key={m.id}
              onClick={() => setTab(m.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors text-left ${
                tab === m.id
                  ? "bg-[var(--ink)] text-[var(--bg)] shadow-md"
                  : "hover:bg-[var(--bg)] text-[var(--ink)]"
              }`}
            >
              <span className="opacity-70"><m.icon className="w-5 h-5" /></span>
              {m.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--line)] space-y-2">
          {msg && (
            <div className="text-center text-xs bg-[var(--ink)] text-[var(--bg)] px-3 py-2 rounded-xl mb-2 animate-in fade-in zoom-in">
              {msg}
            </div>
          )}
          <a href="/" target="_blank" className="w-full flex justify-center items-center gap-2 text-xs px-4 py-2.5 rounded-xl border border-[var(--line)] hover:bg-[var(--bg)] transition-colors">
            <GlobeAltIcon className="w-4 h-4 opacity-50" />
            Lihat Website
          </a>
          <button 
            onClick={() => { if (confirm("Reset ke data awal? Semua perubahan akan hilang.")) persist(structuredClone(defaults) as CMS); }} 
            className="w-full flex justify-center items-center gap-2 text-xs px-4 py-2.5 rounded-xl border border-[var(--line)] hover:bg-[var(--bg)] transition-colors"
          >
            <ArrowPathRoundedSquareIcon className="w-4 h-4 opacity-50" />
            Reset Data Default
          </button>
          <button 
            onClick={() => persistAuth(false)} 
            className="w-full flex justify-center items-center gap-2 text-xs px-4 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 opacity-50" />
            Logout Keluar
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-[var(--line)] bg-[var(--card)] px-6 md:px-10 flex flex-col justify-center shrink-0 sticky top-0 z-40">
          <h2 className="text-xl font-serif leading-none">{activeMenu?.label}</h2>
          <p className="text-xs opacity-60 mt-1 leading-none">{activeMenu?.desc}</p>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {tab === "dashboard" && <DashboardTab cms={cms} onSave={persist} />}
            {tab === "projects" && <ProjectsTab cms={cms} onSave={persist} />}
            {tab === "products" && <ProductsTab cms={cms} onSave={persist} />}
            {tab === "team" && <TeamTab cms={cms} onSave={persist} />}
            {tab === "journal" && <JournalTab cms={cms} onSave={persist} />}
            {tab === "studio" && <div className="max-w-3xl"><StudioTab cms={cms} onSave={persist} /></div>}
          </div>
        </div>
      </main>
    </div>
  );
}
