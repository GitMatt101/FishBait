<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "DELETE FROM follow WHERE EmailUtente = ? AND EmailUtenteSeguito = ?";
session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("ss", $_SESSION['userEmail'], $_GET['emailSeguito']);
        if ($stmt->execute()) {
            $response = array("success" => true, "email" => $_SESSION['userEmail']);
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