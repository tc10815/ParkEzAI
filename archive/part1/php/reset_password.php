<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);


$account_id = $data["account_id"];
$new_password = $data["new_password"];

// Update the user's password in the database
$sql = "UPDATE users SET password = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $new_password, $account_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Password reset successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error resetting password"]);
}

$stmt->close();
$conn->close();
?>