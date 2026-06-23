<?php
require_once __DIR__ . '/../config.php';
require_method('GET');

$rows = db()->query('SELECT id, name, category, description, image_url FROM products ORDER BY id')->fetchAll();
foreach ($rows as &$r) {
    $r['id']       = (int) $r['id'];
    $r['imageUrl'] = $r['image_url'];
    unset($r['image_url']);
}
json_ok($rows);
