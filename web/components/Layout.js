import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { changePassword } from "../src/services/api";

function AccountDropdown({ currentUser }) {
  const [open, setOpen]   = useState(false);
  const [form, setForm]   = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [status, setStatus] = useState(null); // null | "ok" | error string
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const f = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (form.newPassword.length < 6) { setStatus("Yeni şifre en az 6 karakter olmalı."); return; }
    if (form.newPassword !== form.confirm) { setStatus("Yeni şifreler eşleşmiyor."); return; }
    setSaving(true);
    try {
      await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      setStatus("ok");
      setForm({ oldPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setStatus(err.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => { setOpen(!open); setStatus(null); }}
        className="rounded-2xl border border-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Hesabım
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* User info */}
          <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3">
            <p className="font-semibold text-slate-900">{currentUser.name}</p>
            <p className="text-sm text-slate-400">{currentUser.email}</p>
          </div>

          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Şifre Değiştir
          </p>

          {status === "ok" && (
            <div className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Şifre başarıyla güncellendi.
            </div>
          )}
          {status && status !== "ok" && (
            <div className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <input
              type="password"
              placeholder="Mevcut Şifre"
              value={form.oldPassword}
              onChange={f("oldPassword")}
              className={inputCls}
              autoComplete="current-password"
              required
            />
            <input
              type="password"
              placeholder="Yeni Şifre"
              value={form.newPassword}
              onChange={f("newPassword")}
              className={inputCls}
              autoComplete="new-password"
              required
            />
            <input
              type="password"
              placeholder="Yeni Şifre Tekrar"
              value={form.confirm}
              onChange={f("confirm")}
              className={inputCls}
              autoComplete="new-password"
              required
            />
            <button
              type="submit"
              disabled={saving}
              className="mt-1 w-full rounded-xl bg-brand-700 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
            >
              {saving ? "Güncelleniyor…" : "Güncelle"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const roleLabel = {
    admin:   "Yönetici",
    teacher: "Öğretmen",
    student: "Öğrenci",
    veli:    "Veli",
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <Sidebar />
      <main className="flex-1 px-4 pb-24 pt-4 md:px-6 md:py-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 rounded-3xl bg-gradient-to-r from-brand-800 to-brand-700 px-5 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
                MEB Özel Etimesgut Rezonans Sanat ve Kişisel Gelişim Merkezi
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {currentUser?.name} &nbsp;·&nbsp; {roleLabel[currentUser?.role] ?? currentUser?.role}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentUser && <AccountDropdown currentUser={currentUser} />}
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.replace("/login");
                }}
                className="rounded-2xl border border-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Çıkış Yap
              </button>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
