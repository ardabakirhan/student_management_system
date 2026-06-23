import { useState } from "react";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

export default function FinanceView() {
  const { data, markPaymentPaid, createInvoice } = useAppData();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const payments = data.paymentHistory ?? [];
  const pending  = payments.filter((p) => p.status === "Bekliyor");
  const paid     = payments.filter((p) => p.status === "Ödendi");

  const [busy, setBusy]           = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ studentId: "", amount: "", dueDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleMarkPaid = async (id) => {
    setBusy(id);
    try { await markPaymentPaid(id); } finally { setBusy(null); }
  };

  const f = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    setFormError("");

    const students = data.students ?? [];
    const student  = students.find((s) => s.id === parseInt(form.studentId, 10));
    if (!student) { setFormError("Öğrenci seçin."); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { setFormError("Geçerli bir tutar girin."); return; }

    // Convert HTML date input YYYY-MM-DD → DD.MM.YYYY
    let dueDate = form.dueDate;
    if (dueDate && dueDate.includes("-")) {
      const [y, m, d] = dueDate.split("-");
      dueDate = `${d}.${m}.${y}`;
    }

    setSubmitting(true);
    try {
      await createInvoice({
        studentId:   student.id,
        studentName: student.name,
        amount:      parseFloat(form.amount),
        dueDate:     dueDate || undefined,
      });
      setForm({ studentId: "", amount: "", dueDate: "" });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-400";

  return (
    <section className="space-y-6">

      {/* ── Header ── */}
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm font-medium text-brand-600">Finans Takibi</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Aidat ve Ödeme Geçmişi</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Aylık aidat takibi ve ödeme durumları.
        </p>
        {isAdmin && (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => { setShowForm(!showForm); setFormError(""); }}
              className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {showForm ? "İptal" : "+ Manuel Aidat Ekle"}
            </button>
          </div>
        )}
      </div>

      {/* ── Add invoice form (admin only) ── */}
      {showForm && isAdmin && (
        <form onSubmit={handleAddInvoice} className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Manuel Aidat Kaydı</h2>

          {formError && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {formError}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Öğrenci *</span>
              <select value={form.studentId} onChange={f("studentId")} className={inputCls} required>
                <option value="">Öğrenci seç…</option>
                {(data.students ?? [])
                  .filter((s) => s.status === "Aktif")
                  .map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Tutar (₺) *</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={form.amount}
                onChange={f("amount")}
                className={inputCls}
                placeholder="0.00"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Son Ödeme Tarihi</span>
              <input
                type="date"
                value={form.dueDate}
                onChange={f("dueDate")}
                className={inputCls}
              />
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {/* ── Stats ── */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Toplam Kayıt" value={payments.length} />
        <MetricCard label="Ödendi" value={paid.length} color="emerald" />
        <MetricCard label="Bekliyor" value={pending.length} color="amber" />
      </div>

      {/* ── Pending + History ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Pending */}
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">
            Bekleyen Aidatlar
            {pending.length > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-700">
                {pending.length}
              </span>
            )}
          </h2>
          <div className="mt-4 space-y-3">
            {pending.length === 0 && (
              <p className="text-sm text-slate-400">Bekleyen aidat yok.</p>
            )}
            {pending.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{p.studentName}</p>
                  <p className="text-xs text-slate-500">Son tarih: {p.date}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="font-bold text-slate-900">
                    {Number(p.amount).toLocaleString("tr-TR")} ₺
                  </p>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleMarkPaid(p.id)}
                      disabled={busy === p.id}
                      className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {busy === p.id ? "…" : "Ödendi"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">Ödeme Geçmişi</h2>
          <div className="mt-4 space-y-3">
            {paid.length === 0 && (
              <p className="text-sm text-slate-400">Henüz tamamlanan ödeme yok.</p>
            )}
            {paid.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{p.studentName}</p>
                  <p className="text-xs text-slate-500">{p.date}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="font-semibold text-slate-900">
                    {Number(p.amount).toLocaleString("tr-TR")} ₺
                  </p>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Ödendi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function MetricCard({ label, value, color }) {
  const valueColor =
    color === "emerald" ? "text-emerald-600"
    : color === "amber" ? "text-amber-600"
    : "text-slate-900";

  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-3 text-4xl font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}
