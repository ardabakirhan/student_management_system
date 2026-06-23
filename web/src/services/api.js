// ─── Configuration ────────────────────────────────────────────────────────────
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api').replace(/\/$/, '');
const AUTH_TOKEN_KEY = 'student-asystem:auth-token';

export const USER_ROLES = ['admin', 'teacher', 'student', 'veli'];

export const ROLE_SCHEMA = {
  admin: {
    label: 'Admin',
    permissions: ['users:read', 'users:create', 'finance:read', 'attendance:write', 'schedule:read', 'evaluations:all', 'messages:all', 'announcements:write', 'demo:read']
  },
  teacher: {
    label: 'Öğretmen',
    permissions: ['students:read', 'attendance:write', 'schedule:read', 'evaluations:write', 'messages:direct']
  },
  student: {
    label: 'Öğrenci',
    permissions: ['profile:read', 'schedule:read', 'finance:read', 'evaluations:self', 'messages:self']
  },
  veli: {
    label: 'Veli',
    permissions: ['evaluations:child', 'messages:self', 'demo:create', 'announcements:read']
  }
};

// ─── Platform helpers ─────────────────────────────────────────────────────────

function isBrowser() {
  return typeof window !== 'undefined';
}

// Cached once — avoids re-running the dynamic import on every request.
let _isNativeCache = null;
async function isNativePlatform() {
  if (_isNativeCache !== null) return _isNativeCache;
  if (!isBrowser()) return (_isNativeCache = false);
  try {
    const { Capacitor } = await import('@capacitor/core');
    _isNativeCache = Boolean(Capacitor?.isNativePlatform());
  } catch {
    _isNativeCache = false;
  }
  return _isNativeCache;
}

async function getToken() {
  if (!isBrowser()) return null;
  if (await isNativePlatform()) {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      const { value } = await Preferences.get({ key: AUTH_TOKEN_KEY });
      return value;
    } catch { return null; }
  }
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

