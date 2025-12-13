<?php
/**
*Database Connection Class
*
*Manages MySQL database connections using PDO.
*Other PHP scripts should include this file and call getConnection()
*to obtain a configured PDO instance for database operations.
*/
class Database{
private$host="localhost";
private$db_name="course";
private$username="admin";
private$password="password123";
private$connection;
/**
*Establish and return a PDO database connection instance
*
*@return PDO
*/
public function getConnection(){

$this->connection=null;
try{

$this->connection=new PDO(
"mysql:host=".$this->host.";dbname=".$this->db_name,
$this->username,
$this->password);
$this->connection->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
}
catch(PDOException$e){
error_log("DB Connection Error:".$e->getMessage());
exit("Could not connect to database.");}
return$this->connection;}} 
?>