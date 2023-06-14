<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);
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
