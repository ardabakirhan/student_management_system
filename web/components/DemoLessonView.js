import { useState } from "react";
import { useAppData } from "../hooks/useAppData";

const ALL_BRANCHES = [
  "Piyano", "Keman", "Gitar", "Yan Flüt",
  "Sulu Boya", "Akrilik", "Kara Kalem", "Seramik",
  "Klasik Bale", "Modern Dans", "Dünya Dansları",
  "Satranç", "Mental Aritmetik", "Akıl Oyunları"
];

const TIME_SLOTS = [
  "Hafta içi sabah (09:00–12:00)",
  "Hafta içi öğleden sonra (13:00–17:00)",
  "Hafta içi akşam (17:00–20:00)",
  "Hafta sonu sabah (10:00–13:00)",
  "Hafta sonu öğleden sonra (13:00–17:00)"
];

export default function DemoLessonView() {
  const { createDemoRequest } = useAppData();
  const [form, setForm] = useState({ name: "", phone: "", email: "", branch: "", preferredTime: "", note: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createDemoRequest(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 p-8 text-center shadow-soft">
          <p className="text-4xl">🎵</p>
          <h1 className="mt-4 text-2xl font-bold text-white">Talebiniz Alındı!</h1>
          <p className="mt-3 text-brand-200">
            Ücretsiz deneme dersi talebiniz kaydedildi. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
          </p>
          <button
            type="button"
            onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", branch: "", preferredTime: "", note: "" }); }}
            className="mt-6 rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Yeni Talep Oluştur
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Ücretsiz Deneme Dersi</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Online Deneme Dersi Talebi</h1>
        <p className="mt-2 text-sm text-brand-200">
          MEB Özel Etimesgut Rezonans Sanat ve Kişisel Gelişim Merkezi'nde ilgilendiğiniz branşta ücretsiz bir deneme dersine katılmak için formu doldurun.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Ad Soyad</span>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Adınız ve soyadınız"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Telefon</span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="05XX XXX XX XX"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">E-posta</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ornek@email.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">İlgilenilen Branş</span>
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                required
              >
                <option value="">Branş seçiniz...</option>
                {ALL_BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Tercih Edilen Zaman</span>
              <select
                name="preferredTime"
                value={form.preferredTime}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                required
              >
                <option value="">Zaman dilimi seçiniz...</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Ek Not (isteğe bağlı)</span>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              placeholder="Öğrencinin yaşı, deneyimi veya özel isteğiniz..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gold-500 px-6 py-4 text-base font-bold text-brand-900 transition hover:bg-gold-400 sm:w-auto"
          >
            Ücretsiz Deneme Dersi Talep Et
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-brand-100 bg-brand-50 p-5">
        <p className="text-sm font-semibold text-brand-800">Neden Rezonans?</p>
        <ul className="mt-3 space-y-2 text-sm text-brand-700">
          <li>• MEB onaylı, uzman öğretmen kadrosu</li>
          <li>• Müzik, resim, dans ve akıl oyunları – tek çatı altında</li>
          <li>• Grup ve bireysel ders seçenekleri</li>
          <li>• İlk ders tamamen ücretsiz</li>
        </ul>
      </div>
    </section>
  );
}
