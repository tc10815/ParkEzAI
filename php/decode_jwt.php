<?php
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = ""; // Replace this with your own secret key
$jwt = isset($_GET['jwt']) ? $_GET['jwt'] : ''; // Get the JWT from the URL query string

if (!$jwt) {
    echo "Error: No JWT provided.";
    exit;
}

try {
    $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
    print_r($decoded);
} catch (\Firebase\JWT\ExpiredException $e) {
    echo "Error: Token expired.";
} catch (\Firebase\JWT\BeforeValidException $e) {
    echo "Error: Before valid exception.";
} catch (\Firebase\JWT\SignatureInvalidException $e) {
    echo "Error: Invalid signature.";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
