"use client";
import { type CMS } from "@/lib/cms";
import { 
  UsersIcon, 
  BriefcaseIcon, 
  DocumentTextIcon, 
  ShoppingBagIcon,
  ArrowTrendingUpIcon 
} from "@heroicons/react/24/outline";

export function DashboardTab({ cms }: { cms: CMS; onSave: (c: CMS) => void }) {
  const stats = [
    { name: "Total Projects", stat: cms.projects.length, icon: BriefcaseIcon },
    { name: "Total Products", stat: cms.products.length, icon: ShoppingBagIcon },
    { name: "Total Journals", stat: cms.journal.length, icon: DocumentTextIcon },
    { name: "Monthly Visitors", stat: "12,450", icon: UsersIcon, trend: "+12%" },
  ];

  // Dummy data for chart
  const visitorsData = [
    { day: "Mon", count: 420 },
    { day: "Tue", count: 580 },
    { day: "Wed", count: 490 },
    { day: "Thu", count: 620 },
    { day: "Fri", count: 850 },
    { day: "Sat", count: 1100 },
    { day: "Sun", count: 950 },
  ];
  const maxVisitors = Math.max(...visitorsData.map(d => d.count));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div key={item.name} className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-[var(--ink)]/5 text-[var(--ink)]">
                  <item.icon className="w-6 h-6 opacity-70" />
                </div>
                {item.trend && (
                  <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-full">
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                    {item.trend}
                  </span>
                )}
              </div>
              <p className="text-sm opacity-60">{item.name}</p>
              <p className="text-3xl font-serif mt-1">{item.stat}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[var(--line)] bg-[var(--card)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-medium">Statistik Pengunjung (7 Hari Terakhir)</h3>
            <span className="text-xs opacity-50 px-2 py-1 border border-[var(--line)] rounded-md">Simulasi</span>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 mt-8">
            {visitorsData.map((day) => {
              const height = (day.count / maxVisitors) * 100;
              return (
                <div key={day.day} className="flex-1 flex flex-col justify-end items-center group">
                  <div className="w-full flex justify-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-medium bg-[var(--ink)] text-[var(--bg)] px-2 py-1 rounded-md">
                      {day.count}
                    </span>
                  </div>
                  <div 
                    className="w-full max-w-[40px] bg-[var(--ink)]/10 group-hover:bg-[var(--ink)]/20 transition-colors rounded-t-sm"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs opacity-50 mt-4">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--card)]">
          <h3 className="text-base font-medium mb-6">Aktivitas Terbaru</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-[var(--ink)] opacity-30" />
              <div>
                <p className="text-sm font-medium">Sistem diperbarui</p>
                <p className="text-xs opacity-60 mt-1">CMS Dashboard berjalan normal.</p>
                <p className="text-[10px] opacity-40 mt-1">Hari ini, 08:00</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-[var(--ink)] opacity-30" />
              <div>
                <p className="text-sm font-medium">{cms.projects[0]?.title || 'Proyek'} diperbarui</p>
                <p className="text-xs opacity-60 mt-1">Data portofolio telah diubah.</p>
                <p className="text-[10px] opacity-40 mt-1">Kemarin</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-[var(--ink)] opacity-30" />
              <div>
                <p className="text-sm font-medium">Katalog produk disinkronisasi</p>
                <p className="text-xs opacity-60 mt-1">{cms.products.length} produk aktif saat ini.</p>
                <p className="text-[10px] opacity-40 mt-1">2 hari yang lalu</p>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-8 text-xs py-2 border border-[var(--line)] rounded-xl hover:bg-[var(--bg)] transition-colors">
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>
    </div>
  );
}
