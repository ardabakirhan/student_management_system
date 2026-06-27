import { useEffect, useMemo, useState } from "react";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";
import { resetUserPassword } from "../src/services/api";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";

const TR_MAP = { 'ı':'i','İ':'i','ğ':'g','Ğ':'g','ş':'s','Ş':'s','ç':'c','Ç':'c','ö':'o','Ö':'o','ü':'u','Ü':'u' };

function slugify(str) {
  return str.trim().split('').map(ch => TR_MAP[ch] ?? ch).join('').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function buildEmail(firstName, lastName) {
  const f = slugify(firstName);
  const l = slugify(lastName);
  if (!f && !l) return '';
  return (f + l) + '@rezonansetimesgut';
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const emptyForm = { firstName: '', lastName: '', email: '', role: 'student' };

function CreatedModal({ name, password, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xl">✓</div>
          <div>
            <p className="font-semibold text-slate-900">Kullanıcı oluşturuldu!</p>
            <p className="text-sm text-slate-500">{name}</p>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Geçici Şifre</p>
          <p className="mt-2 font-mono text-2xl font-bold tracking-widest text-slate-900">{password}</p>
          <p className="mt-2 text-xs text-slate-400">Kullanıcı ilk girişte bu şifreyi değiştirmek zorunda kalacak.</p>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={copy} className="flex-1 rounded-2xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
            {copied ? '✓ Kopyalandı' : 'Şifreyi Kopyala'}
          </button>
          <button onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordModal({ user, password, onClose }) {
  const [status, setStatus]   = useState('confirm'); // 'confirm' | 'loading' | 'done' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied]   = useState(false);

  const handleConfirm = async () => {
    setStatus('loading');
    try {
      await resetUserPassword({ userId: user.id, newPassword: password });
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.message || 'Bir hata oluştu.');
      setStatus('error');
    }
  };

  const copy = () => {
    navigator.clipboard?.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <p className="font-semibold text-slate-900">Şifre Sıfırla</p>
        <p className="mt-1 text-sm text-slate-500">{user.name}</p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Yeni Şifre</p>
          <p className="mt-2 font-mono text-2xl font-bold tracking-widest text-slate-900">{password}</p>
          {status === 'confirm' && (
            <p className="mt-2 text-xs text-slate-400">
              Kullanıcı ilk girişte bu şifreyi değiştirmek zorunda kalacak.
            </p>
          )}
        </div>

        {status === 'error' && (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {errorMsg}
          </div>
        )}
        {status === 'done' && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Şifre başarıyla sıfırlandı.
          </div>
        )}

        <div className="mt-4 flex gap-3">
          {status === 'done' ? (
            <button
              onClick={copy}
              className="flex-1 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              {copied ? '✓ Kopyalandı' : 'Şifreyi Kopyala'}
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={status === 'loading'}
              className="flex-1 rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
            >
              {status === 'loading' ? 'Sıfırlanıyor…' : 'Sıfırla'}
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {status === 'done' ? 'Kapat' : 'İptal'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagementView() {
  const { data, addUser, deleteUser, refresh } = useAppData();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [form, setForm]               = useState(emptyForm);
  const [toast, setToast]             = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [toastVisible, setToastVisible]   = useState(false);
  const [searchTerm, setSearchTerm]   = useState("");
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [createdModal, setCreatedModal]   = useState(null); // { name, password }
  const [resetTarget, setResetTarget]     = useState(null); // { user, pw }
  const [generatedPw, setGeneratedPw]     = useState('');

  const visibleUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return data.users ?? [];
    return (data.users ?? []).filter((u) =>
      `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q)
    );
  }, [data.users, searchTerm]);

  useEffect(() => {
    if (!toast) { setToastVisible(false); return undefined; }
    setToastVisible(true);
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  if (!['admin', 'teacher'].includes(currentUser?.role)) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm font-medium text-rose-600">Erişim kısıtlı</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Bu sayfaya erişim yetkiniz yok.</h1>
      </div>
    );
  }

  const openForm = () => {
    const pw = generatePassword();
    setGeneratedPw(pw);
    setForm(emptyForm);
    setIsFormVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((cur) => {
      const next = { ...cur, [name]: value };
      // Auto-generate email from first+last name unless user edited it manually
      if (name === 'firstName' || name === 'lastName') {
        const f = name === 'firstName' ? value : cur.firstName;
        const l = name === 'lastName'  ? value : cur.lastName;
        next.email = buildEmail(f, l);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    const payload = { ...form, name: fullName, password: generatedPw };
    await addUser(payload);
    await refresh();
    setCreatedModal({ name: fullName, password: generatedPw });
    setForm(emptyForm);
    setGeneratedPw('');
    setIsFormVisible(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteUser(deleteTarget.id);
    setToast(`${deleteTarget.name} silindi.`);
    setDeleteTarget(null);
  };

  const inputCls = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-400";

  return (
    <section className="space-y-6">
      {createdModal && (
        <CreatedModal
          name={createdModal.name}
          password={createdModal.password}
          onClose={() => setCreatedModal(null)}
        />
      )}

      {resetTarget && (
        <ResetPasswordModal
          user={resetTarget.user}
          password={resetTarget.pw}
          onClose={() => setResetTarget(null)}
        />
      )}

      {toastVisible && (
        <div className="fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
          <Toast message={toast} tone="success" />
        </div>
      )}

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm font-medium text-brand-600">Admin Paneli</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Kullanıcı Yönetimi</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Yeni öğrenci veya öğretmen hesapları oluşturabilir, mevcut kullanıcıları yönetebilirsiniz.
        </p>

        <div className="mt-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Kullanıcı ara</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İsim, e-posta veya role göre ara"
              className={inputCls}
            />
          </label>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={isFormVisible ? () => setIsFormVisible(false) : openForm}
            className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {isFormVisible ? 'İptal' : 'Yeni Öğrenci/Öğretmen Ekle'}
          </button>
        </div>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Yeni Kullanıcı</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Ad *</span>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} placeholder="Ad" required />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Soyad *</span>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} placeholder="Soyad" required />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">E-posta (otomatik)</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="adsoyad@rezonansetimesgut" required />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Rol</span>
              <select name="role" value={form.role} onChange={handleChange} className={inputCls}>
                <option value="student">Öğrenci</option>
                <option value="teacher">Öğretmen</option>
                <option value="veli">Veli</option>
              </select>
            </label>

            <div className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Geçici Şifre (otomatik)</span>
              <div className="flex items-center gap-2">
                <span className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 font-mono text-sm font-semibold tracking-widest text-slate-700">
                  {generatedPw}
                </span>
                <button
                  type="button"
                  onClick={() => setGeneratedPw(generatePassword())}
                  className="rounded-2xl border border-slate-200 px-3 py-3 text-xs text-slate-500 hover:bg-slate-50"
                  title="Yeni şifre üret"
                >
                  ↺
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">Kullanıcı ilk girişte değiştirmek zorunda kalacak.</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Kaydet
            </button>
            <button type="button" onClick={() => setIsFormVisible(false)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">Kullanıcı Listesi</h2>
        <div className="mt-4 grid gap-3">
          {visibleUsers.length === 0 && (
            <p className="text-sm text-slate-400">Sonuç bulunamadı.</p>
          )}
          {visibleUsers.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 border border-brand-100">
                  {user.role}
                </span>
                {user.role !== 'admin' && isAdmin && (
                  <button
                    type="button"
                    onClick={() => setResetTarget({ user, pw: generatePassword() })}
                    className="rounded-full bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                  >
                    Şifre Sıfırla
                  </button>
                )}
                {user.role !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(user)}
                    className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Kullanıcıyı sil"
        message={deleteTarget ? `${deleteTarget.name} isimli kullanıcı kalıcı olarak silinsin mi?` : ""}
        confirmLabel="Sil"
        cancelLabel="İptal"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
