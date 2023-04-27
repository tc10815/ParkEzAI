<?php
require 'config.php';
use Firebase\JWT\JWT;
$conn = connectDatabase($servername, $username, $password, $dbname);


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

    $userCountSql = "SELECT COUNT(*) AS user_count FROM users";
    $userCountResult = $conn->query($userCountSql);
    $userCountRow = $userCountResult->fetch_assoc();
    $userCount = $userCountRow["user_count"];

    $emailCheckSql = "SELECT COUNT(*) AS email_count FROM users WHERE email = ?";
    $emailCheckStmt = $conn->prepare($emailCheckSql);
    $emailCheckStmt->bind_param("s", $email);
    $emailCheckStmt->execute();
    $emailCheckResult = $emailCheckStmt->get_result();
    $emailCheckRow = $emailCheckResult->fetch_assoc();
    $emailCount = $emailCheckRow["email_count"];
    $emailCheckStmt->close();

    if ($userCount >= 10) {
        http_response_code(400);
        echo json_encode(["error" => "Unable to create user: Maximum number of users (10) reached"]);
    } elseif ($emailCount > 0) {
        http_response_code(400);
        echo json_encode(["error" => "Unable to create user: Email already exists"]);
    } else {
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
    }

    $conn->close();
}
?>
