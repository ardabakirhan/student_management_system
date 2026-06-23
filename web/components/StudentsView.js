import { useState } from "react";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

const BRANCHES = {
  'Müzik':         ['Piyano', 'Keman', 'Gitar', 'Yan Flüt'],
  'Resim':         ['Sulu Boya', 'Akrilik', 'Karakalem', 'Röprodüksiyon'],
  'Dans':          ['Klasik Bale', 'Modern Dans', 'Dünya Dansları'],
  'Akıl Oyunları': ['Satranç', 'Mental Aritmetik', 'Küre', 'Equilibrio'],
};

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const inputCls =
  'w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white';

function toForm(s) {
  return {
    name:           s.name           ?? '',
    birthDate:      s.birth_date     ?? '',
    phone:          s.phone          ?? '',
    parentName:     s.parent_name    ?? '',
    parentPhone:    s.parent_phone   ?? '',
    branch:         s.branch         ?? '',
    lessonDay:      s.lesson_day     ?? '',
    lessonTime:     s.lesson_time    ?? '',
    startDate:      s.start_date     ?? '',
    status:         s.status         ?? 'Aktif',
    monthlyFee:     s.monthly_fee    ?? '',
    paymentDay:     s.payment_day    ?? '',
    durationMonths: s.duration_months ?? '',
  };
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const cls =
    status === 'Aktif'       ? 'bg-emerald-100 text-emerald-700' :
    status === 'Donduruldu'  ? 'bg-blue-100 text-blue-700'       :
                               'bg-slate-200 text-slate-600';
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${cls}`}>
      {status}
    </span>
  );
}

function BranchSelect({ value, onChange, required }) {
  return (
    <select value={value} onChange={onChange} required={required} className={inputCls}>
      <option value="">Seçiniz</option>
      {Object.entries(BRANCHES).map(([group, items]) => (
        <optgroup key={group} label={group}>
          {items.map((b) => <option key={b} value={b}>{b}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function EditModal({ student, onClose, onSave }) {
  const [form, setForm] = useState(() => toForm(student));
  const [saving, setSaving] = useState(false);

  const f = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(student.id, form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between rounded-t-3xl border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Öğrenci Düzenle</p>
            <h2 className="mt-0.5 text-lg font-semibold text-slate-900">{student.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          {/* Temel Bilgiler */}
          <section>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-600">
              Temel Bilgiler
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ad Soyad *">
                <input required value={form.name} onChange={f('name')} className={inputCls} />
              </Field>
              <Field label="Doğum Tarihi">
                <input type="date" value={form.birthDate} onChange={f('birthDate')} className={inputCls} />
              </Field>
              <Field label="Telefon">
                <input type="tel" value={form.phone} onChange={f('phone')} className={inputCls} placeholder="0555 000 00 00" />
              </Field>
              <Field label="Veli Adı">
                <input value={form.parentName} onChange={f('parentName')} className={inputCls} />
              </Field>
              <Field label="Veli Telefonu">
                <input type="tel" value={form.parentPhone} onChange={f('parentPhone')} className={inputCls} placeholder="0555 000 00 00" />
              </Field>
            </div>
          </section>

          {/* Kurs Bilgileri */}
          <section>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-600">
              Kurs Bilgileri
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Branş / Ders *">
                <BranchSelect required value={form.branch} onChange={f('branch')} />
              </Field>
              <Field label="Ders Günü">
                <select value={form.lessonDay} onChange={f('lessonDay')} className={inputCls}>
                  <option value="">Seçiniz</option>
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Ders Saati">
                <input type="time" value={form.lessonTime} onChange={f('lessonTime')} className={inputCls} />
              </Field>
              <Field label="Başlangıç Tarihi">
                <input type="date" value={form.startDate} onChange={f('startDate')} className={inputCls} />
              </Field>
              <Field label="Durum">
                <select value={form.status} onChange={f('status')} className={inputCls}>
                  <option>Aktif</option>
                  <option>Pasif</option>
                  <option>Donduruldu</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Ödeme Bilgileri */}
          <section>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-600">
              Ödeme Bilgileri
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Aylık Ücret (₺)">
                <input
                  type="number" min="0" step="0.01"
                  value={form.monthlyFee} onChange={f('monthlyFee')}
                  className={inputCls} placeholder="0.00"
                />
              </Field>
              <Field label="Ödeme Günü (1–31)">
                <input
                  type="number" min="1" max="31"
                  value={form.paymentDay} onChange={f('paymentDay')}
                  className={inputCls} placeholder="1"
                />
              </Field>
              <Field label="Kurs Süresi (Ay)">
                <input
                  type="number" min="1"
                  value={form.durationMonths} onChange={f('durationMonths')}
                  className={inputCls} placeholder="12"
                />
              </Field>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3 border-t border-slate-100 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-brand-700 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentsView() {
  const { data, createStudent, updateStudent, deleteStudent } = useAppData();
  const { currentUser } = useAuth();
  const role     = currentUser?.role;
  const isAdmin  = role === 'admin';
  const canManage = role === 'admin' || role === 'teacher';

  const [showAddForm,  setShowAddForm]  = useState(false);
  const [addForm,      setAddForm]      = useState({ name: '', branch: '', status: 'Aktif' });
  const [addSaving,    setAddSaving]    = useState(false);
  const [editStudent,  setEditStudent]  = useState(null);

  const students   = data.students ?? [];
  const activeCount = students.filter((s) => s.status === 'Aktif').length;

  const heading  = canManage ? 'Öğrenci Listesi' : 'Öğrencim';
  const subtitle = canManage
    ? 'Kayıtlı öğrencilerin branş ve durum bilgisini buradan takip edebilirsiniz.'
    : 'Kayıtlı olduğunuz branş ve durum bilgisi aşağıda görüntülenmektedir.';

  const af = (field) => (e) => setAddForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.branch.trim()) return;
    setAddSaving(true);
    try {
      await createStudent(addForm);
      setAddForm({ name: '', branch: '', status: 'Aktif' });
      setShowAddForm(false);
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <>
      {editStudent && (
        <EditModal
          student={editStudent}
          onClose={() => setEditStudent(null)}
          onSave={updateStudent}
        />
      )}

      <section className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 rounded-3xl bg-white p-6 shadow-soft">
          <div>
            <p className="text-sm font-medium text-brand-600">Öğrenci Paneli</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{heading}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm((s) => !s)}
              className="shrink-0 rounded-2xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
            >
              {showAddForm ? 'İptal' : '+ Yeni Öğrenci Ekle'}
            </button>
          )}
        </div>

        {/* Add student form */}
        {showAddForm && isAdmin && (
          <form onSubmit={handleAdd} className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">Yeni Öğrenci</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ad Soyad *">
                <input required value={addForm.name} onChange={af('name')} className={inputCls} placeholder="Öğrenci adı" />
              </Field>
              <Field label="Branş *">
                <BranchSelect required value={addForm.branch} onChange={af('branch')} />
              </Field>
              <Field label="Durum">
                <select value={addForm.status} onChange={af('status')} className={inputCls}>
                  <option>Aktif</option>
                  <option>Pasif</option>
                  <option>Donduruldu</option>
                </select>
              </Field>
            </div>
            <button
              type="submit"
              disabled={addSaving}
              className="rounded-2xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
            >
              {addSaving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
          </form>
        )}

        {/* Summary */}
        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Toplam Öğrenci"    value={students.length} />
          <SummaryCard label="Aktif"              value={activeCount} />
          <SummaryCard label="Pasif / Donduruldu" value={students.length - activeCount} />
        </section>

        {/* Student list */}
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="grid gap-3">
            {students.length === 0 ? (
              <p className="text-sm text-slate-500">Henüz kayıt yok.</p>
            ) : (
              students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{student.name}</p>
                    <p className="text-sm text-slate-500">
                      {student.branch}
                      {student.lesson_day  ? ` · ${student.lesson_day}`  : ''}
                      {student.lesson_time ? ` ${student.lesson_time}`   : ''}
                    </p>
                    {student.parent_name && (
                      <p className="text-xs text-slate-400">
                        Veli: {student.parent_name}
                        {student.parent_phone ? ` · ${student.parent_phone}` : ''}
                      </p>
                    )}
                    {student.monthly_fee && (
                      <p className="text-xs text-slate-400">
                        Aidat: {Number(student.monthly_fee).toLocaleString('tr-TR')} ₺
                        {student.payment_day ? ` · ${student.payment_day}. gün` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={student.status} />
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => setEditStudent(student)}
                          className="rounded-xl bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="rounded-xl bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          Sil
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
