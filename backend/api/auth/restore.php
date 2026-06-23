<?php
require_once __DIR__ . '/../config.php';
require_method('GET');

$session = require_auth();

json_ok([
    'token' => $session['token'],
    'user'  => [
        'id'         => $session['id'],
        'name'       => $session['name'],
        'email'      => $session['email'],
        'role'       => $session['role'],
        'student_id' => $session['student_id'],
        'branch'     => $session['branch'],
    ],
]);
