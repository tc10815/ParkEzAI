<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);


$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data["user_id"];

$sql = "SELECT * FROM tickets WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$tickets = $result->fetch_all(MYSQLI_ASSOC);

if ($tickets) {
    echo json_encode(["success" => true, "tickets" => $tickets]);
} else {
    echo json_encode(["success" => false, "message" => "No tickets found"]);
}

$stmt->close();
$conn->close();
?>
