<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);


$email = $data["email"];
$role_id = $data["role_id"];
$temp_password = $data["temp_password"];
$hashed_password = password_hash($temp_password, PASSWORD_DEFAULT);
$isUninitialized = 1;

$sql = "INSERT INTO users (email, role_id, password, isUninitialized) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sisi", $email, $role_id, $hashed_password, $isUninitialized);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Staff account created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error creating staff account: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>