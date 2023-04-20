<?php
require 'vendor/autoload.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use Firebase\JWT\JWT;

$key = "Raccoon"; // Replace this with your own secret key

$payload = array(
    "userId" => "RaccoonMan", // Replace this with the actual user ID
    "userRole" => "LovesRacoons" // Replace this with the actual user role
);

echo $key  . ' is key<br />';
echo $payload["userId"]  . ' is userId<br />';
echo $payload["userRole"]  . ' is userRole<br />';


$jwt = JWT::encode($payload, $key, 'HS256');

echo "JWT: " . $jwt;
?>
