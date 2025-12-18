<?php

session_start();

// Other existing code goes here...
/**
 * Assignment Management API
 * 
 * This is a RESTful API that handles all CRUD operations for course assignments
 * and their associated discussion comments.
 * It uses PDO to interact with a MySQL database.
 * 
 * Database Table Structures (for reference):
 * 
 * Table: assignments
 * Columns:
 *   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
 *   - title (VARCHAR(200))
 *   - description (TEXT)
 *   - due_date (DATE)
 *   - files (TEXT)
 *   - created_at (TIMESTAMP)
 *   - updated_at (TIMESTAMP)
 * 
 * Table: comments
 * Columns:
 *   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
 *   - assignment_id (VARCHAR(50), FOREIGN KEY)
 *   - author (VARCHAR(100))
 *   - text (TEXT)
 *   - created_at (TIMESTAMP)
 * 
 * HTTP Methods Supported:
 *   - GET: Retrieve assignment(s) or comment(s)
 *   - POST: Create a new assignment or comment
 *   - PUT: Update an existing assignment
 *   - DELETE: Delete an assignment or comment
 * 
 * Response Format: JSON
 */

// ============================================================================
// HEADERS AND CORS CONFIGURATION
// ============================================================================

// TODO: Set Content-Type header to application/json
$_SESSION['user'] = $_SESSION['user'] ?? 'guest';

header('Content-Type: application/json');

// TODO: Set CORS headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With');

// TODO: Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

// TODO: Include the database connection class
$dbHost = 'localhost';
$dbName = 'course_project_db';
$dbUser = 'root';
$dbPass = '';

// TODO: Create database connection
try {
    $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);

    // TODO: Set PDO to throw exceptions on errors
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    sendResponse(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
}

// ============================================================================
// REQUEST PARSING
// ============================================================================

// TODO: Get the HTTP request method
$method = $_SERVER['REQUEST_METHOD'];

// TODO: Get the request body for POST and PUT requests
$input = json_decode(file_get_contents('php://input'), true);
if($input === null&&($method ==='POST'||$method==='PUT')){
    $input=$_POST;
}
// TODO: Parse query parameters
$resource=$_GET['resource'] ?? '';
$assignmentId=$_GET['id'] ?? '';
$commentId=$_GET['comment_id'] ?? '';
$search=$_GET['search'] ?? '';
$sort=$_GET['sort'] ?? 'created_at';
$order=$_GET['order'] ?? 'desc';
$assignmentIdForComments=$_GET['assignment_id'] ?? ''; 

// ============================================================================
// ASSIGNMENT CRUD FUNCTIONS
// ============================================================================

/**
 * Function: Get all assignments
 * Method: GET
 * Endpoint: ?resource=assignments
 * 
 * Query Parameters:
 *   - search: Optional search term to filter by title or description
 *   - sort: Optional field to sort by (title, due_date, created_at)
 *   - order: Optional sort order (asc or desc, default: asc)
 * 
 * Response: JSON array of assignment objects
 */
function getAllAssignments($db) {
    // TODO: Start building the SQL query
    $sql = "SELECT * FROM assignments WHERE 1=1";
    $params = [];
    // TODO: Check if 'search' query parameter exists in $_GET
    if (!empty($_GET['search'])) {
        $sql .= " AND (title LIKE :search OR description LIKE :search)";
        $params[':search'] = '%' . $_GET['search'] . '%';
    }
    
    // TODO: Check if 'sort' and 'order' query parameters exist
    $allowedSortFields = ['title', 'due_date', 'created_at', 'updated_at'];
    $allowedorders = ['asc', 'desc'];

    if(in_array($sort,$allowedSortFields)&&in_array(strtolower($order))){
        $sql .= " ORDER BY $sort $order" :
    } else {
        $sql .= " ORDER BY created_at DESC";
    }
    // TODO: Prepare the SQL statement using $db->prepare()
    $stmt = $db->prepare($sql);
    
    // TODO: Bind parameters if search is used
    if (!empty($search)) {
    
            $stmt->bindValue('search',$search,PDO::PARAM_STR);
    }
    
    // TODO: Execute the prepared statement
    $stmt->execute();
    
    // TODO: Fetch all results as associative array
    $assignments = $stmt->fetchAll();
    
    // TODO: For each assignment, decode the 'files' field from JSON to array
    foreach ($assignments as &$assignment) {
        $assignment['files'] = json_decode($assignment['files'], true) ?: [];
    }else{
        $assignment['files']=[];
    }

    // TODO: Return JSON response
    return json_encode($assignments);
}


