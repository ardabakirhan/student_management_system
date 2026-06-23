<?php
require_once __DIR__ . '/../config.php';
require_method('GET');

$session = require_auth();

$rows = db()->query('SELECT id, user_id, name, branch, category FROM teachers ORDER BY id')->fetchAll();
foreach ($rows as &$r) {
    $r['id']      = (int) $r['id'];
    $r['user_id'] = $r['user_id'] ? (int) $r['user_id'] : null;
    $r['userId']  = $r['user_id'];
    unset($r['user_id']);
}
json_ok($rows);
