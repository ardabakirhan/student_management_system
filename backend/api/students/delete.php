<?php
require_once __DIR__ . '/../config.php';
require_method('POST');

$session = require_auth();
require_role($session, ['admin']);

$body = get_body();
$id   = isset($body['id']) ? (int) $body['id'] : 0;
if (!$id) json_error('id gerekli.');

db()->prepare('DELETE FROM attendance WHERE student_id = ?')->execute([$id]);
db()->prepare('DELETE FROM payments   WHERE student_id = ?')->execute([$id]);
$stmt = db()->prepare('DELETE FROM students WHERE id = ?');
$stmt->execute([$id]);
if ($stmt->rowCount() === 0) json_error('Öğrenci bulunamadı.', 404);

json_ok(['success' => true, 'id' => $id]);
