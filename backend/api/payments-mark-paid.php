<?php
require_once __DIR__ . '/config.php';
require_method('POST');

$session = require_auth();
require_role($session, ['admin', 'teacher']);

$body = get_body();
$id   = isset($body['id']) ? (int) $body['id'] : 0;
if (!$id) json_error('id gerekli.');

$stmt = db()->prepare("UPDATE payments SET status = 'Ödendi' WHERE id = ?");
$stmt->execute([$id]);
if ($stmt->rowCount() === 0) json_error('Ödeme kaydı bulunamadı.', 404);

$row = db()->prepare('SELECT id, student_id, student_name, amount, due_date, status FROM payments WHERE id = ?');
$row->execute([$id]);
$r = $row->fetch();
$r['id']          = (int) $r['id'];
$r['studentId']   = (int) $r['student_id'];
$r['studentName'] = $r['student_name'];
$r['amount']      = (float) $r['amount'];
$r['date']        = $r['due_date'];
unset($r['student_id'], $r['student_name'], $r['due_date']);

json_ok($r);
