import { useState } from "react";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

export default function EvaluationView() {
  const { data, createEvaluation } = useAppData();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ studentId: "", month: "", content: "" });
  const [saved, setSaved] = useState(false);

  // Resolve full user record to get studentId for veli/student roles
  const fullUser = (data.users ?? []).find((u) => u.id === currentUser?.id);

  let visibleEvaluations = data.evaluations ?? [];

  if (currentUser?.role === "veli") {
    visibleEvaluations = visibleEvaluations.filter((e) => e.studentId === fullUser?.studentId);
  } else if (currentUser?.role === "student") {
    visibleEvaluations = visibleEvaluations.filter((e) => e.studentId === fullUser?.studentId);
  } else if (currentUser?.role === "teacher") {
    // Teacher sees evaluations they wrote
    visibleEvaluations = visibleEvaluations.filter((e) => e.teacherId === currentUser.id);
  }
  // admin sees all

  const canWrite = currentUser?.role === "teacher" || currentUser?.role === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = (data.students ?? []).find((s) => s.id === Number(form.studentId));
    if (!student) return;
    await createEvaluation({
      studentId: student.id,
      studentName: student.name,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      month: form.month,
      content: form.content
    });
    setForm({ studentId: "", month: "", content: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Değerlendirmeler</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Öğretmen Aylık Değerlendirme Formları</h1>
        <p className="mt-2 text-sm text-brand-200">
          {currentUser?.role === "veli"
            ? "Çocuğunuzun öğretmeninden aldığı değerlendirmeler aşağıda listelenmiştir."
            : currentUser?.role === "student"
            ? "Size ait öğretmen değerlendirmeleri aşağıda görüntülenmektedir."
            : "Tüm aktif değerlendirme formlarını buradan yönetebilirsiniz."}
        </p>
      </div>

      {canWrite && (
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">Yeni Değerlendirme Yaz</h2>
          {saved && (
            <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              Değerlendirme kaydedildi.
            </div>
          )}
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Öğrenci</span>
                <select
                  value={form.studentId}
                  onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                  required
                >
                  <option value="">Seçiniz...</option>
                  {(data.students ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} – {s.branch}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Dönem</span>
                <input
                  type="text"
                  value={form.month}
                  onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
                  placeholder="ör. Mayıs 2026"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Pedagojik Değerlendirme</span>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={4}
                placeholder="Öğrencinin bu ay gösterdiği gelişmeleri, güçlü yönlerini ve çalışılması gereken alanları yazınız..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                required
              />
            </label>
            <button
              type="submit"
              className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Değerlendirmeyi Kaydet
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {visibleEvaluations.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
            <p className="text-slate-500">Henüz kayıtlı değerlendirme bulunmuyor.</p>
          </div>
        ) : (
          visibleEvaluations.map((ev) => (
            <div key={ev.id} className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{ev.studentName}</p>
                  <p className="text-sm text-brand-600">{ev.month} &nbsp;·&nbsp; {ev.teacherName}</p>
                </div>
                <span className="rounded-xl bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  {ev.createdAt}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{ev.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
