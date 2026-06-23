import { useState } from "react";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";

const CHANNELS = [
  { key: "direct", label: "Öğretmen Mesajları" },
  { key: "admin", label: "Yönetim & Öneri" },
  { key: "technical", label: "Teknik Destek" }
];

export default function MessagesView() {
  const { data, sendMessage, markMessageRead } = useAppData();
  const { currentUser } = useAuth();
  const [activeChannel, setActiveChannel] = useState("direct");
  const [form, setForm] = useState({ toId: "", toName: "Yönetim", subject: "", body: "" });
  const [sent, setSent] = useState(false);

  const messages = data.messages ?? [];

  // Filter by channel and role privacy
  const channelMessages = messages.filter((m) => {
    if (m.channel !== activeChannel) return false;
    if (currentUser?.role === "admin") return true;
    if (currentUser?.role === "teacher") {
      return m.toId === currentUser.id || m.fromId === currentUser.id || m.channel !== "direct";
    }
    // veli or student: only see their own threads
    return m.fromId === currentUser?.id || m.toId === currentUser?.id;
  });

  const teachers = data.teachers ?? [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    let toId = null;
    let toName = "Yönetim";
    if (activeChannel === "direct") {
      const teacher = teachers.find((t) => String(t.id) === String(form.toId));
      if (!teacher) return;
      toId = teacher.id;
      toName = teacher.name;
    } else if (activeChannel === "technical") {
      toName = "Teknik Destek";
    }
    await sendMessage({
      fromId: currentUser.id,
      fromName: currentUser.name,
      fromRole: currentUser.role,
      toId,
      toName,
      channel: activeChannel,
      subject: form.subject,
      body: form.body
    });
    setForm({ toId: "", toName: "Yönetim", subject: "", body: "" });
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const handleRead = async (msg) => {
    if (!msg.read && msg.toId === currentUser?.id) {
      await markMessageRead(msg.id);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-700 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Mesajlaşma Portalı</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Veli – Öğretmen Mesajlaşma & Dilek/Şikayet</h1>
        <p className="mt-2 text-sm text-brand-200">
          Öğretmenlerinize doğrudan mesaj gönderin veya yönetime öneri ve teknik destek taleplerini iletin.
        </p>
      </div>

      {/* Channel tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {CHANNELS.map((ch) => (
          <button
            key={ch.key}
            type="button"
            onClick={() => setActiveChannel(ch.key)}
            className={`shrink-0 rounded-2xl px-5 py-2.5 text-sm font-medium transition ${
              activeChannel === ch.key
                ? "bg-brand-700 text-white shadow-soft"
                : "bg-white text-slate-600 hover:bg-brand-50 hover:text-brand-700 shadow-soft"
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      {/* New message form */}
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="text-base font-semibold text-slate-900">Yeni Mesaj Gönder</h2>
        {sent && (
          <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Mesajınız iletildi.
          </div>
        )}
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          {activeChannel === "direct" && (
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Öğretmen</span>
              <select
                value={form.toId}
                onChange={(e) => setForm((f) => ({ ...f, toId: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
                required
              >
                <option value="">Seçiniz...</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} – {t.branch}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Konu</span>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Mesaj konusu"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Mesaj</span>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={3}
              placeholder="Mesajınızı yazınız..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
              required
            />
          </label>
          <button
            type="submit"
            className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Gönder
          </button>
        </form>
      </div>

      {/* Message list */}
      <div className="space-y-3">
        {channelMessages.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
            <p className="text-slate-500">Bu kanalda henüz mesaj bulunmuyor.</p>
          </div>
        ) : (
          channelMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleRead(msg)}
              className={`cursor-default rounded-3xl bg-white p-5 shadow-soft transition ${
                !msg.read && msg.toId === currentUser?.id ? "border-l-4 border-brand-500" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{msg.subject}</p>
                  <p className="text-xs text-slate-500">
                    {msg.fromName} → {msg.toName} &nbsp;·&nbsp; {msg.createdAt}
                  </p>
                </div>
                {!msg.read && msg.toId === currentUser?.id && (
                  <span className="rounded-xl bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">Yeni</span>
                )}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{msg.body}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
