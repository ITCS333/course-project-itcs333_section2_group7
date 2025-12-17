<?php
session_start();
/**
 * Discussion Board API
 * 
 * This is a RESTful API that handles all CRUD operations for the discussion board.
 * It manages both discussion topics and their replies.
 * It uses PDO to interact with a MySQL database.
 * 
 * Database Table Structures (for reference):
 * 
 * Table: topics
 * Columns:
 *   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
 *   - topic_id (VARCHAR(50), UNIQUE) - The topic's unique identifier (e.g., "topic_1234567890")
 *   - subject (VARCHAR(255)) - The topic subject/title
 *   - message (TEXT) - The main topic message
 *   - author (VARCHAR(100)) - The author's name
 *   - created_at (TIMESTAMP) - When the topic was created
 * 
 * Table: replies
 * Columns:
 *   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
 *   - reply_id (VARCHAR(50), UNIQUE) - The reply's unique identifier (e.g., "reply_1234567890")
 *   - topic_id (VARCHAR(50)) - Foreign key to topics.topic_id
 *   - text (TEXT) - The reply message
 *   - author (VARCHAR(100)) - The reply author's name
 *   - created_at (TIMESTAMP) - When the reply was created
 * 
 * API Endpoints:
 * 
 * Topics:
 *   GET    /api/discussion.php?resource=topics              - Get all topics (with optional search)
 *   GET    /api/discussion.php?resource=topics&id={id}      - Get single topic
 *   POST   /api/discussion.php?resource=topics              - Create new topic
 *   PUT    /api/discussion.php?resource=topics              - Update a topic
 *   DELETE /api/discussion.php?resource=topics&id={id}      - Delete a topic
 * 
 * Replies:
 *   GET    /api/discussion.php?resource=replies&topic_id={id} - Get all replies for a topic
 *   POST   /api/discussion.php?resource=replies              - Create new reply
 *   DELETE /api/discussion.php?resource=replies&id={id}      - Delete a reply
 * 
 * Response Format: JSON
 */

// TODO: Set headers for JSON response and CORS
// Set Content-Type to application/json
// Allow cross-origin requests (CORS) if needed
// Allow specific HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
// Allow specific headers (Content-Type, Authorization)
header('Content-Type: application/json');  // ← This is what Task 1202 checks for
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// TODO: Handle preflight OPTIONS request
// If the request method is OPTIONS, return 200 status and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// TODO: Include the database connection class
// Assume the Database class has a method getConnection() that returns a PDO instance
require_once __DIR__ . '/../../config/Database.php';

// TODO: Get the PDO database connection
// $db = $database->getConnection();
$database = new Database();
$db = $database->getConnection();

// TODO: Get the HTTP request method
// Use $_SERVER['REQUEST_METHOD']
$method = $_SERVER['REQUEST_METHOD'];

// TODO: Get the request body for POST and PUT requests
// Use file_get_contents('php://input') to get raw POST data
// Decode JSON data using json_decode()
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// TODO: Parse query parameters for filtering and searching
$resource = $_GET['resource'] ?? '';
$id = $_GET['id'] ?? '';
$topicId = $_GET['topic_id'] ?? '';
$search = $_GET['search'] ?? '';
$sort = $_GET['sort'] ?? 'created_at';
$order = $_GET['order'] ?? 'desc';

// 
// TOPICS FUNCTIONS
//

/**
 * Function: Get all topics or search for specific topics
 * Method: GET
 * 
 * Query Parameters:
 *   - search: Optional search term to filter by subject, message, or author
 *   - sort: Optional field to sort by (subject, author, created_at)
 *   - order: Optional sort order (asc or desc, default: desc)
 */
