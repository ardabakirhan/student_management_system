import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";

const navigationItems = [
  { label: "Genel Bakış", roles: ["admin", "teacher", "student", "veli"], href: "/" },
  { label: "Öğrenciler", roles: ["admin", "teacher"], href: "/students" },
  { label: "Finans", roles: ["admin"], href: "/finance" },
  { label: "Yoklama", roles: ["admin", "teacher"], href: "/attendance" },
  { label: "Ders Programı", roles: ["admin", "teacher", "student"], href: "/schedule" },
  { label: "Değerlendirmeler", roles: ["admin", "teacher", "student", "veli"], href: "/evaluations" },
  { label: "Mesajlar", roles: ["admin", "teacher", "student", "veli"], href: "/messages" },
  { label: "Duyurular", roles: ["admin", "teacher", "student", "veli"], href: "/announcements" },
  { label: "Vitrin", roles: ["admin", "teacher", "student", "veli"], href: "/shop" },
  { label: "Deneme Dersi", roles: ["admin", "veli", "student"], href: "/demo" },
  { label: "Belgeler", roles: ["admin", "teacher", "student"], href: "/documents" },
  { label: "Kullanıcılar", roles: ["admin", "teacher"], href: "/users" }
];

export default function Sidebar() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const visibleItems = navigationItems.filter((item) => item.roles.includes(currentUser?.role));

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-20 border-t border-brand-700 bg-brand-900 px-2 py-2 shadow-[0_-8px_24px_rgba(88,28,135,0.25)] md:sticky md:top-0 md:h-screen md:w-64 md:border-r md:border-t-0 md:px-4 md:py-6 md:shadow-none">
      <div className="mb-5 hidden md:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-400">MEB Özel Etimesgut</p>
        <h1 className="mt-1 text-sm font-bold leading-snug text-white">Rezonans Sanat ve Kişisel Gelişim Merkezi</h1>
      </div>

      <nav className="flex gap-1.5 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
        {visibleItems.map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => router.push(item.href)}
            className={`shrink-0 rounded-xl px-3 py-2.5 text-xs font-medium transition md:w-full md:rounded-2xl md:px-3 md:py-2.5 md:text-left md:text-sm ${
              router.pathname === item.href
                ? "bg-gold-500 text-brand-900 font-semibold"
                : "text-brand-200 hover:bg-brand-700 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}