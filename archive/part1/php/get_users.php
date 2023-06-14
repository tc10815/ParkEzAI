<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);


if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT * FROM users";
    $result = $conn->query($sql);

    $users = array();
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    http_response_code(200);
    echo json_encode($users);
    $conn->close();
}
?>