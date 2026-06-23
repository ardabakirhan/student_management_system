<?php
require_once __DIR__ . '/../config.php';

$session = require_auth();
$role    = $session['role'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($role === 'admin') {
        $rows = db()->query('SELECT id, name, branch, category, program, age_group, status, veli_id, teacher_id, created_at FROM students ORDER BY id')->fetchAll();

    } elseif ($role === 'teacher') {
        $stmt = db()->prepare('SELECT id, name, branch, category, program, age_group, status, veli_id, teacher_id, created_at FROM students WHERE branch = ? ORDER BY id');
        $stmt->execute([$session['branch']]);
        $rows = $stmt->fetchAll();

    } elseif ($role === 'veli' || $role === 'student') {
        $child_id = $session['student_id'];
        if (!$child_id) json_ok([]);
        $stmt = db()->prepare('SELECT id, name, branch, category, program, age_group, status, veli_id, teacher_id, created_at FROM students WHERE id = ?');
        $stmt->execute([$child_id]);
        $rows = $stmt->fetchAll();

    } else {
        json_error('Bu işlem için yetkiniz yok.', 403);
    }

    foreach ($rows as &$r) {
        $r['id']         = (int) $r['id'];
        $r['veli_id']    = $r['veli_id']    ? (int) $r['veli_id']    : null;
        $r['teacher_id'] = $r['teacher_id'] ? (int) $r['teacher_id'] : null;
    }
    json_ok($rows);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_role($session, ['admin']);

    $body       = get_body();
    $name       = trim($body['name']   ?? '');
    $branch     = trim($body['branch'] ?? '');
    if (!$name || !$branch) json_error('name ve branch gerekli.');

    $stmt = db()->prepare(
        'INSERT INTO students (name, branch, category, program, age_group, status, veli_id, teacher_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $name, $branch,
        $body['category']  ?? null,
        $body['program']   ?? null,
        $body['ageGroup']  ?? null,
        $body['status']    ?? 'Aktif',
        isset($body['veliId'])    ? (int) $body['veliId']    : null,
        isset($body['teacherId']) ? (int) $body['teacherId'] : null,
    ]);
    json_ok(['id' => (int) db()->lastInsertId(), 'name' => $name, 'branch' => $branch], 201);
}

json_error('Method not allowed.', 405);
