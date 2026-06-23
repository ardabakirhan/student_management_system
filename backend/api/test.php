<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$result = [
    'php_version'  => PHP_VERSION,
    'extensions'   => [
        'pdo'       => extension_loaded('pdo'),
        'pdo_mysql' => extension_loaded('pdo_mysql'),
        'json'      => extension_loaded('json'),
        'mbstring'  => extension_loaded('mbstring'),
    ],
    'db' => null,
];

$host    = 'localhost';
$dbname  = 'rezonans_db';
$user    = 'rezonans_admin';
$pass    = 'vEbF0)72hsPLb998';
$charset = 'utf8mb4';

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $version = $pdo->query('SELECT VERSION() AS v')->fetchColumn();
    $tables  = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);

    $result['db'] = [
        'success'        => true,
        'mysql_version'  => $version,
        'tables'         => $tables,
    ];
} catch (PDOException $e) {
    $result['db'] = [
        'success' => false,
        'error'   => $e->getMessage(),
        'code'    => $e->getCode(),
    ];
}

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
