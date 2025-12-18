<?php
/**
* Student Management API
 * 
 * This is a RESTful API that handles all CRUD operations for student management.
 * It uses PDO to interact with a MySQL database.
 * 
 * Database Table Structure (for reference):
 * Table: students
 * Columns:
 *   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
 *   - student_id (VARCHAR(50), UNIQUE)
 *   - name (VARCHAR(100))
 *   - email (VARCHAR(100), UNIQUE)
 *   - password (VARCHAR(255))
 *   - created_at (TIMESTAMP)
 * 
 * HTTP Methods Supported:
 *   - GET
 *   - POST
 *   - PUT
 *   - DELETE
 * 
 * Response Format: JSON
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$_SESSION['user'] = 'admin';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/../../common/Database.php";

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

$rawInput  = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? [];

$studIdParam = $_GET['student_id'] ?? null;
$action = $_GET['action'] ?? null;
$search = $_GET['search'] ?? null;
$sort   = $_GET['sort'] ?? null;
$order  = $_GET['order'] ?? null;

function getStudents($db, $search = null, $sort = null, $order = 'asc') {
    $allowedSort  = ['name', 'student_id', 'email'];
    $allowedOrder = ['asc', 'desc'];

    $sql = "SELECT id, student_id, name, email, created_at FROM students";
    $params = [];

    if (!empty($search)) {
        $sql .= " WHERE name LIKE :search OR student_id LIKE :search OR email LIKE :search";
        $params[':search'] = "%$search%";
    }

    if ($sort && in_array($sort, $allowedSort)) {
        $order = in_array(strtolower($order), $allowedOrder) ? $order : 'asc';
        $sql .= " ORDER BY $sort $order";
    } else {
        $sql .= " ORDER BY name ASC";
    }

    $stmt = $db->prepare($sql);

    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    $stmt->execute();
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendResponse(['success' => true, 'data' => $students]);
}

function getStudentById($db, $studentId) {
    $sql = "SELECT id, student_id, name, email, created_at FROM students WHERE student_id = :student_id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':student_id', $studentId, PDO::PARAM_STR);
    $stmt->execute();

    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($student) {
        sendResponse(['success' => true, 'data' => $student]);
    } else {
        sendResponse(['success' => false, 'message' => 'Student record not found'], 404);
    }
}

function createStudent($db, $data) {
    if (empty($data['student_id']) || empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        sendResponse(['success' => false, 'message' => 'All required fields must be provided'], 400);
    }

    $student_id = sanitizeInput($data['student_id']);
    $name = sanitizeInput($data['name']);
    $email = trim($data['email']);
    $password = $data['password'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(['success'=>false,'message'=>'Email address is invalid'],400);
    }

    $check = $db->prepare("SELECT 1 FROM students WHERE student_id = :id OR email = :email");
    $check->execute([':id'=>$student_id, ':email'=>$email]);
    if ($check->fetchColumn()) {
        sendResponse(['success' => false, 'message' => 'A student with this ID or email already exists'], 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO students (student_id, name, email, password, created_at)
            VALUES (:student_id, :name, :email, :password, NOW())";

    $stmt = $db->prepare($sql);
    $stmt->bindParam(':student_id', $student_id);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);

    $ok = $stmt->execute();

    if ($ok) {
        sendResponse(['success' => true, 'message' => 'Student created'], 201);
    } else {
        sendResponse(['success' => false, 'message' => 'Insert failed'], 500);
    }
}

function updateStudent($db, $data) {
    if (empty($data['student_id'])) {
        sendResponse(['success' => false, 'message' => 'Missing student_id.'], 400);
    }

    $studentId = $data['student_id'];

    $exists = $db->prepare("SELECT 1 FROM students WHERE student_id = :id");
    $exists->execute([':id'=>$studentId]);
    if (!$exists->fetchColumn()) {
        sendResponse(['success' => false, 'message' => 'Student not found'], 404);
    }

    $fields = [];
    $params = [':student_id' => $studentId];

    if (!empty($data['name'])) {
        $fields[] = "name = :name";
        $params[':name'] = sanitizeInput($data['name']);
    }

    if (!empty($data['email'])) {
        if (!validateEmail($data['email'])) {
            sendResponse(['success'=>false,'message'=>'Invalid email'],400);
        }

        $check = $db->prepare("SELECT 1 FROM students WHERE email = :email AND student_id != :id");
        $check->execute([':email'=>$data['email'],':id'=>$studentId]);
        if ($check->fetchColumn()) {
            sendResponse(['success'=>false,'message'=>'Email already exists'],409);
        }

        $fields[] = "email = :email";
        $params[':email'] = $data['email'];
    }

    if (empty($fields)) {
        sendResponse(['success' => false, 'message' => 'No fields to update'], 400);
    }

    $sql = "UPDATE students SET ".implode(", ",$fields)." WHERE student_id = :student_id";
    $stmt = $db->prepare($sql);
    $ok = $stmt->execute($params);

    if ($ok) {
        sendResponse(['success' => true, 'message' => 'Student updated successfully.']);
    } else {
        sendResponse(['success' => false, 'message' => 'Failed to update student.'], 500);
    }
}

function deleteStudent($db, $studentId) {
    if (empty($studentId)) {
        sendResponse(['success' => false, 'message' => 'student_id is required.'], 400);
    }

    $stmt = $db->prepare("SELECT 1 FROM students WHERE student_id = :id");
    $stmt->execute([':id'=>$studentId]);
    if (!$stmt->fetchColumn()) {
        sendResponse(['success'=>false,'message'=>'Student not found'],404);
    }

    $sql = "DELETE FROM students WHERE student_id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $studentId, PDO::PARAM_STR);
    $ok = $stmt->execute();

    if ($ok) {
        sendResponse(['success'=>true,'message'=>'Deleted']);
    } else {
        sendResponse(['success'=>false,'message'=>'Failed to delete'],500);
    }
}

function changePassword($db, $data) {
    if (empty($data['student_id']) || empty($data['current_password']) || empty($data['new_password'])) {
        sendResponse(['success'=>false,'message'=>'Missing fields'],400);
    }

    if (strlen($data['new_password']) < 8) {
        sendResponse(['success'=>false,'message'=>'New password must be at least 8 characters long.'],400);
    }

    $stmt = $db->prepare("SELECT password FROM students WHERE student_id = :id");
    $stmt->execute([':id'=>$data['student_id']]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || !password_verify($data['current_password'], $row['password'])) {
        sendResponse(['success'=>false,'message'=>'Current password is incorrect.'],401);
    }

    $newHash = password_hash($data['new_password'], PASSWORD_DEFAULT);
    $stmt = $db->prepare("UPDATE students SET password = :p WHERE student_id = :id");
    $ok = $stmt->execute([':p'=>$newHash, ':id'=>$data['student_id']]);

    if ($ok) {
        sendResponse(['success'=>true,'message'=>'Password changed successfully']);
    } else {
        sendResponse(['success'=>false,'message'=>'Failed to change password'],500);
    }
}
try {
    if ($method === 'GET') {
        $studIdParam
            ? getStudentById($db, $studIdParam)
            : getStudents($db, $search, $sort, $order);

    } elseif ($method === 'POST') {
        $action === 'change_password'
            ? changePassword($db, $inputData)
            : createStudent($db, $inputData);

    } elseif ($method === 'PUT') {
        updateStudent($db, $inputData);

    } elseif ($method === 'DELETE') {
        deleteStudent($db, $studIdParam ?? $inputData['student_id'] ?? null);

    } else {
        sendResponse(['success'=>false,'message'=>'Method Not Allowed'],405);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error'
    ]);
    exit();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error'
    ]);
    exit();
}


function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

?>
