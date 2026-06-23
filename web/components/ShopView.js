import { useState } from "react";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

const CATEGORY_ICONS = {
  "Müzik Aletleri": "🎹",
  "Yedek Parça": "🔧",
  "Aksesuar": "🪑"
};

export default function ShopView() {
  const { data, sendMessage } = useAppData();
  const { currentUser } = useAuth();
  const [activeProduct, setActiveProduct] = useState(null);
  const [inquiryNote, setInquiryNote] = useState("");
  const [sent, setSent] = useState(false);

  const products = data.products ?? [];

  const grouped = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const handleInquiry = async (e) => {
    e.preventDefault();
    await sendMessage({
      fromId: currentUser?.id ?? 0,
      fromName: currentUser?.name ?? "Misafir",
      fromRole: currentUser?.role ?? "veli",
      toId: null,
      toName: "Yönetim",
      channel: "admin",
      subject: `Ürün Bilgi Talebi: ${activeProduct?.name}`,
      body: inquiryNote || `${activeProduct?.name} hakkında bilgi almak istiyorum.`
    });
    setInquiryNote("");
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setActiveProduct(null);
    }, 2500);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Ürün Tanıtım Vitrini</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Müzik Aletleri & Aksesuarlar</h1>
        <p className="mt-2 text-sm text-brand-200">
          Kurum tarafından önerilen ürünler. Fiyat bilgisi ve satın alma için &ldquo;Bilgi Al&rdquo; butonunu kullanın.
        </p>
      </div>

      {/* Inquiry modal */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">{activeProduct.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{activeProduct.description}</p>
            {sent ? (
              <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                Mesajınız yönetime iletildi.
              </div>
            ) : (
              <form className="mt-4 space-y-3" onSubmit={handleInquiry}>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Notunuz (isteğe bağlı)</span>
                  <textarea
                    value={inquiryNote}
                    onChange={(e) => setInquiryNote(e.target.value)}
                    rows={2}
                    placeholder="Ek sorunuz veya notunuz..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                  />
                </label>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Mesaj Gönder
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProduct(null)}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    İptal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xl">{CATEGORY_ICONS[category] ?? "📦"}</span>
            <h2 className="text-base font-semibold text-slate-800">{category}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <div key={product.id} className="flex flex-col rounded-3xl bg-white p-5 shadow-soft">
                <div className="mb-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-gold-50">
                  <span className="text-5xl">{CATEGORY_ICONS[product.category] ?? "📦"}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-1 flex-1 text-sm leading-6 text-slate-500">{product.description}</p>
                <button
                  type="button"
                  onClick={() => setActiveProduct(product)}
                  className="mt-4 w-full rounded-2xl bg-gold-500 py-3 text-sm font-bold text-brand-900 transition hover:bg-gold-400"
                >
                  Bilgi Al & Mesaj Gönder
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
