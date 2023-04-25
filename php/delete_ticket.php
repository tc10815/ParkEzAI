<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "";
$username = "";
$password = "";
$dbname = "";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

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
