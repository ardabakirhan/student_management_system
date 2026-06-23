import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import * as api from "../src/services/api";

const roleHome = { admin: "/", teacher: "/", student: "/", veli: "/evaluations" };

export default function ChangePasswordPage() {
  const router = useRouter();
  const { currentUser, logout, updateUser } = useAuth();

  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const f = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (form.newPassword !== form.confirm) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      await api.changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      // Clear the flag in React state so AppGate doesn't redirect back here
      updateUser({ must_change_password: false });
      router.replace(roleHome[currentUser?.role] ?? "/");
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-brand-300";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#6b21a8_0,_#1e1035_38%,_#0a0118_100%)] flex items-center justify-center px-4 py-8 text-white">
      <div className="w-full max-w-md">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Hesap Güvenliği</p>
          <h1 className="mt-2 text-2xl font-bold text-white">Şifrenizi Değiştirin</h1>
          <p className="mt-2 text-sm text-slate-400">
            Hesabınız için ilk kez giriş yaptınız. Güvenliğiniz için lütfen geçici şifrenizi değiştirin.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Mevcut Şifre (Geçici)</span>
              <input
                type="password"
                value={form.oldPassword}
                onChange={f("oldPassword")}
                className={inputCls}
                placeholder="Size verilen geçici şifre"
                autoComplete="current-password"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Yeni Şifre</span>
              <input
                type="password"
                value={form.newPassword}
                onChange={f("newPassword")}
                className={inputCls}
                placeholder="En az 6 karakter"
                autoComplete="new-password"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Yeni Şifre (Tekrar)</span>
              <input
                type="password"
                value={form.confirm}
                onChange={f("confirm")}
                className={inputCls}
                placeholder="Yeni şifreyi tekrar girin"
                autoComplete="new-password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 mt-2"
            >
              {loading ? "Kaydediliyor…" : "Şifreyi Değiştir ve Giriş Yap"}
            </button>
          </form>

          <button
            type="button"
            onClick={async () => { await logout(); router.replace("/login"); }}
            className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-400"
          >
            Çıkış yap
          </button>
        </div>
      </div>
    </div>
  );
}
