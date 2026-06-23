<?php
require_once __DIR__ . '/config.php';
require_method('POST');

$session  = require_auth();
$body     = get_body();

$old_pass = trim($body['oldPassword'] ?? '');
$new_pass = trim($body['newPassword'] ?? '');

if (!$old_pass || !$new_pass) json_error('Eski ve yeni şifre gerekli.');
if (strlen($new_pass) < 6)    json_error('Yeni şifre en az 6 karakter olmalı.');

$stmt = db()->prepare('SELECT password_hash FROM users WHERE id = ?');
$stmt->execute([$session['id']]);
$user = $stmt->fetch();

if (!$user || !verify_password($old_pass, $user['password_hash'])) {
    json_error('Mevcut şifre hatalı.', 401);
}

db()->prepare('UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?')
   ->execute([hash_password($new_pass), $session['id']]);

json_ok(['success' => true]);
