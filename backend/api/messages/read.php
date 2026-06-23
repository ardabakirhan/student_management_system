<?php
require_once __DIR__ . '/../config.php';
require_method('POST');

$session = require_auth();
$body    = get_body();
$id      = isset($body['id']) ? (int) $body['id'] : 0;
if (!$id) json_error('id gerekli.');

if ($session['role'] !== 'admin') {
    $chk = db()->prepare('SELECT to_id FROM messages WHERE id = ?');
    $chk->execute([$id]);
    $msg = $chk->fetch();
    if (!$msg) json_error('Mesaj bulunamadı.', 404);
    if ((int) $msg['to_id'] !== $session['id']) json_error('Bu mesajı okuma yetkiniz yok.', 403);
}

$stmt = db()->prepare('UPDATE messages SET is_read = 1 WHERE id = ?');
$stmt->execute([$id]);
if ($stmt->rowCount() === 0) json_error('Mesaj bulunamadı.', 404);

json_ok(['success' => true]);
