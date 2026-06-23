import Link from "next/link";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

export default function DashboardSummary() {
  const { data } = useAppData();
  const { currentUser } = useAuth();

  const pendingInvoices = (data.paymentHistory ?? []).filter((p) => p.status !== "Ödendi").length;
  const presentToday = (data.attendanceRecords ?? []).filter((r) => r.status === "Derse Geldi").length;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">MEB Özel Etimesgut</p>
        <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">Rezonans Sanat ve Kişisel Gelişim Merkezi</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-200">
          Hoş geldiniz, {currentUser?.name}. Ayrıntılar için sol menüden ilgili modüle geçebilirsiniz.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Toplam Öğrenci" value={(data.students ?? []).length} tone="brand" />
        <StatCard label="Derse Gelen" value={presentToday} tone="emerald" />
        <StatCard label="Bekleyen Aidat" value={pendingInvoices} tone="gold" />
        <StatCard label="Toplam Öğretmen" value={(data.teachers ?? []).length} tone="slate" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">Hızlı Geçiş</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <QuickLink href="/evaluations" label="Değerlendirmeler" description="Öğretmen aylık değerlendirme formları" />
            <QuickLink href="/messages" label="Mesajlar" description="Veli-öğretmen mesajlaşma portali" />
            <QuickLink href="/announcements" label="Duyurular" description="Etkinlik ve duyuru panosu" />
            <QuickLink href="/shop" label="Vitrin" description="Müzik aleti ve aksesuar tanıtımı" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">Branşlar</h2>
          <div className="mt-4 space-y-3">
            <SummaryRow label="Müzik branşları" value={`${data.branches?.müzik?.length ?? 4} branş`} />
            <SummaryRow label="Resim branşları" value={`${data.branches?.resim?.length ?? 4} branş`} />
            <SummaryRow label="Modern Dans" value={`${data.branches?.dans?.length ?? 3} branş`} />
            <SummaryRow label="Akıl Oyunları" value={`${data.branches?.akiloyunlari?.length ?? 3} branş`} />
          </div>
        </div>
      </section>
    </section>
  );
}

function StatCard({ label, value, tone }) {
  const toneClasses = {
    brand: "bg-brand-700 text-white",
    emerald: "bg-emerald-600 text-white",
    gold: "bg-gold-500 text-brand-900",
    slate: "bg-slate-900 text-white"
  };

  return (
    <div className={`rounded-3xl p-5 shadow-soft ${toneClasses[tone]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-3 text-4xl font-semibold">{value}</p>
    </div>
  );
}

function QuickLink({ href, label, description }) {
  return (
    <Link href={href} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-300 hover:bg-brand-50/60">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </Link>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-brand-700">{value}</span>
    </div>
  );
}