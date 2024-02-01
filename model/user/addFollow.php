<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "INSERT INTO follow(EmailUtente, EmailUtenteSeguito) VALUES (?, ?)";
session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("ss", $_SESSION['userEmail'], $_GET['emailSeguito']);
        if ($stmt->execute()) {
            $response = array("success" => true);
        } else {
            $response = array("success" => false, "error" => $stmt->error);
        }
    } else {
        $response = array("success" => false, "error" => $conn->error);
    }
} else {
    $response = array("success" => false, "error" => "Utente non loggato");
}

echo json_encode($response);
$conn->close();

?>