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
$staff_role_id = $data["role"];

if ($staff_role_id == 3 || $staff_role_id == 6) {
    $sql = "SELECT * FROM tickets";
} elseif ($staff_role_id == 4) {
    $sql = "SELECT * FROM tickets WHERE category = 'Lot Owners'";
} elseif ($staff_role_id == 5) {
    $sql = "SELECT * FROM tickets WHERE category = 'Advertisers'";
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
