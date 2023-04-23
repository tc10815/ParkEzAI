<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Replace these with your actual database credentials
$servername = "";
$username = "";
$password = "";
$dbname = "";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Read JSON data from request body
$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];
$password = $data["password"];

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    if (password_verify($password, $user["password"])) {
        $secretKey = ""; // Replace this with your own secret key

        $issuedAt = time();
        $notBefore = $issuedAt;
        $expiration = $issuedAt + 3600; // Token valid for 1 hour

        $payload = [
            "iat" => $issuedAt,
            "nbf" => $notBefore,
            "exp" => $expiration,
            "iss" => "https://tomcookson.com",
            "aud" => "https://tomcookson.com",
            "data" => [
                "user_id" => $user["id"],
                "email" => $user["email"],
                "first_name" => $user["first_name"],
                "last_name" => $user["last_name"],
                "role_id" => $user["role_id"],
                "company_name" => $user["company_name"],
                "isUninitialized" => $user["isUninitialized"] 
            ]
        ];

        $jwt = JWT::encode($payload, $secretKey, "HS256");

        echo json_encode(["success" => true, "token" => $jwt]);
    } else {
        echo json_encode(["error" => "Invalid email or password"]);
    }
} else {
    echo json_encode(["error" => "Invalid email or password"]);
}
$stmt->close();
$conn->close();
?>
