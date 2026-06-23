<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body           = get_body();
    $name           = trim($body['name']          ?? '');
    $phone          = trim($body['phone']         ?? '');
    $email          = trim($body['email']         ?? '');
    $branch         = trim($body['branch']        ?? '');
    $preferred_time = trim($body['preferredTime'] ?? '');
    $note           = trim($body['note']          ?? '');

    if (!$name || !$phone || !$email || !$branch) json_error('name, phone, email ve branch gerekli.');

    $stmt = db()->prepare('INSERT INTO demo_requests (name, phone, email, branch, preferred_time, note) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$name, $phone, $email, $branch, $preferred_time ?: null, $note ?: null]);

    json_ok([
        'id'            => (int) db()->lastInsertId(),
        'name'          => $name,
        'phone'         => $phone,
        'email'         => $email,
        'branch'        => $branch,
        'preferredTime' => $preferred_time,
        'note'          => $note,
        'createdAt'     => date('Y-m-d'),
    ], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $session = require_auth();
    require_role($session, ['admin']);

    $rows = db()->query('SELECT id, name, phone, email, branch, preferred_time, note, created_at FROM demo_requests ORDER BY created_at DESC, id DESC')->fetchAll();
    foreach ($rows as &$r) {
        $r['id']            = (int) $r['id'];
        $r['preferredTime'] = $r['preferred_time'];
        $r['createdAt']     = $r['created_at'];
        unset($r['preferred_time'], $r['created_at']);
    }
    json_ok($rows);
}

json_error('Method not allowed.', 405);
