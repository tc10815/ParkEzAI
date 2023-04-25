<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = " ";
$username = " ";
$password = " ";
$dbname = " ";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$ticket_id = $data["ticket_id"];
$status = $data["status"];
$priority = $data["priority"];

$sql = "UPDATE tickets SET status = ?, priority = ? WHERE ticket_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $status, $priority, $ticket_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Ticket updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating ticket", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
