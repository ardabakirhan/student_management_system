<?php
require_once __DIR__ . '/config.php';

$session = require_auth();
$role    = $session['role'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($role === 'admin') {
        $rows = db()->query('SELECT id, student_id, student_name, teacher_id, teacher_name, month, content, created_at FROM evaluations ORDER BY created_at DESC, id DESC')->fetchAll();

    } elseif ($role === 'teacher') {
        $stmt = db()->prepare(
            'SELECT id, student_id, student_name, teacher_id, teacher_name, month, content, created_at
             FROM evaluations WHERE teacher_id = (SELECT id FROM teachers WHERE user_id = ? LIMIT 1)
             ORDER BY created_at DESC, id DESC'
        );
        $stmt->execute([$session['id']]);
        $rows = $stmt->fetchAll();

    } elseif ($role === 'veli' || $role === 'student') {
        $child_id = $session['student_id'];
        if (!$child_id) json_ok([]);
        $stmt = db()->prepare('SELECT id, student_id, student_name, teacher_id, teacher_name, month, content, created_at FROM evaluations WHERE student_id = ? ORDER BY created_at DESC, id DESC');
        $stmt->execute([$child_id]);
        $rows = $stmt->fetchAll();

    } else {
        json_error('Bu işlem için yetkiniz yok.', 403);
    }

    foreach ($rows as &$r) {
        $r['id']          = (int) $r['id'];
        $r['studentId']   = (int) $r['student_id'];
        $r['studentName'] = $r['student_name'];
        $r['teacherId']   = (int) $r['teacher_id'];
        $r['teacherName'] = $r['teacher_name'];
        $r['createdAt']   = $r['created_at'];
        unset($r['student_id'], $r['student_name'], $r['teacher_id'], $r['teacher_name'], $r['created_at']);
    }
    json_ok($rows);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_role($session, ['admin', 'teacher']);

    $body         = get_body();
    $student_id   = isset($body['studentId'])  ? (int) $body['studentId']  : 0;
    $student_name = trim($body['studentName']  ?? '');
    $teacher_id   = isset($body['teacherId'])  ? (int) $body['teacherId']  : 0;
    $teacher_name = trim($body['teacherName']  ?? '');
    $month        = trim($body['month']        ?? '');
    $content      = trim($body['content']      ?? '');

    if (!$student_id || !$student_name || !$teacher_id || !$teacher_name || !$month || !$content) {
        json_error('Tüm alanlar gerekli.');
    }

    $created_at = date('Y-m-d');
    $stmt = db()->prepare(
        'INSERT INTO evaluations (student_id, student_name, teacher_id, teacher_name, month, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$student_id, $student_name, $teacher_id, $teacher_name, $month, $content, $created_at]);

    json_ok([
        'id'          => (int) db()->lastInsertId(),
        'studentId'   => $student_id,
        'studentName' => $student_name,
        'teacherId'   => $teacher_id,
        'teacherName' => $teacher_name,
        'month'       => $month,
        'content'     => $content,
        'createdAt'   => $created_at,
    ], 201);
}

json_error('Method not allowed.', 405);
