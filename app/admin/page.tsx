"use client";
import { useEffect, useState } from "react";
import { BriefcaseIcon, ShoppingBagIcon, UserGroupIcon, DocumentTextIcon, Cog8ToothIcon, ChartBarIcon, ArrowRightOnRectangleIcon, ArrowPathRoundedSquareIcon, GlobeAltIcon, Bars3Icon } from "@heroicons/react/24/outline";
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

const MENUS: { id: Tab; label: string; icon: React.ElementType; desc: string; short: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: ChartBarIcon, desc: "Ringkasan statistik pengunjung dan aktivitas", short: "Home" },
  { id: "projects", label: "Projects", icon: BriefcaseIcon, desc: "Kelola portofolio proyek", short: "Projects" },
  { id: "products", label: "Katalog Produk", icon: ShoppingBagIcon, desc: "Atur daftar produk & material", short: "Katalog" },
  { id: "team", label: "Tim Arsitek", icon: UserGroupIcon, desc: "Manajemen profil tim studio", short: "Team" },
  { id: "journal", label: "Jurnal", icon: DocumentTextIcon, desc: "Tulis artikel & publikasi", short: "Jurnal" },
  { id: "studio", label: "Setting Studio", icon: Cog8ToothIcon, desc: "Konfigurasi kontak & profil", short: "Studio" },
];

