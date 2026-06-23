<?php
require_once __DIR__ . '/config.php';
require_method('POST');

$body  = get_body();
$email = trim(strtolower($body['email'] ?? ''));
$pass  = $body['password'] ?? '';

if (!$email || !$pass) json_error('E-posta ve şifre gerekli.');

$stmt = db()->prepare(
    'SELECT id, name, email, password_hash, role, student_id, branch, must_change_password FROM users WHERE email = ? LIMIT 1'
);
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !verify_password($pass, $user['password_hash'])) {
    json_error('E-posta veya şifre hatalı.', 401);
}

db()->prepare('DELETE FROM sessions WHERE user_id = ? AND expires_at <= NOW()')->execute([$user['id']]);

$token      = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', time() + SESSION_TTL);
db()->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')->execute([$user['id'], $token, $expires_at]);

json_ok([
    'success' => true,
    'token'   => $token,
    'user'    => [
        'id'                  => (int) $user['id'],
        'name'                => $user['name'],
        'email'               => $user['email'],
        'role'                => $user['role'],
        'student_id'          => $user['student_id'] ? (int) $user['student_id'] : null,
        'branch'              => $user['branch'],
        'must_change_password' => (bool) $user['must_change_password'],
    ],
]);
