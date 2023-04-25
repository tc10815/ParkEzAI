<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

$servername = " ";
$username = " ";
$password = " ";
$dbname = " ";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

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