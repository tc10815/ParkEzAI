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
        "company_name" => "",
        "company_address" => "",
        "state" => "",
        "city" => "",
        "zip" => "",
        "password" => "curious123"
    ],
    [
        "role_id" => 4,
        "email" => "chatty.penguin@parkez.com",
        "first_name" => "Chatty",
        "last_name" => "Penguin",
        "company_name" => "",
        "company_address" => "",
        "state" => "",
        "city" => "",
        "zip" => "",
        "password" => "chatty123"
    ],
    [
        "role_id" => 5,
        "email" => "happy.hippo@parkez.com",
        "first_name" => "Happy",
        "last_name" => "Hippo",
        "company_name" => "",
        "company_address" => "",
        "state" => "",
        "city" => "",
        "zip" => "",
        "password" => "happy123"
    ],
    [
        "role_id" => 6,
        "email" => "lively.lemur@parkez.com",
        "first_name" => "Lively",
        "last_name" => "Lemur",
        "company_name" => "",
        "company_address" => "",
        "state" => "",
        "city" => "",
        "zip" => "",
        "password" => "lively123"
    ],
];

$demoTickets = [
    [
        "user_id" => 1,
        "subject" => "Image recognition issue",
        "description" => "One spot is recognized inconsistantly.",
        "status" => "Open",
        "priority" => "Low",
        "category" => "Lot Owners"
    ],
    [
        "user_id" => 1,
        "subject" => "Need security data fast",
        "description" => "A car was highjacked in my lot, I need raw data.",
        "status" => "Open",
        "priority" => "Urgent",
        "category" => "Lot Owners"
    ],
    [
        "user_id" => 1,
        "subject" => "Remove some footage",
        "description" => "I accidently recorded myself in the parking lot going someplace with my wifes sister. Can you help me delete the footage.",
        "status" => "Resolved",
        "priority" => "High",
        "category" => "Lot Owners"
    ],
    [
        "user_id" => 1,
        "subject" => "Car occupancy off by 1",
        "description" => "It always says there's 1 extra car in the lot. Fix it.",
        "status" => "Open",
        "priority" => "Low",
        "category" => "Lot Owners"
    ],
    [
        "user_id" => 2,
        "subject" => "Payment issue",
        "description" => "I was double billed for my Ad and need a refund.",
        "status" => "In Progress",
        "priority" => "Medium",
        "category" => "Advertisers"
    ],
    [
        "user_id" => 2,
        "subject" => "Posting image is not working",
        "description" => "ParkEz does not support my file format.",
        "status" => "Resolved",
        "priority" => "Low",
        "category" => "Advertisers"
    ],
    [
        "user_id" => 2,
        "subject" => "Discount not applied",
        "description" => "I thought I was supposed to get 20% off my account... refund the difference!",
        "status" => "Closed",
        "priority" => "High",
        "category" => "Advertisers"
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
$insertTicketSql = "INSERT INTO tickets (user_id, subject, description, status, priority, category) VALUES (?, ?, ?, ?, ?, ?)";
$stmtTicket = $conn->prepare($insertTicketSql);

foreach ($demoTickets as $ticket) {
    $stmtTicket->bind_param(
        "isssss",
        $ticket["user_id"],
        $ticket["subject"],
        $ticket["description"],
        $ticket["status"],
        $ticket["priority"],
        $ticket["category"]
    );
    $stmtTicket->execute();
}

$stmt->close();
$conn->close();

http_response_code(200);
echo json_encode(["message" => "Users table reset and prepopulated with demo users"]);
?>