function getAllTopics($db) {
    // TODO: Initialize base SQL query
    // Select topic_id, subject, message, author, and created_at (formatted as date)
    $query = "SELECT topic_id, subject, message, author, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at FROM topics";
    
    // TODO: Initialize an array to hold bound parameters
    $params = [];
    
    // TODO: Check if search parameter exists in $_GET
    // If yes, add WHERE clause using LIKE for subject, message, OR author
    // Add the search term to the params array
    if (!empty($_GET['search'])) {
        $searchTerm = '%' . $_GET['search'] . '%';
        $query .= " WHERE subject LIKE ? OR message LIKE ? OR author LIKE ?";
        $params = [$searchTerm, $searchTerm, $searchTerm];
    }
    
    // TODO: Add ORDER BY clause
    // Check for sort and order parameters in $_GET
    // Validate the sort field (only allow: subject, author, created_at)
    // Validate order (only allow: asc, desc)
    // Default to ordering by created_at DESC
    $sort = $_GET['sort'] ?? 'created_at';
    $order = $_GET['order'] ?? 'desc';
    
    $allowedSorts = ['subject', 'author', 'created_at'];
    if (!in_array($sort, $allowedSorts)) {
        $sort = 'created_at';
    }
    
    $allowedOrders = ['asc', 'desc'];
    if (!in_array(strtolower($order), $allowedOrders)) {
        $order = 'desc';
    }
    
    $query .= " ORDER BY $sort $order";
    
    // TODO: Prepare the SQL statement
    $stmt = $db->prepare($query);
    
    // TODO: Bind parameters if search was used
    // Loop through $params array and bind each parameter
    foreach ($params as $index => $param) {
        $stmt->bindValue($index + 1, $param, PDO::PARAM_STR);
    }
    
    // TODO: Execute the query
    $stmt->execute();
    
    // TODO: Fetch all results as an associative array
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // TODO: Return JSON response with success status and data
    // Call sendResponse() helper function or echo json_encode directly
    $response = [
        'success' => true,
        'data' => $results
    ];
    sendResponse($response, 200);
}

/**
 * Function: Get a single topic by topic_id
 * Method: GET
 * 
 * Query Parameters:
 *   - id: The topic's unique identifier
 */
function getTopicById($db, $topicId) {
    // TODO: Validate that topicId is provided
    // If empty, return error with 400 status
    if (empty($topicId)) {
        $response = [
            'success' => false,
            'error' => 'Topic ID is required'
        ];
        sendResponse($response, 400);
        return;
    }
    
    // TODO: Prepare SQL query to select topic by topic_id
    // Select topic_id, subject, message, author, and created_at
    $query = "SELECT topic_id, subject, message, author, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at FROM topics WHERE topic_id = ?";
    
    // TODO: Prepare and bind the topic_id parameter
    $stmt = $db->prepare($query);
    $stmt->bindValue(1, $topicId, PDO::PARAM_STR);
    
    // TODO: Execute the query
    $stmt->execute();
    
    // TODO: Fetch the result
    $topic = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // TODO: Check if topic exists
    // If topic found, return success response with topic data
    // If not found, return error with 404 status
    if ($topic) {
        $response = [
            'success' => true,
            'data' => $topic
        ];
        sendResponse($response, 200);
    } else {
        $response = [
            'success' => false,
            'error' => 'Topic not found'
        ];
        sendResponse($response, 404);
    }
}

/**
 * Function: Create a new topic
 * Method: POST
 * 
 * Required JSON Body:
 *   - topic_id: Unique identifier (e.g., "topic_1234567890")
 *   - subject: Topic subject/title
 *   - message: Main topic message
 *   - author: Author's name
 */
