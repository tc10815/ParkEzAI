<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$password = $data["password"];
$options = ['cost' => 12];
$hashed_password = password_hash($password, PASSWORD_DEFAULT, $options);

if ($hashed_password) {
    echo json_encode(["success" => true, "hashed_password" => $hashed_password]);
} else {
    echo json_encode(["success" => false, "message" => "Error hashing password"]);
}
?>
