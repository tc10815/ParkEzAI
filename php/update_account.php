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

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"];
$first_name = $data["first_name"];
$last_name = $data["last_name"];
$email = $data["email"];
$address = $data["address"];
$business = $data["business"];
$password = $data["password"];

$sql = "SELECT role_id, password FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    if (password_verify($password, $user["password"])) {
        $sql = "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $first_name, $last_name, $email, $user_id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $success = true;
        } else {
            $success = false;
        }

        if (!in_array($user["role_id"], [3, 4, 5, 6])) {
            $sql = "UPDATE users SET company_address = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("si", $address, $user_id);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                $success = true;
            }

            if ($business) {
                $sql = "UPDATE users SET company_name = ? WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("si", $business, $user_id);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    $success = true;
                }
            }
        }

        if ($success) {
            echo json_encode(["success" => true, "message" => "Account updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "No changes were made"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}
$stmt->close();
$conn->close();
?>