export default function Toast({ message, tone = "error" }) {
  if (!message) {
    return null;
  }

  const toneStyles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-soft ${toneStyles}`}>
      {message}
    </div>
  );
}