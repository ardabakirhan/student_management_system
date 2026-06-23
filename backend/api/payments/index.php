<?php
require_once __DIR__ . '/../config.php';
require_method('GET');

$session = require_auth();
$role    = $session['role'];

if ($role === 'admin') {
    $rows = db()->query('SELECT id, student_id, student_name, amount, due_date, status FROM payments ORDER BY id')->fetchAll();

} elseif ($role === 'teacher') {
    $stmt = db()->prepare('SELECT p.id, p.student_id, p.student_name, p.amount, p.due_date, p.status FROM payments p JOIN students s ON s.id = p.student_id WHERE s.branch = ? ORDER BY p.id');
    $stmt->execute([$session['branch']]);
    $rows = $stmt->fetchAll();

} elseif ($role === 'veli' || $role === 'student') {
    $child_id = $session['student_id'];
    if (!$child_id) json_ok([]);
    $stmt = db()->prepare('SELECT id, student_id, student_name, amount, due_date, status FROM payments WHERE student_id = ? ORDER BY id');
    $stmt->execute([$child_id]);
    $rows = $stmt->fetchAll();

} else {
    json_error('Bu işlem için yetkiniz yok.', 403);
}

foreach ($rows as &$r) {
    $r['id']          = (int) $r['id'];
    $r['studentId']   = (int) $r['student_id'];
    $r['studentName'] = $r['student_name'];
    $r['amount']      = (float) $r['amount'];
    $r['date']        = $r['due_date'];
    unset($r['student_id'], $r['student_name'], $r['due_date']);
}
json_ok($rows);
