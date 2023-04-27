<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);

$password = $data["password"];
$user_id = $data["user_id"];

// Fetch the user's hashed password from the database
$sql = "SELECT password FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$hashed_password = $row["password"];

// Verify the provided password against the stored hashed password
if (password_verify($password, $hashed_password)) {
    // Delete the tickets associated with the user
    $deleteTicketsSql = "DELETE FROM tickets WHERE user_id = ?";
    $deleteTicketsStmt = $conn->prepare($deleteTicketsSql);
    $deleteTicketsStmt->bind_param("i", $user_id);
    $deleteTicketsStmt->execute();
    $deleteTicketsStmt->close();

    // Delete the user from the database
    $sql = "DELETE FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Account and associated tickets deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting account"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incorrect password"]);
}

$stmt->close();
$conn->close();
?>
