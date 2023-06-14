<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);


$staff_role_id = $data["role"];

if ($staff_role_id == 3 || $staff_role_id == 6) {
    $sql = "SELECT tickets.*, users.first_name, users.last_name, users.email FROM tickets JOIN users ON tickets.user_id = users.id";
} elseif ($staff_role_id == 4) {
    $sql = "SELECT tickets.*, users.first_name, users.last_name, users.email FROM tickets JOIN users ON tickets.user_id = users.id WHERE category = 'Lot Owners'";
} elseif ($staff_role_id == 5) {
    $sql = "SELECT tickets.*, users.first_name, users.last_name, users.email FROM tickets JOIN users ON tickets.user_id = users.id WHERE category = 'Advertisers'";
} else {
    die(json_encode(["success" => false, "message" => "Invalid staff role ID"]));
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $tickets = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["success" => true, "tickets" => $tickets]);
} else {
    echo json_encode(["success" => false, "message" => "No tickets found"]);
}

$conn->close();
?>
