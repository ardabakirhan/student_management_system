<?php
require_once __DIR__ . '/config.php';
require_method('POST');

$session = require_auth();
require_role($session, ['admin']);

$body = get_body();
$id   = isset($body['id']) ? (int) $body['id'] : 0;
if (!$id) json_error('id gerekli.');
if ($id === $session['id']) json_error('Kendi hesabınızı silemezsiniz.', 403);

db()->prepare('DELETE FROM sessions WHERE user_id = ?')->execute([$id]);
$stmt = db()->prepare('DELETE FROM users WHERE id = ?');
$stmt->execute([$id]);
if ($stmt->rowCount() === 0) json_error('Kullanıcı bulunamadı.', 404);

json_ok(['success' => true, 'id' => $id]);
