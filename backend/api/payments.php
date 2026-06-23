<?php
require_once __DIR__ . '/config.php';
require_method('GET');

$session = require_auth();
$role    = $session['role'];

if ($role === 'admin') {
    // Auto-generate a 'Bekliyor' record for every active student
    // that has monthly_fee > 0 but no payment yet this month.
    $year  = date('Y');
    $month = date('m');   // zero-padded, e.g. "06"

    $feeStudents = db()->query(
        "SELECT id, name, monthly_fee, payment_day
         FROM students
         WHERE monthly_fee > 0 AND status = 'Aktif'"
    )->fetchAll();

    foreach ($feeStudents as $s) {
        $sid = (int) $s['id'];
        $day = max(1, min(28, (int) ($s['payment_day'] ?: 1)));
        $due = sprintf('%02d.%s.%s', $day, $month, $year);

        // due_date stored as DD.MM.YYYY — check if any record exists this month/year
        $chk = db()->prepare(
            "SELECT id FROM payments WHERE student_id = ? AND due_date LIKE ?"
        );
        $chk->execute([$sid, "%.{$month}.{$year}"]);

        if (!$chk->fetch()) {
            db()->prepare(
                "INSERT INTO payments (student_id, student_name, amount, due_date, status)
                 VALUES (?, ?, ?, ?, 'Bekliyor')"
            )->execute([$sid, $s['name'], (float) $s['monthly_fee'], $due]);
        }
    }

    $rows = db()->query(
        'SELECT id, student_id, student_name, amount, due_date, status
         FROM payments
         ORDER BY id DESC'
    )->fetchAll();

} elseif ($role === 'teacher') {
    $stmt = db()->prepare(
        'SELECT p.id, p.student_id, p.student_name, p.amount, p.due_date, p.status
         FROM payments p
         JOIN students s ON s.id = p.student_id
         WHERE s.branch = ?
         ORDER BY p.id DESC'
    );
    $stmt->execute([$session['branch']]);
    $rows = $stmt->fetchAll();

} elseif ($role === 'veli' || $role === 'student') {
    $child_id = $session['student_id'];
    if (!$child_id) json_ok([]);
    $stmt = db()->prepare(
        'SELECT id, student_id, student_name, amount, due_date, status
         FROM payments
         WHERE student_id = ?
         ORDER BY id DESC'
    );
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
