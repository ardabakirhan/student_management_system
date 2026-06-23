<?php
require_once __DIR__ . '/config.php';
require_method('POST');

$session = require_auth();
db()->prepare('DELETE FROM sessions WHERE token = ?')->execute([$session['token']]);
json_ok(['success' => true]);
