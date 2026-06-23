<?php
require_once __DIR__ . '/../config.php';
require_method('GET');

$session = require_auth();

$rows = db()->query('SELECT id, day, time_slot, branch, teacher_name, room FROM weekly_schedule ORDER BY id')->fetchAll();
foreach ($rows as &$r) {
    $r['id']      = (int) $r['id'];
    $r['time']    = $r['time_slot'];
    $r['lesson']  = $r['branch'];
    $r['teacher'] = $r['teacher_name'];
    unset($r['time_slot'], $r['branch'], $r['teacher_name']);
}
json_ok($rows);
