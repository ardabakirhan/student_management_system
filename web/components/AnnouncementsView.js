import { useState } from "react";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

export default function AnnouncementsView() {
  const { data, createAnnouncement } = useAppData();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ title: "", body: "" });
  const [saved, setSaved] = useState(false);

  const announcements = [...(data.announcements ?? [])].reverse();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAnnouncement({ title: form.title, body: form.body });
    setForm({ title: "", body: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Duyurular</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Özel Etkinlik & Duyuru Panosu</h1>
        <p className="mt-2 text-sm text-brand-200">
          Kurumumuza ait atölye, konser ve özel etkinlik duyurularını buradan takip edebilirsiniz.
        </p>
      </div>

      {currentUser?.role === "admin" && (
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-slate-900">Yeni Duyuru Ekle</h2>
          {saved && (
            <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              Duyuru yayımlandı.
            </div>
          )}
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Başlık</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Duyuru başlığı"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">İçerik</span>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={3}
                placeholder="Duyuru detayları..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                required
              />
            </label>
            <button
              type="submit"
              className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Yayımla
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {announcements.length === 0 ? (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-soft">
            <p className="text-slate-500">Henüz duyuru bulunmuyor.</p>
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="flex flex-col rounded-3xl bg-white p-5 shadow-soft">
              <div className="mb-3 h-28 rounded-2xl bg-gradient-to-br from-brand-100 to-gold-100 flex items-center justify-center">
                <span className="text-4xl">📢</span>
              </div>
              <span className="text-xs font-medium text-slate-400">{a.date}</span>
              <h3 className="mt-1 text-base font-semibold text-slate-900">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{a.body}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
