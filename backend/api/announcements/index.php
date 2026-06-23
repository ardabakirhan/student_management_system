<?php
require_once __DIR__ . '/../config.php';

$session = require_auth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $rows = db()->query('SELECT id, title, body, date FROM announcements ORDER BY date DESC, id DESC')->fetchAll();
    foreach ($rows as &$r) $r['id'] = (int) $r['id'];
    json_ok($rows);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_role($session, ['admin']);
    $body  = get_body();
    $title = trim($body['title'] ?? '');
    $text  = trim($body['body']  ?? '');
    if (!$title || !$text) json_error('title ve body gerekli.');

    $date = date('Y-m-d');
    $stmt = db()->prepare('INSERT INTO announcements (title, body, date) VALUES (?, ?, ?)');
    $stmt->execute([$title, $text, $date]);
    json_ok(['id' => (int) db()->lastInsertId(), 'title' => $title, 'body' => $text, 'date' => $date], 201);
}

json_error('Method not allowed.', 405);
