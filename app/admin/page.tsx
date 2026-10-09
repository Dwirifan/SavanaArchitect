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
  const [auth, setAuth] = useState(false);
  const [msg, setMsg] = useState("");
  const { theme } = useTheme();

  useEffect(() => { loadCMS().then(setCms); }, []);
  if (!cms) return null;

  const persist = async (next: CMS) => { 
    setCms(next); 
    await saveCMS(next); 
    setMsg("Tersimpan ✓"); 
    setTimeout(() => setMsg(""), 1500); 
  };

  if (!auth) {
    return <LoginForm onLogin={() => setAuth(true)} />;
  }

  const activeMenu = MENUS.find(m => m.id === tab);

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-[var(--line)] bg-[var(--card)] flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-[var(--line)]">
          <img
            src={theme === "dark" ? "/savanaarsitekwhite.png" : "/savanaarsitekblack.png"}
            alt="SAVANA Architecture"
            className="h-8 w-auto object-contain"
          />
          <p className="text-[10px] tracking-widest uppercase opacity-40 mt-1.5">Digital Studio</p>
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
            onClick={() => setAuth(false)} 
            className="w-full flex justify-center items-center gap-2 text-xs px-4 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 opacity-50" />
            Logout Keluar
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 border-b border-[var(--line)] bg-[var(--bg)]/80 backdrop-blur-md px-6 md:px-10 flex flex-col justify-center shrink-0 sticky top-0 z-40">
          <h2 className="text-2xl font-serif">{activeMenu?.label}</h2>
          <p className="text-sm opacity-60 mt-0.5">{activeMenu?.desc}</p>
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
