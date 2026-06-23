<?php
require_once __DIR__ . '/../config.php';

$session = require_auth();
require_role($session, ['admin']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $rows = db()->query('SELECT id, name, email, role, student_id, branch, created_at FROM users ORDER BY id')->fetchAll();
    foreach ($rows as &$r) {
        $r['id']         = (int) $r['id'];
        $r['student_id'] = $r['student_id'] ? (int) $r['student_id'] : null;
    }
    json_ok($rows);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body  = get_body();
    $name  = trim($body['name']     ?? '');
    $email = trim(strtolower($body['email'] ?? ''));
    $pass  = $body['password']      ?? '';
    $role  = $body['role']          ?? '';

    if (!$name || !$email || !$pass || !in_array($role, ['admin','teacher','student','veli'], true)) {
        json_error('name, email, password ve geçerli bir role gerekli.');
    }

    $chk = db()->prepare('SELECT id FROM users WHERE email = ?');
    $chk->execute([$email]);
    if ($chk->fetch()) json_error('Bu e-posta zaten kayıtlı.', 409);

    $student_id = isset($body['studentId']) ? (int) $body['studentId'] : null;
    $branch     = $body['branch'] ?? null;

    $stmt = db()->prepare(
        'INSERT INTO users (name, email, password_hash, role, student_id, branch) VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$name, $email, hash_password($pass), $role, $student_id, $branch]);
    $new_id = (int) db()->lastInsertId();

    json_ok(['id' => $new_id, 'name' => $name, 'email' => $email, 'role' => $role,
             'student_id' => $student_id, 'branch' => $branch], 201);
}

json_error('Method not allowed.', 405);
