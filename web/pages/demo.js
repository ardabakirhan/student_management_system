import DemoLessonView from "../components/DemoLessonView";
import { useAuth } from "../hooks/useAuth";
import Layout from "../components/Layout";

export default function DemoPage() {
  const { isAuthenticated } = useAuth();

  // Accessible both with and without auth — use Layout only when authenticated
  if (isAuthenticated) {
    return (
      <Layout>
        <DemoLessonView />
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#6b21a8_0,_#1e1035_38%,_#0a0118_100%)] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-400">MEB Özel Etimesgut</p>
          <h1 className="mt-2 text-2xl font-bold text-white">Rezonans Sanat ve Kişisel Gelişim Merkezi</h1>
        </div>
        <DemoLessonView />
      </div>
    </div>
  );
}
