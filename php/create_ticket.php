<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "";
$username = "";
$password = "";
$dbname = "";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

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
