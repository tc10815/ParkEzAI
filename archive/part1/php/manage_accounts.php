<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);


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