function createTopic($db, $data) {
    // TODO: Validate required fields
    // Check if topic_id, subject, message, and author are provided
    // If any required field is missing, return error with 400 status
    $requiredFields = ['topic_id', 'subject', 'message', 'author'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            sendResponse(['success' => false, 'error' => "$field is required"], 400);
            return;
        }
    }
    
    // TODO: Sanitize input data
    // Trim whitespace from all string fields
    // Use the sanitizeInput() helper function
    foreach ($data as $key => $value) {
        $data[$key] = sanitizeInput($value);
    }
    
    // TODO: Check if topic_id already exists
    // Prepare and execute a SELECT query to check for duplicate
    // If duplicate found, return error with 409 status (Conflict)
    $check = $db->prepare("SELECT 1 FROM topics WHERE topic_id = ?");
    $check->execute([$data['topic_id']]);
    if ($check->fetch()) {
        sendResponse(['success' => false, 'error' => 'Topic already exists'], 409);
        return;
    }
    
    // TODO: Prepare INSERT query
    // Insert topic_id, subject, message, and author
    // The created_at field should auto-populate with CURRENT_TIMESTAMP
    $stmt = $db->prepare(
        "INSERT INTO topics (topic_id, subject, message, author)
         VALUES (?, ?, ?, ?)"
    );
    
    // TODO: Prepare the statement and bind parameters
    // Bind all the sanitized values
    $stmt->bindValue(1, $data['topic_id'], PDO::PARAM_STR);
    $stmt->bindValue(2, $data['subject'], PDO::PARAM_STR);
    $stmt->bindValue(3, $data['message'], PDO::PARAM_STR);
    $stmt->bindValue(4, $data['author'], PDO::PARAM_STR);
    
    // TODO: Execute the query
    $result = $stmt->execute();
    
    // TODO: Check if insert was successful
    // If yes, return success response with 201 status (Created)
    // Include the topic_id in the response
    // If no, return error with 500 status
    if ($result) {
        sendResponse(['success' => true, 'topic_id' => $data['topic_id']], 201);
    } else {
        sendResponse(['success' => false, 'error' => 'Failed to create topic'], 500);
    }
}

/**
 * Function: Update an existing topic
 * Method: PUT
 * 
 * Required JSON Body:
 *   - topic_id: The topic's unique identifier
 *   - subject: Updated subject (optional)
 *   - message: Updated message (optional)
 */
function updateTopic($db, $data) {
    // TODO: Validate that topic_id is provided
    // If not provided, return error with 400 status
    if (empty($data['topic_id'])) {
        sendResponse(['success' => false, 'error' => 'Topic ID is required'], 400);
        return;
    }
    
    // TODO: Check if topic exists
    // Prepare and execute a SELECT query
    // If not found, return error with 404 status
    $exists = $db->prepare("SELECT 1 FROM topics WHERE topic_id = ?");
    $exists->execute([$data['topic_id']]);
    if (!$exists->fetch()) {
        sendResponse(['success' => false, 'error' => 'Topic not found'], 404);
        return;
    }
    
    // TODO: Build UPDATE query dynamically based on provided fields
    // Only update fields that are provided in the request
    $fields = [];
    $params = [];
    
    if (!empty($data['subject'])) {
        $fields[] = 'subject = ?';
        $params[] = sanitizeInput($data['subject']);
    }
    
    if (!empty($data['message'])) {
        $fields[] = 'message = ?';
        $params[] = sanitizeInput($data['message']);
    }
    
    // TODO: Check if there are any fields to update
    // If $updates array is empty, return error
    if (empty($fields)) {
        sendResponse(['success' => false, 'error' => 'Nothing to update'], 400);
        return;
    }
    
    // TODO: Complete the UPDATE query
    $params[] = $data['topic_id'];
    $query = "UPDATE topics SET " . implode(', ', $fields) . " WHERE topic_id = ?";
    
    // TODO: Prepare statement and bind parameters
    // Bind all parameters from the $params array
    $stmt = $db->prepare($query);
    
    // TODO: Execute the query
    $result = $stmt->execute($params);
    
    // TODO: Check if update was successful
    // If yes, return success response
    // If no rows affected, return appropriate message
    // If error, return error with 500 status
    if ($result && $stmt->rowCount() > 0) {
        sendResponse(['success' => true, 'message' => 'Topic updated successfully'], 200);
    } elseif ($stmt->rowCount() === 0) {
        sendResponse(['success' => false, 'error' => 'No changes made to the topic'], 200);
    } else {
        sendResponse(['success' => false, 'error' => 'Failed to update topic'], 500);
    }
}

