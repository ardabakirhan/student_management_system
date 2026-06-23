<?php
require_once __DIR__ . '/config.php';

$session = require_auth();
$role    = $session['role'];
$uid     = $session['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($role === 'admin') {
        $rows = db()->query('SELECT id, from_id, from_name, from_role, to_id, to_name, channel, subject, body, is_read, created_at FROM messages ORDER BY created_at DESC, id DESC')->fetchAll();
    } else {
        $stmt = db()->prepare('SELECT id, from_id, from_name, from_role, to_id, to_name, channel, subject, body, is_read, created_at FROM messages WHERE from_id = ? OR to_id = ? ORDER BY created_at DESC, id DESC');
        $stmt->execute([$uid, $uid]);
        $rows = $stmt->fetchAll();
    }

    foreach ($rows as &$r) {
        $r['id']       = (int) $r['id'];
        $r['fromId']   = (int) $r['from_id'];
        $r['fromName'] = $r['from_name'];
        $r['fromRole'] = $r['from_role'];
        $r['toId']     = $r['to_id'] ? (int) $r['to_id'] : null;
        $r['toName']   = $r['to_name'];
        $r['read']     = (bool) $r['is_read'];
        $r['createdAt'] = $r['created_at'];
        unset($r['from_id'], $r['from_name'], $r['from_role'], $r['to_id'], $r['to_name'], $r['is_read'], $r['created_at']);
    }
    json_ok($rows);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body      = get_body();
    $from_id   = isset($body['fromId']) ? (int) $body['fromId'] : $uid;
    $from_name = trim($body['fromName'] ?? $session['name']);
    $from_role = trim($body['fromRole'] ?? $role);
    $to_id     = isset($body['toId'])   ? (int) $body['toId']   : null;
    $to_name   = trim($body['toName']   ?? '');
    $channel   = trim($body['channel']  ?? 'direct');
    $subject   = trim($body['subject']  ?? '');
    $msg_body  = trim($body['body']     ?? '');

    if (!$subject || !$msg_body || !$to_name) json_error('subject, body ve toName gerekli.');
    if ($from_id !== $uid && $role !== 'admin') { $from_id = $uid; $from_name = $session['name']; $from_role = $role; }

    $created_at = date('Y-m-d');
    $stmt = db()->prepare('INSERT INTO messages (from_id, from_name, from_role, to_id, to_name, channel, subject, body, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)');
    $stmt->execute([$from_id, $from_name, $from_role, $to_id ?: null, $to_name, $channel, $subject, $msg_body, $created_at]);

    json_ok([
        'id' => (int) db()->lastInsertId(), 'fromId' => $from_id, 'fromName' => $from_name,
        'fromRole' => $from_role, 'toId' => $to_id, 'toName' => $to_name,
        'channel' => $channel, 'subject' => $subject, 'body' => $msg_body,
        'read' => false, 'createdAt' => $created_at,
    ], 201);
}

json_error('Method not allowed.', 405);
