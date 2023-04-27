<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);


$user_id = $data["user_id"];
$old_password = $data["old_password"];
$new_password = $data["new_password"];

$sql = "SELECT password FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    if (password_verify($old_password, $user["password"])) {
        $hashed_new_password = password_hash($new_password, PASSWORD_DEFAULT);
        $sql = "UPDATE users SET password = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $hashed_new_password, $user_id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Password updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error updating password"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect old password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}
$stmt->close();
$conn->close();
?>
