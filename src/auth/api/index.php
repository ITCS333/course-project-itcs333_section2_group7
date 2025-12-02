<?php
/**
 * Authentication Handler for Login Form
 * 
 * This PHP script handles user authentication via POST requests from the Fetch API.
 * It validates credentials against a MySQL database using PDO,
 * creates sessions, and returns JSON responses.
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode(['success' => false, 'message' => 'Invalid request method. Only POST allowed.']);
    exit();
}

$rawData = file_get_contents('php://input');
$postData = json_decode($rawData, true);

if (!isset($postData['email']) || !isset($postData['password'])) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Email and password are both required.']);
    exit();
}
$userEmail = trim($postData['email']);
$userPassword = $postData['password']; 

if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Email address format is invalid.']);
    exit();
}

if (strlen($userPassword) < 8) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters.']);
    exit();
}
require_once __DIR__ . "/../../common/db.php";

try {
    $database = new Database();
    $db = $database->getConnection();
    $sql = "SELECT id, student_id, name, email, password FROM students WHERE email = :user_email";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':user_email', $userEmail, PDO::PARAM_STR);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($userPassword, $user['password'])) {
        $_SESSION['user_id']    = $user['id'];
        $_SESSION['user_name']  = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['logged_in']  = true;

        $response = [
            'success' => true,
            'message' => 'Authentication successful',
            'user' => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email']
            ]
        ];


        http_response_code(200);
        echo json_encode($response);
        exit();

    } else {

        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials'
        ]);
        exit();
    }

} catch (PDOException $e) {


    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database operation failed'
    ]);
    exit();
} catch (Exception $e) {
    error_log('General error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected server error occurred'
    ]);
    exit();


}
?>