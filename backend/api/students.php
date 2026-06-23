<?php
require_once __DIR__ . '/config.php';

$session = require_auth();
$role    = $session['role'];

$COLS = 'id, name, branch, category, program, age_group, status, veli_id, teacher_id,
         birth_date, phone, parent_name, parent_phone,
         lesson_day, lesson_time, start_date, monthly_fee, payment_day, duration_months,
         created_at';

function cast_row(array &$r): void {
    $r['id']             = (int) $r['id'];
    $r['veli_id']        = $r['veli_id']        ? (int)   $r['veli_id']        : null;
    $r['teacher_id']     = $r['teacher_id']      ? (int)   $r['teacher_id']     : null;
    $r['monthly_fee']    = $r['monthly_fee']    !== null ? (float) $r['monthly_fee']    : null;
    $r['payment_day']    = $r['payment_day']    !== null ? (int)   $r['payment_day']    : null;
    $r['duration_months']= $r['duration_months']!== null ? (int)   $r['duration_months']: null;
}

// ── GET ───────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    global $COLS;
    if ($role === 'admin') {
        $rows = db()->query("SELECT $COLS FROM students ORDER BY id")->fetchAll();

    } elseif ($role === 'teacher') {
        $stmt = db()->prepare("SELECT $COLS FROM students WHERE branch = ? ORDER BY id");
        $stmt->execute([$session['branch']]);
        $rows = $stmt->fetchAll();

    } elseif ($role === 'veli' || $role === 'student') {
        $child_id = $session['student_id'];
        if (!$child_id) json_ok([]);
        $stmt = db()->prepare("SELECT $COLS FROM students WHERE id = ?");
        $stmt->execute([$child_id]);
        $rows = $stmt->fetchAll();

    } else {
        json_error('Bu işlem için yetkiniz yok.', 403);
    }

    foreach ($rows as &$r) cast_row($r);
    json_ok($rows);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_role($session, ['admin']);

    $body   = get_body();
    $action = $body['_action'] ?? 'create';

    // ── Update existing student ───────────────────────────────────────────────
    if ($action === 'update') {
        global $COLS;
        $id = isset($body['id']) ? (int) $body['id'] : 0;
        if (!$id) json_error('id gerekli.');

        // Request key → DB column
        $map = [
            'name'           => 'name',
            'branch'         => 'branch',
            'category'       => 'category',
            'program'        => 'program',
            'ageGroup'       => 'age_group',
            'status'         => 'status',
            'birthDate'      => 'birth_date',
            'phone'          => 'phone',
            'parentName'     => 'parent_name',
            'parentPhone'    => 'parent_phone',
            'lessonDay'      => 'lesson_day',
            'lessonTime'     => 'lesson_time',
            'startDate'      => 'start_date',
            'monthlyFee'     => 'monthly_fee',
            'paymentDay'     => 'payment_day',
            'durationMonths' => 'duration_months',
        ];

        $set = []; $params = [];
        foreach ($map as $key => $col) {
            if (array_key_exists($key, $body)) {
                $set[]    = "`$col` = ?";
                $val      = $body[$key];
                $params[] = ($val === '' || $val === null) ? null : $val;
            }
        }
        if (empty($set)) json_error('Güncellenecek alan yok.');

        $params[] = $id;
        db()->prepare('UPDATE students SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);

        $stmt = db()->prepare("SELECT $COLS FROM students WHERE id = ?");
        $stmt->execute([$id]);
        $r = $stmt->fetch();
        if (!$r) json_error('Kayıt bulunamadı.', 404);
        cast_row($r);
        json_ok($r);
    }

    // ── Create new student ────────────────────────────────────────────────────
    $name   = trim($body['name']   ?? '');
    $branch = trim($body['branch'] ?? '');
    if (!$name || !$branch) json_error('name ve branch gerekli.');

    $stmt = db()->prepare(
        'INSERT INTO students (name, branch, category, program, age_group, status, veli_id, teacher_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
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
