<?php

require_once("../connection/dbConnection.php");
include("../login/loginUtilities.php");

$query = "SELECT COUNT(*) AS numLikes
            FROM likes
            WHERE IDPost = ?";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $image = NULL;
        $stmt->bind_param('i', $_GET['idPost']);
        if ($stmt->execute()) {
            $response = $stmt->get_result();
            if ($response->num_rows >= 1) {
                $likes = $response->fetch_all(MYSQLI_ASSOC);
                $response = array("success" => true, "likes" => $likes);
            } else {
                $response = array("success" => false, "error" => "Nessun like trovato");
            }
        } else {
            $response = array("success" => false, "error" => $stmt->error);
        }
    } else {
        $response = array("success" => false, "error" => $conn->error);
    }
} 
echo json_encode($response);
$conn->close();

?>