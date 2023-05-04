<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Database information
$servername = "localhost";
$username = "parkez";
$password = "";
$dbname = "ParkEz";

// Function to establish a database connection
function connectDatabase($servername, $username, $password, $dbname) {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }
    return $conn;
}

// JWT library and secret key
require 'vendor/autoload.php';
use Firebase\JWT\JWT;
$secretKey = "";