export default function AdminPage() {
  const [cms, setCms] = useState<CMS | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [auth, setAuth] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme } = useTheme();
  const AUTH_KEY = "savana_admin_auth";

  useEffect(() => { loadCMS().then(setCms); }, []);
  useEffect(() => {
    try {
      const ls = localStorage.getItem(AUTH_KEY) === "1";
      const cookie = document.cookie.split("; ").some(c => c.startsWith(`${AUTH_KEY}=1`));
      if (ls || cookie) setAuth(true); else setAuth(false);
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
      await saveCMS(next);
      setMsg("Tersimpan ✓");
    } catch (e: any) {
      const m = e?.message ?? "";
      if (/localStorage|DB not ready|not configured/i.test(m)) setMsg("Tersimpan lokal ⚠️ — DB belum siap");
      else if (m.includes("429")) setMsg("Terlalu sering — coba lagi");
      else if (m.includes("401")) setMsg("Sesi habis — login ulang");
      else setMsg(`Gagal: ${m.slice(0,120)}`);
    }
    setTimeout(() => setMsg(""), 3500);
  };

  if (!auth) return <LoginForm onLogin={() => persistAuth(true)} />;

  const activeMenu = MENUS.find(m => m.id === tab);

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Desktop Sidebar - only lg+ */}
      <aside className="hidden lg:flex w-64 xl:w-72 border-r border-[var(--line)] bg-[var(--card)] flex-col sticky top-0 h-screen overflow-y-auto shrink-0 z-30">
        <div className="h-16 px-6 flex items-center border-b border-[var(--line)] shrink-0">
          <img src={theme === "dark" ? "/savanaarsitekwhite.png" : "/savanaarsitekblack.png"} alt="SAVANA" className="h-9 w-auto object-contain" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {MENUS.map(m => (
            <button key={m.id} onClick={() => setTab(m.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-colors ${tab===m.id ? "bg-[var(--ink)] text-[var(--bg)] shadow-md" : "hover:bg-[var(--bg)]"}`}>
              <m.icon className="w-5 h-5 opacity-70" /> {m.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--line)] space-y-2">
          {msg && <div className="text-center text-xs bg-[var(--ink)] text-[var(--bg)] px-3 py-2 rounded-xl">{msg}</div>}
          <a href="/" target="_blank" className="w-full flex justify-center items-center gap-2 text-xs px-4 py-2.5 rounded-xl border border-[var(--line)] hover:bg-[var(--bg)]"><GlobeAltIcon className="w-4 h-4 opacity-50" /> Lihat Website</a>
          <button onClick={() => { if (confirm("Reset ke data awal?")) persist(structuredClone(defaults) as CMS); }} className="w-full flex justify-center items-center gap-2 text-xs px-4 py-2.5 rounded-xl border border-[var(--line)] hover:bg-[var(--bg)]"><ArrowPathRoundedSquareIcon className="w-4 h-4 opacity-50" /> Reset Data Default</button>
          <button onClick={() => persistAuth(false)} className="w-full flex justify-center items-center gap-2 text-xs px-4 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20"><ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout Keluar</button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-14 lg:h-16 border-b border-[var(--line)] bg-[var(--card)]/95 backdrop-blur px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          {/* Title - no hamburger sidebar (bottom nav handles it) */}
          <div className="min-w-0">
            <h2 className="text-[15px] lg:text-xl font-serif leading-none truncate">{activeMenu?.label}</h2>
            <p className="text-[11px] opacity-60 mt-1 leading-none truncate hidden sm:block">{activeMenu?.desc}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {msg && <span className="hidden sm:inline-flex text-xs bg-[var(--ink)] text-[var(--bg)] px-3 py-1.5 rounded-full">{msg}</span>}

            {/* Mobile only: hamburger untuk logout + website (desktop dihapus sesuai request) */}
            <div className="relative lg:hidden">
              <button onClick={() => setUserMenuOpen(v => !v)} className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--card)] flex items-center justify-center" aria-label="Menu">
                <Bars3Icon className="w-5 h-5" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-[var(--card)] border border-[var(--line)] rounded-2xl shadow-xl z-20 overflow-hidden p-1.5">
                    <div className="px-3 py-2.5 border-b border-[var(--line)] mb-1">
                      <p className="text-xs font-semibold">Admin SAVANA</p>
                      <p className="text-[11px] opacity-60">admin@savana.id</p>
                    </div>
                    <a href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--bg)] text-sm"><GlobeAltIcon className="w-4 h-4 opacity-60" /> Lihat Website</a>
                    <button onClick={() => { setUserMenuOpen(false); if (confirm("Reset ke data awal?")) persist(structuredClone(defaults) as CMS); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--bg)] text-sm text-left"><ArrowPathRoundedSquareIcon className="w-4 h-4 opacity-60" /> Reset Data</button>
                    <button onClick={() => { setUserMenuOpen(false); persistAuth(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-sm text-left"><ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout Keluar</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-10">
          <div className="max-w-6xl mx-auto w-full">
            {tab === "dashboard" && <DashboardTab cms={cms} onSave={persist} />}
            {tab === "projects" && <ProjectsTab cms={cms} onSave={persist} />}
            {tab === "products" && <ProductsTab cms={cms} onSave={persist} />}
            {tab === "team" && <TeamTab cms={cms} onSave={persist} />}
            {tab === "journal" && <JournalTab cms={cms} onSave={persist} />}
            {tab === "studio" && <div className="max-w-3xl"><StudioTab cms={cms} onSave={persist} /></div>}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - hanya HP/tablet */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--card)]/95 backdrop-blur border-t border-[var(--line)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
          {MENUS.map(m => {
            const active = tab === m.id;
            return (
              <button key={m.id} onClick={() => setTab(m.id)} className={`flex flex-col items-center justify-center gap-1 min-w-0 flex-1 py-2 px-1 rounded-2xl transition-all ${active ? "text-[var(--ink)]" : "opacity-60 hover:opacity-100"}`}>
                <span className={`p-1.5 rounded-xl transition-colors ${active ? "bg-[var(--ink)] text-[var(--bg)] shadow-md" : "bg-transparent"}`}>
                  <m.icon className="w-[18px] h-[18px]" />
                </span>
                <span className={`text-[10px] leading-none tracking-wide truncate w-full text-center ${active ? "font-semibold" : "font-medium"}`}>{m.short}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
