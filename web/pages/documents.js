import Layout from "../components/Layout";

export default function DocumentsPage() {
  return (
    <Layout>
      <section className="space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-brand-600">Belgeler</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Sözleşme ve senet alanı</h1>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-sm leading-6 text-slate-600">
            Bu bölüm, ileride sözleşme ve senet üretimi için kullanılacak mock belge şablonlarını barındırır.
          </p>
        </div>
      </section>
    </Layout>
  );
}