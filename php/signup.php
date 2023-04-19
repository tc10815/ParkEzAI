<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Replace these with your actual database credentials
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "your_database_name";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);

    $role_id = $input["role_id"];
    $email = $input["email"];
    $first_name = $input["first_name"];
    $last_name = $input["last_name"];
    $company_name = $input["company_name"];
    $company_address = $input["company_address"];
    $state = $input["state"];
    $city = $input["city"];
    $zip = $input["zip"];
    $password = password_hash($input["password"], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (role_id, email, first_name, last_name, company_name, company_address, state, city, zip, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssssssss", $role_id, $email, $first_name, $last_name, $company_name, $company_address, $state, $city, $zip, $password);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "User created successfully"]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Unable to create user"]);
    }

    $stmt->close();
    $conn->close();
}
?>
