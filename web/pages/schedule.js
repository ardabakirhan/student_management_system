import { useState } from "react";
import Layout from "../components/Layout";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const emptyForm = { day: 'Pazartesi', time: '', lesson: '', teacher: '', room: '' };

export default function SchedulePage() {
  const { data, addScheduleEntry, deleteScheduleEntry } = useAppData();
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState('');

  const role = currentUser?.role;
  const schedule = data.weeklySchedule ?? [];

  let visibleSchedule = schedule;
  if (role === 'teacher') {
    visibleSchedule = schedule.filter((s) => s.teacher === currentUser?.name);
  } else if (role === 'student' || role === 'veli') {
    const student = (data.students ?? []).find((s) => s.id === currentUser?.student_id);
    if (student?.branch) {
      visibleSchedule = schedule.filter((s) =>
        s.lesson?.toLowerCase().includes(student.branch.toLowerCase())
      );
    }
  }

  const canEdit = role === 'admin' || role === 'teacher';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpen = () => {
    const initial = { ...emptyForm };
    if (role === 'teacher') initial.teacher = currentUser?.name ?? '';
    setForm(initial);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addScheduleEntry(form);
      setShowForm(false);
      setForm(emptyForm);
      showToast('Ders eklendi.');
    } catch (err) {
      showToast(err.message || 'Hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteScheduleEntry(id);
      showToast('Ders silindi.');
    } catch (err) {
      showToast(err.message || 'Hata oluştu.');
    }
  };

  const canDelete = (entry) => {
    if (role === 'admin') return true;
    if (role === 'teacher') return entry.teacher === currentUser?.name;
    return false;
  };

  return (
    <Layout>
      <section className="space-y-4">
        {toast && (
          <div className="fixed right-4 top-4 z-50 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
            {toast}
          </div>
        )}

        <div className="rounded-3xl bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-brand-600">
            {role === 'teacher' ? 'Derslerim' : 'Ders Programı'}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Haftalık Ders Planı</h1>
          {canEdit && (
            <button
              type="button"
              onClick={handleOpen}
              className="mt-4 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {role === 'teacher' ? '+ Dersimi Ekle' : '+ Ders Ekle'}
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-3xl bg-white p-5 shadow-soft md:grid-cols-2"
          >
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Gün</span>
              <select
                name="day"
                value={form.day}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400"
              >
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Saat</span>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Ders / Branch</span>
              <input
                type="text"
                name="lesson"
                value={form.lesson}
                onChange={handleChange}
                required
                placeholder="Piyano – Bireysel"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Öğretmen</span>
              <input
                type="text"
                name="teacher"
                value={form.teacher}
                onChange={handleChange}
                readOnly={role === 'teacher'}
                className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400${role === 'teacher' ? ' cursor-not-allowed opacity-60' : ''}`}
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Derslik / Oda</span>
              <input
                type="text"
                name="room"
                value={form.room}
                onChange={handleChange}
                placeholder="Müzik Odası 1"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400"
              />
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                İptal
              </button>
            </div>
          </form>
        )}

        <div className="rounded-3xl bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">
            {role === 'admin' ? 'Tüm Dersler' : role === 'teacher' ? 'Derslerim' : 'Ders Takvimi'}
          </h2>

          {visibleSchedule.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Henüz kayıt yok.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {visibleSchedule.map((item) => (
                <div
                  key={item.id ?? `${item.day}-${item.time}`}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.day}
                      <span className="ml-2 text-brand-600">{item.time}</span>
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.lesson}
                      {item.teacher ? ` · ${item.teacher}` : ''}
                      {item.room ? ` · ${item.room}` : ''}
                    </p>
                  </div>
                  {canDelete(item) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="ml-4 shrink-0 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
                    >
                      Sil
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
