<?php
require_once __DIR__ . '/config.php';

$session = require_auth();
$role    = $session['role'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $rows = db()->query(
        'SELECT id, day, time_slot, branch, teacher_name, room FROM weekly_schedule
         ORDER BY FIELD(day,"Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"), time_slot'
    )->fetchAll();
    foreach ($rows as &$r) {
        $r['id']      = (int) $r['id'];
        $r['time']    = $r['time_slot'];
        $r['lesson']  = $r['branch'];
        $r['teacher'] = $r['teacher_name'];
        unset($r['time_slot'], $r['branch'], $r['teacher_name']);
    }
    json_ok($rows);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_role($session, ['admin', 'teacher']);

    $body   = get_body();
    $action = $body['_action'] ?? '';

    if ($action === 'delete') {
        $id = isset($body['id']) ? (int) $body['id'] : 0;
        if (!$id) json_error('id gerekli.');

        if ($role === 'teacher') {
            $chk = db()->prepare('SELECT teacher_name FROM weekly_schedule WHERE id = ?');
            $chk->execute([$id]);
            $entry = $chk->fetch();
            if (!$entry) json_error('Kayıt bulunamadı.', 404);
            if ($entry['teacher_name'] !== $session['name']) {
                json_error('Yalnızca kendi ders kayıtlarınızı silebilirsiniz.', 403);
            }
        }

        $stmt = db()->prepare('DELETE FROM weekly_schedule WHERE id = ?');
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) json_error('Kayıt bulunamadı.', 404);

        json_ok(['success' => true, 'id' => $id]);
    }

    // Create
    $day          = trim($body['day']     ?? '');
    $time_slot    = trim($body['time']    ?? '');
    $branch       = trim($body['lesson']  ?? '');
    $teacher_name = trim($body['teacher'] ?? '');
    $room         = trim($body['room']    ?? '');

    if (!$day || !$time_slot || !$branch) {
        json_error('day, time ve lesson alanları gerekli.');
    }

    if ($role === 'teacher') {
        $teacher_name = $session['name'];
    }

    $stmt = db()->prepare(
        'INSERT INTO weekly_schedule (day, time_slot, branch, teacher_name, room) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$day, $time_slot, $branch, $teacher_name, $room]);

    json_ok([
        'id'      => (int) db()->lastInsertId(),
        'day'     => $day,
        'time'    => $time_slot,
        'lesson'  => $branch,
        'teacher' => $teacher_name,
        'room'    => $room,
    ], 201);
}

json_error('Method not allowed.', 405);
