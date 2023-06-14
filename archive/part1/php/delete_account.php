<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);


$account_id = $data["account_id"];

// Delete the tickets associated with the user
$deleteTicketsSql = "DELETE FROM tickets WHERE user_id = ?";
$deleteTicketsStmt = $conn->prepare($deleteTicketsSql);
$deleteTicketsStmt->bind_param("i", $account_id);
$deleteTicketsStmt->execute();
$deleteTicketsStmt->close();

// Delete the user from the database
$sql = "DELETE FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $account_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Account and associated tickets deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Account not found or already deleted"]);
}

$stmt->close();
$conn->close();
?>
