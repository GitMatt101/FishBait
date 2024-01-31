<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "SELECT * FROM likes WHERE EmailUtente = ? AND IDPost = ? LIMIT 1";
session_start();
if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("si", $_SESSION["userEmail"], $_GET["postID"]);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $response = array("success" => true);
        } else {
            $response = array("success" => false, "errpr" => "Mi piace non trovato");
        }
    } else {
        $response = array("success" => false, "error" => $stmt->error);
    }
} else {
    $response = array("success" => false, "error" => $conn->error);
}

echo json_encode($response);
$conn->close();

?>