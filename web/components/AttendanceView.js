import { useState } from "react";
import { useAppData } from "../hooks/useAppData";

export default function AttendanceView() {
  const { data, markAttendancePresent } = useAppData();
  const [busyId, setBusyId] = useState(null);

  const presentCount = (data.attendanceRecords ?? []).filter((record) => record.status === "Derse Geldi").length;

  const handlePresent = async (attendanceId) => {
    setBusyId(attendanceId);
    await markAttendancePresent(attendanceId);
    setBusyId(null);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm font-medium text-brand-600">Yoklama</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Bugünkü Yoklama</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Derse gelen öğrencileri işaretleyebilir ve günlük yoklama özetini izleyebilirsiniz.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Toplam Kayıt" value={(data.attendanceRecords ?? []).length} />
        <MetricCard label="Derse Gelen" value={presentCount} />
        <MetricCard label="Derse Gelmeyen" value={(data.attendanceRecords ?? []).length - presentCount} />
      </section>

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="grid gap-3">
          {(data.attendanceRecords ?? []).map((record) => (
            <div key={record.id} className="rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{record.studentName}</p>
                  <p className="text-sm text-slate-500">{record.lesson} • {record.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={record.status === "Derse Geldi" ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700" : "rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700"}>
                    {record.status}
                  </span>
                  {record.status !== "Derse Geldi" ? (
                    <button
                      type="button"
                      onClick={() => handlePresent(record.id)}
                      disabled={busyId === record.id}
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyId === record.id ? "Kaydediliyor..." : "Derse Geldi"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}