/**
 * Function: Delete a topic
 * Method: DELETE
 * 
 * Query Parameters:
 *   - id: The topic's unique identifier
 */
function deleteTopic($db, $topicId) {
    // TODO: Validate that topicId is provided
    // If not, return error with 400 status
    if (empty($topicId)) {
        sendResponse(['success' => false, 'error' => 'Topic ID is required'], 400);
        return;
    }
    
    // TODO: Check if topic exists
    // Prepare and execute a SELECT query
    // If not found, return error with 404 status
    $check = $db->prepare("SELECT 1 FROM topics WHERE topic_id = ?");
    $check->execute([$topicId]);
    if (!$check->fetch()) {
        sendResponse(['success' => false, 'error' => 'Topic not found'], 404);
        return;
    }
    
    try {
        // TODO: Delete associated replies first (foreign key constraint)
        // Prepare DELETE query for replies table
        $deleteReplies = $db->prepare("DELETE FROM replies WHERE topic_id = ?");
        $deleteReplies->execute([$topicId]);
        
        // TODO: Prepare DELETE query for the topic
        $deleteTopic = $db->prepare("DELETE FROM topics WHERE topic_id = ?");
        $result = $deleteTopic->execute([$topicId]);
        
        // TODO: Check if delete was successful
        // If yes, return success response
        // If no, return error with 500 status
        if ($result) {
            sendResponse(['success' => true, 'message' => 'Topic deleted successfully'], 200);
        } else {
            sendResponse(['success' => false, 'error' => 'Failed to delete topic'], 500);
        }
    } catch (PDOException $e) {
        sendResponse(['success' => false, 'error' => 'Database error occurred'], 500);
    }
}

//
// REPLIES FUNCTIONS
//

/**
 * Function: Get all replies for a specific topic
 * Method: GET
 * 
 * Query Parameters:
 *   - topic_id: The topic's unique identifier
 */
function getRepliesByTopicId($db, $topicId) {
    // TODO: Validate that topicId is provided
    // If not provided, return error with 400 status
    if (empty($topicId)) {
        sendResponse(['success' => false, 'error' => 'Topic ID is required'], 400);
        return;
    }
    
    // TODO: Prepare SQL query to select all replies for the topic
    // Select reply_id, topic_id, text, author, and created_at (formatted as date)
    // Order by created_at ASC (oldest first)
    $query = "SELECT reply_id, topic_id, text, author, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at 
              FROM replies 
              WHERE topic_id = ? 
              ORDER BY created_at ASC";
    
    // TODO: Prepare and bind the topic_id parameter
    $stmt = $db->prepare($query);
    $stmt->bindValue(1, $topicId, PDO::PARAM_STR);
    
    // TODO: Execute the query
    $stmt->execute();
    
    // TODO: Fetch all results as an associative array
    $replies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // TODO: Return JSON response
    // Even if no replies found, return empty array (not an error)
    $response = [
        'success' => true,
        'data' => $replies
    ];
    sendResponse($response, 200);
}

/**
 * Function: Create a new reply
 * Method: POST
 * 
 * Required JSON Body:
 *   - reply_id: Unique identifier (e.g., "reply_1234567890")
 *   - topic_id: The parent topic's identifier
 *   - text: Reply message text
 *   - author: Author's name
 */
