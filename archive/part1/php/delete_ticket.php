<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);


$ticket_id = $data["ticket_id"]; // Ensure you are sending the correct key from the client-side

$sql = "DELETE FROM tickets WHERE ticket_id = ?"; // Replace 'ticket_id' with the correct column name from your database
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $ticket_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Ticket deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleting ticket", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
