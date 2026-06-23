<?php
require_once __DIR__ . '/config.php';
require_method('POST');

$session = require_auth();
require_role($session, ['admin']);

$body         = get_body();
$student_name = trim($body['studentName'] ?? '');
$amount       = isset($body['amount'])    ? (float) $body['amount'] : 0;
$due_date     = trim($body['dueDate']     ?? date('d.m.Y'));
$student_id   = isset($body['studentId']) ? (int) $body['studentId'] : 0;

if (!$student_name || $amount <= 0) json_error('studentName ve amount gerekli.');

if (!$student_id) {
    $chk = db()->prepare('SELECT id FROM students WHERE name = ? LIMIT 1');
    $chk->execute([$student_name]);
    $found = $chk->fetch();
    if ($found) $student_id = (int) $found['id'];
}

$stmt = db()->prepare("INSERT INTO payments (student_id, student_name, amount, due_date, status) VALUES (?, ?, ?, ?, 'Bekliyor')");
$stmt->execute([$student_id ?: null, $student_name, $amount, $due_date]);

json_ok([
    'id'          => (int) db()->lastInsertId(),
    'studentId'   => $student_id ?: null,
    'studentName' => $student_name,
    'amount'      => $amount,
    'date'        => $due_date,
    'status'      => 'Bekliyor',
], 201);
