<?php
require_once 'config.php'; // Use require_once instead of require
use Firebase\JWT\JWT;

// Get the JWT token from the Authorization header
$headers = apache_request_headers();
$jwt = "";
$authorizationHeader = '';

foreach ($headers as $key => $value) {
    if (strtolower($key) === 'authorization') {
        $authorizationHeader = $value;
        break;
    }
}

if ($authorizationHeader) {
    $jwt = str_replace("Bearer ", "", $authorizationHeader);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized: Missing Authorization header"]);
    exit;
}

// Decode and verify the JWT token
try {
    $decoded = JWT::decode($jwt, $secretKey, ['HS256']);
} catch (\Exception $e) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized: " . $e->getMessage()]); // Add more details to the error message
    exit;
}

// The $decoded variable is available for use in other PHP files
?>