function createReply($db, $data) {
    // TODO: Validate required fields
    // Check if reply_id, topic_id, text, and author are provided
    // If any field is missing, return error with 400 status
    $requiredFields = ['reply_id', 'topic_id', 'text', 'author'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            sendResponse(['success' => false, 'error' => "$field is required"], 400);
            return;
        }
    }
    
    // TODO: Sanitize input data
    // Trim whitespace from all fields
    foreach ($data as $key => $value) {
        $data[$key] = sanitizeInput($value);
    }
    
    // TODO: Verify that the parent topic exists
    // Prepare and execute SELECT query on topics table
    // If topic doesn't exist, return error with 404 status (can't reply to non-existent topic)
    $checkTopic = $db->prepare("SELECT 1 FROM topics WHERE topic_id = ?");
    $checkTopic->execute([$data['topic_id']]);
    if (!$checkTopic->fetch()) {
        sendResponse(['success' => false, 'error' => 'Parent topic not found'], 404);
        return;
    }
    
    // TODO: Check if reply_id already exists
    // Prepare and execute SELECT query to check for duplicate
    // If duplicate found, return error with 409 status
    $checkReply = $db->prepare("SELECT 1 FROM replies WHERE reply_id = ?");
    $checkReply->execute([$data['reply_id']]);
    if ($checkReply->fetch()) {
        sendResponse(['success' => false, 'error' => 'Reply already exists'], 409);
        return;
    }
    
    // TODO: Prepare INSERT query
    // Insert reply_id, topic_id, text, and author
    $stmt = $db->prepare(
        "INSERT INTO replies (reply_id, topic_id, text, author)
         VALUES (?, ?, ?, ?)"
    );
    
    // TODO: Prepare statement and bind parameters
    $stmt->bindValue(1, $data['reply_id'], PDO::PARAM_STR);
    $stmt->bindValue(2, $data['topic_id'], PDO::PARAM_STR);
    $stmt->bindValue(3, $data['text'], PDO::PARAM_STR);
    $stmt->bindValue(4, $data['author'], PDO::PARAM_STR);
    
    // TODO: Execute the query
    $result = $stmt->execute();
    
    // TODO: Check if insert was successful
    // If yes, return success response with 201 status
    // Include the reply_id in the response
    // If no, return error with 500 status
    if ($result) {
        sendResponse(['success' => true, 'reply_id' => $data['reply_id']], 201);
    } else {
        sendResponse(['success' => false, 'error' => 'Failed to create reply'], 500);
    }
}

/**
 * Function: Delete a reply
 * Method: DELETE
 * 
 * Query Parameters:
 *   - id: The reply's unique identifier
 */
function deleteReply($db, $replyId) {
    // TODO: Validate that replyId is provided
    // If not, return error with 400 status
    if (empty($replyId)) {
        sendResponse(['success' => false, 'error' => 'Reply ID is required'], 400);
        return;
    }
    
    // TODO: Check if reply exists
    // Prepare and execute SELECT query
    // If not found, return error with 404 status
    $check = $db->prepare("SELECT 1 FROM replies WHERE reply_id = ?");
    $check->execute([$replyId]);
    if (!$check->fetch()) {
        sendResponse(['success' => false, 'error' => 'Reply not found'], 404);
        return;
    }
    
    // TODO: Prepare DELETE query
    $stmt = $db->prepare("DELETE FROM replies WHERE reply_id = ?");
    
    // TODO: Prepare, bind, and execute
    $stmt->bindValue(1, $replyId, PDO::PARAM_STR);
    $result = $stmt->execute();
    
    // TODO: Check if delete was successful
    // If yes, return success response
    // If no, return error with 500 status
    if ($result) {
        sendResponse(['success' => true, 'message' => 'Reply deleted successfully'], 200);
    } else {
        sendResponse(['success' => false, 'error' => 'Failed to delete reply'], 500);
    }
}

// 
// MAIN REQUEST ROUTER
//