/**
 * Function: Get a single assignment by ID
 * Method: GET
 * Endpoint: ?resource=assignments&id={assignment_id}
 * 
 * Query Parameters:
 *   - id: The assignment ID (required)
 * 
 * Response: JSON object with assignment details
 */
function getAssignmentById($db, $assignmentId) {
    // TODO: Validate that $assignmentId is provided and not empty
    if (empty($assignmentId)) {
        sendResponse(['error' => 'Assignment ID is required'], 400);
    }
    
    // TODO: Prepare SQL query to select assignment by id
    $sql = "SELECT * FROM assignments WHERE id = :id";
    $stmt = $db->prepare($sql);
    
    // TODO: Bind the :id parameter
    $stmt->bindParam(':id', $assignmentId, PDO::PARAM_INT);
    
    // TODO: Execute the statement
    $stmt->execute();
    
    // TODO: Fetch the result as associative array
    $assignment = $stmt->fetch();
    
    // TODO: Check if assignment was found
    if (!$assignment) {
        sendResponse(['error' => 'Assignment not found'], 404);
    }

    // TODO: Decode the 'files' field from JSON to array
    if (!empty($assignment['files'])) {
        $assignment['files'] = json_decode($assignment['files'], true) ?: [];
    } else {
        $assignment['files'] = [];
    }

    
    
    // TODO: Return success response with assignment data
    sendResponse($assignment);
}


/**
 * Function: Create a new assignment
 * Method: POST
 * Endpoint: ?resource=assignments
 * 
 * Required JSON Body:
 *   - title: Assignment title (required)
 *   - description: Assignment description (required)
 *   - due_date: Due date in YYYY-MM-DD format (required)
 *   - files: Array of file URLs/paths (optional)
 * 
 * Response: JSON object with created assignment data
 */
function createAssignment($db, $data) {
    // TODO: Validate required fields
    $requiredFields = ['title', 'description', 'due_date'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            sendResponse(['error' => "$field is required"], 400);
            return;
        }
    }
    
    // TODO: Sanitize input data
    $title = sanitizeInput($data['title']);
    $description = sanitizeInput($data['description']);
    $due_date = sanitizeInput($data['due_date']);
    
    // TODO: Validate due_date format
    if (!validateDate($due_date)) {
        sendResponse(['error' => 'Invalid due_date format. Use YYYY-MM-DD'], 400);
        return;
    }

    // TODO: Generate a unique assignment ID
   
    
    // TODO: Handle the 'files' field
    $files = [];
    if (!empty($data['files']) && is_array($data['files'])) {
        $files=$data['files'];
    }
    $filesJson = json_encode($files);
    
    // TODO: Prepare INSERT query
    $sql = "INSERT INTO assignments (title, description, due_date, files) VALUES (:title, :description, :due_date, :files)";
    $stmt = $db->prepare($sql);

    // TODO: Bind all parameters
    $stmt->bindParam(':title', $title, PDO::PARAM_STR);
    $stmt->bindParam(':description', $description, PDO::PARAM_STR);
    $stmt->bindParam(':due_date', $due_date, PDO::PARAM_STR);
    $stmt->bindParam(':files', $filesJson, PDO::PARAM_STR);


    // TODO: Execute the statement
    try {
        $stmt->execute();
    
    
    // TODO: Check if insert was successful
    $assignmentId = $db->lastInsertId();
    
    $sql = "SELECT * FROM assignments WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $assignmentId, PDO::PARAM_INT);
    $stmt->execute();
    $assignment = $stmt->fetch();

    if ($assignment['files']) {
        $assignment['files'] = json_decode($assignment['files'], true) ?: [];
    } else {
        $assignment['files'] = [];
    }
    // TODO: If insert failed, return 500 error
    sendResponse($assignment, 201);
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to create assignment: ' . $e->getMessage()], 500);
    }
    

}


