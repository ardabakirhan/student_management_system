<?php
require_once __DIR__ . '/config.php';

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

    $branch = $body['branch'] ?? null;

    // Insert user; student_id resolved below for student role
    $stmt = db()->prepare(
        'INSERT INTO users (name, email, password_hash, role, student_id, branch, must_change_password)
         VALUES (?, ?, ?, ?, NULL, ?, 1)'
    );
    $stmt->execute([$name, $email, hash_password($pass), $role, $branch]);
    $new_id = (int) db()->lastInsertId();

    $student_id = null;
    if ($role === 'student') {
        // Auto-create matching student record
        $s = db()->prepare('INSERT INTO students (name, branch, status) VALUES (?, ?, ?)');
        $s->execute([$name, $branch ?? 'Belirsiz', 'Aktif']);
        $student_id = (int) db()->lastInsertId();
        db()->prepare('UPDATE users SET student_id = ? WHERE id = ?')->execute([$student_id, $new_id]);
    }

    json_ok([
        'id'         => $new_id,
        'name'       => $name,
        'email'      => $email,
        'role'       => $role,
        'student_id' => $student_id,
        'branch'     => $branch,
    ], 201);
}

json_error('Method not allowed.', 405);