async function setToken(token) {
  if (!isBrowser()) return;
  if (await isNativePlatform()) {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
    } catch {}
  } else {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

async function removeToken() {
  if (!isBrowser()) return;
  if (await isNativePlatform()) {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.remove({ key: AUTH_TOKEN_KEY });
    } catch {}
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

// ─── HTTP client ──────────────────────────────────────────────────────────────

async function http(path, options = {}) {
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('[api] No token for', options.method || 'GET', path);
  }

  // Apache on shared hosting often strips the Authorization header before PHP sees it.
  // Appending ?token= lets PHP fall back to $_GET['token'] in require_auth().
  const sep = path.includes('?') ? '&' : '?';
  const url = token
    ? `${BASE_URL}${path}${sep}token=${encodeURIComponent(token)}`
    : `${BASE_URL}${path}`;

  console.log('[api]', options.method || 'GET', path, token ? 'token:' + token.slice(0, 8) + '…' : 'NO TOKEN');

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data;
}

function get(path) {
  return http(path, { method: 'GET' });
}

function post(path, body) {
  return http(path, { method: 'POST', body: JSON.stringify(body) });
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginUser({ email, password }) {
  try {
    const data = await post('/auth-login.php', { email, password });
    console.log('[loginUser] raw response:', JSON.stringify(data));
    if (data.token) await setToken(data.token);
    return { success: true, user: data.user, token: data.token };
  } catch (err) {
    console.log('[loginUser] error:', err.message);
    return { success: false, message: err.message || 'E-posta veya şifre hatalı.' };
  }
}

export async function restoreSession() {
  const token = await getToken();
  if (!token) return null;
  try {
    const data = await get('/auth-restore.php');
    return { token: data.token || token, user: data.user };
  } catch {
    await removeToken();
    return null;
  }
}

export async function logoutUser() {
  try {
    await post('/auth-logout.php', {});
  } catch {}
  await removeToken();
  return { success: true };
}

export async function changePassword({ oldPassword, newPassword }) {
  return post('/auth-change-password.php', { oldPassword, newPassword });
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUsers() {
  return get('/users.php');
}

export async function createUser(user) {
  return post('/users.php', user);
}

export async function deleteUser(userId) {
  return post('/users-delete.php', { id: userId });
}

export async function resetUserPassword({ userId, newPassword }) {
  return post('/users-reset-password.php', { userId, newPassword });
}

// ─── Students ─────────────────────────────────────────────────────────────────

export async function getStudents() {
  return get('/students.php');
}

export async function createStudent({ name, branch, category, program, ageGroup, status }) {
  return post('/students.php', { name, branch, category, program, ageGroup, status });
}

export async function updateStudent(id, fields) {
  return post('/students.php', { _action: 'update', id, ...fields });
}

export async function deleteStudent(studentId) {
  return post('/students-delete.php', { id: studentId });
}

// ─── Teachers ─────────────────────────────────────────────────────────────────

export async function getTeachers() {
  return get('/teachers.php');
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export async function getWeeklySchedule() {
  return get('/schedule.php');
}

export async function addScheduleEntry({ day, time, lesson, teacher, room }) {
  return post('/schedule.php', { day, time, lesson, teacher, room });
}

export async function deleteScheduleEntry(id) {
  return post('/schedule.php', { id, _action: 'delete' });
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function getPaymentHistory() {
  return get('/payments.php');
}

export async function markPaymentPaid(paymentId) {
  return post('/payments-mark-paid.php', { id: paymentId });
}

export async function createInvoice({ studentName, amount, dueDate, studentId }) {
  return post('/payments-create-invoice.php', { studentName, amount, dueDate, studentId });
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export async function getAttendanceRecords() {
  return get('/attendance.php');
}

export async function getAttendance() {
  return getAttendanceRecords();
}

export async function markAttendancePresent(attendanceId) {
  return post('/attendance.php', { id: attendanceId, status: 'Derse Geldi', _action: 'update' });
}

// ─── Evaluations ──────────────────────────────────────────────────────────────

export async function getEvaluations() {
  return get('/evaluations.php');
}

export async function createEvaluation({ studentId, studentName, teacherId, teacherName, month, content }) {
  return post('/evaluations.php', { studentId, studentName, teacherId, teacherName, month, content });
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessages() {
  return get('/messages.php');
}

export async function sendMessage({ fromId, fromName, fromRole, toId, toName, channel, subject, body }) {
  return post('/messages.php', { fromId, fromName, fromRole, toId, toName, channel, subject, body });
}

export async function markMessageRead(messageId) {
  return post('/messages-read.php', { id: messageId });
}

// ─── Announcements ────────────────────────────────────────────────────────────

export async function getAnnouncements() {
  return get('/announcements.php');
}

export async function createAnnouncement({ title, body }) {
  return post('/announcements.php', { title, body });
}

// ─── Demo requests ────────────────────────────────────────────────────────────

export async function createDemoRequest({ name, phone, email, branch, preferredTime, note }) {
  return post('/demo.php', { name, phone, email, branch, preferredTime, note });
}

export async function getDemoRequests() {
  return get('/demo.php');
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts() {
  return get('/products.php');
}

// ─── App-state aggregate (used by some pages) ─────────────────────────────────

export async function getAppState() {
  const [users, students, teachers, weeklySchedule, paymentHistory, attendanceRecords,
         evaluations, messages, announcements, products] = await Promise.all([
    getUsers().catch(() => []),
    getStudents().catch(() => []),
    getTeachers().catch(() => []),
    getWeeklySchedule().catch(() => []),
    getPaymentHistory().catch(() => []),
    getAttendanceRecords().catch(() => []),
    getEvaluations().catch(() => []),
    getMessages().catch(() => []),
    getAnnouncements().catch(() => []),
    getProducts().catch(() => []),
  ]);

  return { users, students, teachers, weeklySchedule, paymentHistory, attendanceRecords,
           evaluations, messages, announcements, products, demoRequests: [] };
}

// ─── Legacy / compat exports ──────────────────────────────────────────────────

export function getStoredState() {
  return {};
}

export async function resetMockStore() {
  return { success: true };
}

export { getStoredState as getStoredStateSync };