/**
 * Function: Update an existing assignment
 * Method: PUT
 * Endpoint: ?resource=assignments
 * 
 * Required JSON Body:
 *   - id: Assignment ID (required, to identify which assignment to update)
 *   - title: Updated title (optional)
 *   - description: Updated description (optional)
 *   - due_date: Updated due date (optional)
 *   - files: Updated files array (optional)
 * 
 * Response: JSON object with success status
 */
function updateAssignment($db, $data) {
    // TODO: Validate that 'id' is provided in $data
    if (empty($data['id'])) {
        sendResponse(['error' => 'Assignment ID is required for update'], 400);
        return;
    }

    // TODO: Store assignment ID in variable
    $assignmentId = $data['id'];
    
    // TODO: Check if assignment exists
    $checkStmt = $db->prepare("SELECT id FROM assignments WHERE id = :id");
    $checkStmt->bindParam(':id', $assignmentId, PDO::PARAM_INT);
    $checkStmt->execute();
    if ($checkStmt->fetch())  {
        sendResponse(['error' => 'Assignment not found'], 404);
        return;
    }
    
    // TODO: Build UPDATE query dynamically based on provided fields
    $sql = "UPDATE assignments SET ";
    $setClauses = [];
    $params = [':id' => $assignmentId];
    // TODO: Check which fields are provided and add to SET clause
    if (!empty($data['title'])) {
        $setClauses[] = "title = :title";
        $params[':title'] = sanitizeInput($data['title']);
    }
    if (!empty($data['description'])) {
        $setClauses[] = "description = :description";
        $params[':description'] = sanitizeInput($data['description']);
    }
    if (!empty($data['due_date'])) {
        $setClauses[] = "due_date = :due_date";
        $params[':due_date'] = sanitizeInput($data['due_date']);
    }
    if (!empty($data['files'])) {
        $files = is_array($data['files']) ?  $data['files'] : [];
        $setClauses[] = "files = :files";
        $params[':files'] = json_encode($data['files']);
    }

    // TODO: If no fields to update (besides updated_at), return 400 error
    if (empty($setClauses)) {
        sendResponse(['error' => 'No fields provided to update'], 400);
        return;
    }
    
    // TODO: Complete the UPDATE query
    $setClauses[] = "updated_at = NOW()";
    $sql .= implode(", ", $setClauses) . " WHERE id = :id";
    
    // TODO: Prepare the statement
    $stmt = $db->prepare($sql);

    // TODO: Bind all parameters dynamically
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value, PDO::PARAM_STR);
    }
    
    
    // TODO: Execute the statement
    try {
        $stmt->execute();
    
    
    // TODO: Check if update was successful
    if ($stmt->rowCount() > 0) {
        $sql = "SELECT * FROM assignments WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $assignmentId, PDO::PARAM_INT);
        $stmt->execute();
        $assignment = $stmt->fetch();
        
        if(!empty($assignment['files'])){
            $assignment['files']=json_decode($assignment['files'],true)?:[];
        } else {
            $assignment['files'] = [];
        }
        // TODO: If no rows affected, return appropriate message
    }
    sendResponse(['message' => 'Assignment updated successfully', 'assignment' => $assignment]);
    }   else {
        sendResponse(['message' => 'No changes made to the assignment'], 200);
    }
 catch (PDOException $e) {
        sendResponse(['error' => 'Failed to update assignment: ' . $e->getMessage()], 500);
    }   

    
    



/**
 * Function: Delete an assignment
 * Method: DELETE
 * Endpoint: ?resource=assignments&id={assignment_id}
 * 
 * Query Parameters:
 *   - id: Assignment ID (required)
 * 
 * Response: JSON object with success status
 */
