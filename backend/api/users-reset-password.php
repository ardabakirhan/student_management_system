<?php
require_once __DIR__ . '/config.php';
require_method('POST');

$session = require_auth();
require_role($session, ['admin']);

$body     = get_body();
$user_id  = isset($body['userId'])      ? (int) $body['userId']      : 0;
$new_pass = trim($body['newPassword']  ?? '');

if (!$user_id)             json_error('userId gerekli.');
if (strlen($new_pass) < 6) json_error('Şifre en az 6 karakter olmalı.');
if ($user_id === (int) $session['id']) json_error('Kendi şifrenizi bu yolla değiştiremezsiniz.');

$stmt = db()->prepare('SELECT id, role FROM users WHERE id = ?');
$stmt->execute([$user_id]);
$target = $stmt->fetch();

if (!$target)                      json_error('Kullanıcı bulunamadı.', 404);
if ($target['role'] === 'admin')   json_error('Admin şifresi sıfırlanamaz.', 403);

db()->prepare('UPDATE users SET password_hash = ?, must_change_password = 1 WHERE id = ?')
   ->execute([hash_password($new_pass), $user_id]);

json_ok(['success' => true]);
