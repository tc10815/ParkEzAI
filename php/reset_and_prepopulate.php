<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = " ";
$username = " ";
$password = " ";
$dbname = " ";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Disable foreign key checks
$conn->query("SET FOREIGN_KEY_CHECKS = 0;");

// Truncate the tickets table
$truncateTicketsSql = "TRUNCATE TABLE tickets";
$conn->query($truncateTicketsSql);

// Truncate the users table
$truncateUsersSql = "TRUNCATE TABLE users";
$conn->query($truncateUsersSql);

// Re-enable foreign key checks
$conn->query("SET FOREIGN_KEY_CHECKS = 1;");

// Demo users data
$demoUsers = [
    [
        "role_id" => 1,
        "email" => "funky.chicken@example.com",
        "first_name" => "Funky",
        "last_name" => "Chicken",
        "company_name" => "Cluckin' Good",
        "company_address" => "123 Cluck St",
        "state" => "NY",
        "city" => "New York",
        "zip" => "10001",
        "password" => "funky123"
    ],
    [
        "role_id" => 2,
        "email" => "jolly.giraffe@example.com",
        "first_name" => "Jolly",
        "last_name" => "Giraffe",
        "company_name" => "High Heads",
        "company_address" => "456 Tall Ave",
        "state" => "CT",
        "city" => "Hartford",
        "zip" => "06103",
        "password" => "jolly123"
    ],
    [
        "role_id" => 3,
        "email" => "curious.cat@parkez.com",
        "first_name" => "Curious",
        "last_name" => "Cat",
        "company_name" => "Whisker Whispers",
        "company_address" => "789 Purr St",
        "state" => "NJ",
        "city" => "Newark",
        "zip" => "07102",
        "password" => "curious123"
    ],
    [
        "role_id" => 4,
        "email" => "chatty.penguin@parkez.com",
        "first_name" => "Chatty",
        "last_name" => "Penguin",
        "company_name" => "Ice Breakers",
        "company_address" => "321 Waddle Ave",
        "state" => "NY",
        "city" => "Buffalo",
        "zip" => "14201",
        "password" => "chatty123"
    ],
    [
        "role_id" => 5,
        "email" => "happy.hippo@parkez.com",
        "first_name" => "Happy",
        "last_name" => "Hippo",
        "company_name" => "River Riders",
        "company_address" => "654 Splash St",
        "state" => "CT",
        "city" => "Bridgeport",
        "zip" => "06604",
        "password" => "happy123"
    ],
    [
        "role_id" => 6,
        "email" => "lively.lemur@parkez.com",
        "first_name" => "Lively",
        "last_name" => "Lemur",
        "company_name" => "Tree Jumpers",
        "company_address" => "987 Leap Ln",
        "state" => "NJ",
        "city" => "Jersey City",
        "zip" => "07302",
        "password" => "lively123"
    ],
];

// Insert demo users into the users table
$insertSql = "INSERT INTO users (role_id, email, first_name, last_name, company_name, company_address, state, city, zip, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($insertSql);

foreach ($demoUsers as $user) {
    $passwordHash = password_hash($user["password"], PASSWORD_DEFAULT);
    $stmt->bind_param(
        "isssssssss",
        $user["role_id"],
        $user["email"],
        $user["first_name"],
        $user["last_name"],
        $user["company_name"],
        $user["company_address"],
        $user["state"],
        $user["city"],
        $user["zip"],
        $passwordHash
    );
    $stmt->execute();
}

$stmt->close();
$conn->close();

http_response_code(200);
echo json_encode(["message" => "Users table reset and prepopulated with demo users"]);
?>