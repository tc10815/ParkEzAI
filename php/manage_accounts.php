<?php
header("Access-Control-Allow-Origin: *");
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

$sql = "SELECT id, first_name, last_name, email, role_id FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    $response = ["success" => true, "users" => $users];
} else {
    $response = ["success" => false, "message" => "No users found"];
}

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
