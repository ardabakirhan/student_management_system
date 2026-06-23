<?php
require_once __DIR__ . '/../config.php';

$session = require_auth();
$role    = $session['role'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($role === 'admin') {
        $rows = db()->query('SELECT id, student_id, student_name, lesson, date, status, created_at FROM attendance ORDER BY date DESC, id DESC')->fetchAll();

    } elseif ($role === 'teacher') {
        $stmt = db()->prepare(
            'SELECT a.id, a.student_id, a.student_name, a.lesson, a.date, a.status, a.created_at
             FROM attendance a JOIN students s ON s.id = a.student_id WHERE s.branch = ?
             ORDER BY a.date DESC, a.id DESC'
        );
        $stmt->execute([$session['branch']]);
        $rows = $stmt->fetchAll();

    } elseif ($role === 'veli' || $role === 'student') {
        $child_id = $session['student_id'];
        if (!$child_id) json_ok([]);
        $stmt = db()->prepare('SELECT id, student_id, student_name, lesson, date, status, created_at FROM attendance WHERE student_id = ? ORDER BY date DESC, id DESC');
        $stmt->execute([$child_id]);
        $rows = $stmt->fetchAll();

    } else {
        json_error('Bu işlem için yetkiniz yok.', 403);
    }

    foreach ($rows as &$r) {
        $r['id']          = (int) $r['id'];
        $r['studentId']   = (int) $r['student_id'];
        $r['studentName'] = $r['student_name'];
        $r['createdAt']   = $r['created_at'];
        unset($r['student_id'], $r['student_name'], $r['created_at']);
    }
    json_ok($rows);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_role($session, ['admin', 'teacher']);

    $body   = get_body();
    $action = $body['_action'] ?? 'create';

    if ($action === 'update') {
        $id     = isset($body['id']) ? (int) $body['id'] : 0;
        $status = trim($body['status'] ?? 'Derse Geldi');
        if (!$id) json_error('id gerekli.');

        db()->prepare('UPDATE attendance SET status = ? WHERE id = ?')->execute([$status, $id]);
        $row = db()->prepare('SELECT id, student_id, student_name, lesson, date, status FROM attendance WHERE id = ?');
        $row->execute([$id]);
        $r = $row->fetch();
        if (!$r) json_error('Kayıt bulunamadı.', 404);
        $r['id']          = (int) $r['id'];
        $r['studentId']   = (int) $r['student_id'];
        $r['studentName'] = $r['student_name'];
        unset($r['student_id'], $r['student_name']);
        json_ok($r);
    }

    $student_id   = isset($body['studentId'])   ? (int) $body['studentId']   : 0;
    $student_name = trim($body['studentName']   ?? '');
    $lesson       = trim($body['lesson']        ?? '');
    $date         = trim($body['date']          ?? date('d.m.Y'));
    $status       = trim($body['status']        ?? 'Derse Geldi');

    if (!$student_id || !$student_name) json_error('studentId ve studentName gerekli.');

    $stmt = db()->prepare('INSERT INTO attendance (student_id, student_name, lesson, date, status) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$student_id, $student_name, $lesson ?: null, $date, $status]);

    json_ok([
        'id'          => (int) db()->lastInsertId(),
        'studentId'   => $student_id,
        'studentName' => $student_name,
        'lesson'      => $lesson,
        'date'        => $date,
        'status'      => $status,
    ], 201);
}

json_error('Method not allowed.', 405);
