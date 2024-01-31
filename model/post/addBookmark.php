<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "INSERT INTO bookmarks(EmailUtente, IDPost) VALUES (?, ?)";
session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("si", $_SESSION["userEmail"], $_GET["postID"]);
        if ($stmt->execute()) {
            $response = array("success" => true);
        } else {
            $response = array("success" => false, "error" => $stmt->error);
        }
    } else {
        $response = array("success" => false, "error" => $conn->error);
    }
} else {
    $response = array("success" => false, "error" => "Connessione al database fallita");
}

echo json_encode($response);
$conn->close();

?>