function deleteAssignment($db, $assignmentId) {
    // TODO: Validate that $assignmentId is provided and not empty
    if (empty($assignmentId)) {
        sendResponse(['error' => 'Assignment ID is required'], 400);
        return;
    }
    
    // TODO: Check if assignment exists
    $checkStmt = $db->prepare("SELECT id FROM assignments WHERE id = :id");
    $checkStmt->bindParam(':id', $assignmentId, PDO::PARAM_INT);
    $checkStmt->execute();
    if (!$checkStmt->fetch()) {
        sendResponse(['error' => 'Assignment not found'], 404);
        return;
    }
    try {
        $db->beginTransaction();

    // TODO: Delete associated comments first (due to foreign key constraint)
    $deleteCommentsStmt = $db->prepare("DELETE FROM comments WHERE assignment_id = :assignment_id");
    $deleteCommentsStmt->bindParam(':assignment_id', $assignmentId, PDO::PARAM_INT);
    $deleteCommentsStmt->execute();
    
    // TODO: Prepare DELETE query for assignment
    $deleteAssignmentStmt = $db->prepare("DELETE FROM assignments WHERE id = :id");
    $deleteAssignmentStmt->bindParam(':id', $assignmentId, PDO::PARAM_INT);

    // TODO: Bind the :id parameter
    $deleteAssignmentStmt=$db->prepare("DELETE FROM assignments WHERE id = :id");
    $deleteAssignmentStmt->bindParam(':id', $assignmentId, PDO::PARAM_INT);

    
    // TODO: Execute the statement
    $deleteAssignmentStmt->execute();
    $db->commit();
    // TODO: Check if delete was successful
    sendResponse(['message' => 'Assignment and associated comments deleted successfully']);;
    // TODO: If delete failed, return 500 error
} else {
        $db->rollBack();
        sendResponse(['error' => 'Failed to delete assignment'], 500);
    }catch (PDOException $e) {
        $db->rollBack();
        sendResponse(['error' => 'Failed to delete assignment: ' . $e->getMessage()], 500);
    }
    
    
    
    
    
    
}


// ============================================================================
// COMMENT CRUD FUNCTIONS
// ============================================================================

/**
 * Function: Get all comments for a specific assignment
 * Method: GET
 * Endpoint: ?resource=comments&assignment_id={assignment_id}
 * 
 * Query Parameters:
 *   - assignment_id: The assignment ID (required)
 * 
 * Response: JSON array of comment objects
 */
