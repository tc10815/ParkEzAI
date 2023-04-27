<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);


$user_id = $data["user_id"];
$subject = $data["subject"];
$description = $data["description"];
$status = $data["status"];
$priority = $data["priority"];
$category = $data["category"];

$sql = "INSERT INTO tickets (user_id, subject, description, status, priority, category) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isssss", $user_id, $subject, $description, $status, $priority, $category);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Ticket created successfully", "ticket_id" => $stmt->insert_id]);
} else {
    echo json_encode(["success" => false, "message" => "Error creating ticket", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