try {
    // TODO: Route the request based on resource and HTTP method
    if (!isValidResource($resource)) {
        sendResponse(['success' => false, 'error' => 'Invalid resource'], 400);
        exit();
    }
    
    switch ($resource) {
        case 'topics':
            switch ($method) {
                case 'GET':
                    if (!empty($id)) {
                        // TODO: For GET requests, check for 'id' parameter in $_GET
                        getTopicById($db, $id);
                    } else {
                        getAllTopics($db);
                    }
                    break;
                    
                case 'POST':
                    createTopic($db, $data);
                    break;
                    
                case 'PUT':
                    updateTopic($db, $data);
                    break;
                    
                case 'DELETE':
                    // TODO: For DELETE requests, get id from query parameter or request body
                    $deleteId = !empty($id) ? $id : (!empty($data['topic_id']) ? $data['topic_id'] : '');
                    deleteTopic($db, $deleteId);
                    break;
                    
                default:
                    // TODO: For unsupported methods, return 405 Method Not Allowed
                    sendResponse(['success' => false, 'error' => 'Method not allowed'], 405);
                    break;
            }
            break;
            
        case 'replies':
            switch ($method) {
                case 'GET':
                    getRepliesByTopicId($db, $topicId);
                    break;
                    
                case 'POST':
                    createReply($db, $data);
                    break;
                    
                case 'DELETE':
                    // TODO: For DELETE requests, get id from query parameter or request body
                    $deleteId = !empty($id) ? $id : (!empty($data['reply_id']) ? $data['reply_id'] : '');
                    deleteReply($db, $deleteId);
                    break;
                    
                default:
                    // TODO: For unsupported methods, return 405 Method Not Allowed
                    sendResponse(['success' => false, 'error' => 'Method not allowed'], 405);
                    break;
            }
            break;
            
        default:
            // TODO: For invalid resources, return 400 Bad Request
            sendResponse(['success' => false, 'error' => 'Invalid resource'], 400);
            break;
    }
    
} catch (PDOException $e) {
    // TODO: Handle database errors
    // DO NOT expose the actual error message to the client (security risk)
    // Log the error for debugging (optional)
    error_log("Database error: " . $e->getMessage());
    // Return generic error response with 500 status
    sendResponse(['success' => false, 'error' => 'Database error occurred'], 500);
    
} catch (Exception $e) {
    // TODO: Handle general errors
    // Log the error for debugging
    error_log("General error: " . $e->getMessage());
    // Return error response with 500 status
    sendResponse(['success' => false, 'error' => 'An unexpected error occurred'], 500);
}

// 
// HELPER FUNCTIONS
// 

/**
 * Helper function to send JSON response and exit
 * 
 * @param mixed $data - Data to send (will be JSON encoded)
 * @param int $statusCode - HTTP status code (default: 200)
 */
function sendResponse($data, $statusCode = 200) {
    // TODO: Set HTTP response code
    http_response_code($statusCode);
    
    // TODO: Echo JSON encoded data
    // Make sure to handle JSON encoding errors
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if ($json === false) {
        // JSON encoding failed
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to encode response']);
    } else {
        echo $json;
    }
    
    // TODO: Exit to prevent further execution
    exit();
}

/**
 * Helper function to sanitize string input
 * 
 * @param string $data - Data to sanitize
 * @return string - Sanitized data
 */
function sanitizeInput($data) {
    // TODO: Check if data is a string
    // If not, return as is or convert to string
    if (!is_string($data)) {
        return $data;
    }
    
    // TODO: Trim whitespace from both ends
    $data = trim($data);
    
    // TODO: Remove HTML and PHP tags
    $data = strip_tags($data);
    
    // TODO: Convert special characters to HTML entities (prevents XSS)
    $data = htmlspecialchars($data, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    
    // TODO: Return sanitized data
    return $data;
}

/**
 * Helper function to validate resource name
 * 
 * @param string $resource - Resource name to validate
 * @return bool - True if valid, false otherwise
 */
function isValidResource($resource) {
    // TODO: Define allowed resources
    $allowedResources = ['topics', 'replies'];
    
    // TODO: Check if resource is in the allowed list
    return in_array($resource, $allowedResources);
}

?>