function getCommentsByAssignment($db, $assignmentId) {
    // TODO: Validate that $assignmentId is provided and not empty
    if (empty($assignmentId)) {
        sendResponse(['error' => 'Assignment ID is required'], 400);
        return;
    
    // TODO: Prepare SQL query to select all comments for the assignment
    $sql = "SELECT * FROM comments WHERE assignment_id = :assignment_id ORDER BY created_at ASC";
    $stmt = $db->prepare($sql);
    
    // TODO: Bind the :assignment_id parameter
    $stmt->bindParam(':assignment_id', $assignmentId, PDO::PARAM_INT);

    // TODO: Execute the statement
    $stmt->execute();
    
    
    // TODO: Fetch all results as associative array
    $comments = $stmt->fetchAll();
    
    // TODO: Return success response with comments data
    sendResponse(['comments' => $comments]);

}


/**
 * Function: Create a new comment
 * Method: POST
 * Endpoint: ?resource=comments
 * 
 * Required JSON Body:
 *   - assignment_id: Assignment ID (required)
 *   - author: Comment author name (required)
 *   - text: Comment content (required)
 * 
 * Response: JSON object with created comment data
 */
function createComment($db, $data) {
    // TODO: Validate required fields
    $required = ['assignment_id', 'author', 'text'];

    foreach ($required as $field) {
        if (empty($data[$field])) {
            sendResponse(['error' => ucfirst($field) . ' is required'], 400);
            return;
        }
    }

    // TODO: Sanitize input data
    $assignment_id = sanitizeInput($data['assignment_id']);
    $author=sanitizeInput($data['author']);
    $text=sanitizeInput($data['text']);

    // TODO: Validate that text is not empty after trimming
    if(trim($text)===''){
        sendResponse(['error' => 'Comment text cannot be empty'],400);
        return;     
    }
    
    // TODO: Verify that the assignment exists
    $checkStmt = $db->prepare("SELECT id FROM assignments WHERE id = :id");
    $checkStmt->bindParam(':id', $assignment_id, PDO::PARAM_INT);
    $checkStmt->execute();
    if (!$checkStmt->fetch()) {
        sendResponse(['error' => 'Assignment not found'], 404);
        return;
    }
    
    // TODO: Prepare INSERT query for comment
    $sql = "INSERT INTO comments (assignment_id, author, text) VALUES (:assignment_id, :author, :text,NOW())";
    $stmt = $db->prepare($sql);
    
    // TODO: Bind all parameters
    $stmt->bindParam(':assignment_id', $assignment_id, PDO::PARAM_INT);
    $stmt->bindParam(':author', $author, PDO::PARAM_STR);
    $stmt->bindParam(':text', $text, PDO::PARAM_STR);

    // TODO: Execute the statement
    try {
        $stmt->execute();
    
    // TODO: Get the ID of the inserted comment
    $commentId = $db->lastInsertId();
    
    // TODO: Return success response with created comment data
    $sql = "SELECT * FROM comments WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $commentId, PDO::PARAM_INT);
    $stmt->execute();
    $comment = $stmt->fetch();
    sendResponse($comment, 201);;
    } catch (PDOException $e) {
        sendResponse(['error' => 'Failed to create comment: ' . $e->getMessage()], 500);
    }   


/**
 * Function: Delete a comment
 * Method: DELETE
 * Endpoint: ?resource=comments&id={comment_id}
 * 
 * Query Parameters:
 *   - id: Comment ID (required)
 * 
 * Response: JSON object with success status
 */
function deleteComment($db, $commentId) {
    // TODO: Validate that $commentId is provided and not empty
    if (empty($commentId)) {
        sendResponse(['error' => 'Comment ID is required'], 400);
        return;
    }   
    
    // TODO: Check if comment exists
    $checkStmt = $db->prepare("SELECT id FROM comments WHERE id = :id");
    $checkStmt->bindParam(':id', $commentId, PDO::PARAM_INT);
    $checkStmt->execute();
    if (!$checkStmt->fetch()) {
        sendResponse(['error' => 'Comment not found'], 404);
        return;
    }

    // TODO: Prepare DELETE query
    $sql = "DELETE FROM comments WHERE id = :id";
    $stmt = $db->prepare($sql);

    // TODO: Bind the :id parameter
    $stmt->bindParam(':id', $commentId, PDO::PARAM_INT);

    
    // TODO: Execute the statement
    try {
        $stmt->execute();
    
    // TODO: Check if delete was successful
    if ($stmt->rowCount() > 0) {
        sendResponse(['message' => 'Comment deleted successfully']);
    } else {
        sendResponse(['error' => 'Failed to delete comment'], 500);
    }
    } catch (PDOException $e) {
        // TODO: If delete failed, return 500 error
        sendResponse(['error' => 'Failed to delete comment: ' . $e->getMessage()], 500);
    }
    
    
    
}


// ============================================================================
// MAIN REQUEST ROUTER
// ============================================================================

try {
    // TODO: Get the 'resource' query parameter to determine which resource to access
    if (empty($resource)) {
        sendResponse(['error' => 'Resource parameter is required'], 400);
        exit;
    }

    // TODO: Route based on HTTP method and resource type
    
    if ($method === 'GET') {
        // TODO: Handle GET requests
        
        if ($resource === 'assignments') {
            // TODO: Check if 'id' query parameter exists
            if (!empty($assignmentId)) {
                getAssignmentById($db, $assignmentId);
            } else {
                getAllAssignments($db);
            }
        } elseif ($resource === 'comments') {
            // TODO: Check if 'assignment_id' query parameter exists
            if (!empty($assignmentIdForComments)) {
                getCommentsByAssignmentId($db, $assignmentIdForComments);
            } else {
                sendResponse(['error' => 'assignment_id parameter is required for comments resource'], 400);
            }
        } else {
            // TODO: Invalid resource, return 400 error
            sendResponse(['error' => 'Invalid resource'], 400);
        }
        
    } elseif ($method === 'POST') {
        // TODO: Handle POST requests (create operations)
        
        if ($resource === 'assignments') {
            // TODO: Call createAssignment($db, $data)
            createAssignment($db, $input);
        } elseif ($resource === 'comments') {
            // TODO: Call createComment($db, $data)
            createComment($db, $input);
        } else {
            // TODO: Invalid resource, return 400 error
            sendResponse(['error' => 'Invalid resource'], 400);
        }
        
    } elseif ($method === 'PUT') {
        // TODO: Handle PUT requests (update operations)
        
        if ($resource === 'assignments') {
            // TODO: Call updateAssignment($db, $data)
            updateAssignment
        } else {
            // TODO: PUT not supported for other resources
            sendResponse(['error' => 'PUT method not supported for this resource'], 405);
        }
        
    } elseif ($method === 'DELETE') {
        // TODO: Handle DELETE requests
        
        if ($resource === 'assignments') {
            // TODO: Get 'id' from query parameter or request body
            $idToDelete=!empty
        } elseif ($resource === 'comments') {
            // TODO: Get comment 'id' from query parameter
            $idToDelete = !empty($commentId) ? $commentId : null;
            deleteComment($db, $idToDelete);
        } else {
            // TODO: Invalid resource, return 400 error
            sendResponse(['error' => 'Invalid resource'], 400);
        }
        
    } else {
        // TODO: Method not supported
        sendResponse(['error' => 'Method not supported'], 405);
    }
    
} catch (PDOException $e) {
    // TODO: Handle database errors
    sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
} catch (Exception $e) {
    // TODO: Handle general errors
    sendResponse(['error' => 'SERVER error: ' . $e->getMessage()], 500);
}


// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper function to send JSON response and exit
 * 
 * @param array $data - Data to send as JSON
 * @param int $statusCode - HTTP status code (default: 200)
 */
function sendResponse($data, $statusCode = 200) {
    // TODO: Set HTTP response code
    http_response_code($statusCode);
    
    // TODO: Ensure data is an array
    if (!is_array($data)) {
        $data = ['data' => $data];
    }

    $response = array_merge(['status' => $statusCode], $data);

    // TODO: Echo JSON encoded data
    echo json_encode($response, JSON_PRETTY_PRINT);
    // TODO: Exit to prevent further execution
    exit;   
}


/**
 * Helper function to sanitize string input
 * 
 * @param string $data - Input data to sanitize
 * @return string - Sanitized data
 */
function sanitizeInput($data) {
    // TODO: Trim whitespace from beginning and end
    $data = trim($data);
    
    // TODO: Remove HTML and PHP tags
    $data = strip_tags($data);

    // TODO: Convert special characters to HTML entities
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    
    
    // TODO: Return the sanitized data
    return $data;
}


/**
 * Helper function to validate date format (YYYY-MM-DD)
 * 
 * @param string $date - Date string to validate
 * @return bool - True if valid, false otherwise
 */
function validateDate($date) {
    // TODO: Use DateTime::createFromFormat to validate
    $d=DateTime::createFromFormat('Y-m-d',$date);
    
    // TODO: Return true if valid, false otherwise
    return $d && $d->format('Y-m-d') === $date;
}


/**
 * Helper function to validate allowed values (for sort fields, order, etc.)
 * 
 * @param string $value - Value to validate
 * @param array $allowedValues - Array of allowed values
 * @return bool - True if valid, false otherwise
 */
function validateAllowedValue($value, $allowedValues) {
    // TODO: Check if $value exists in $allowedValues array
    if (!in_array($value, $allowedValues)) {
        return false;
    }
    
    // TODO: Return the result
    return true;

}

?>
