<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "SELECT * FROM follow WHERE EmailUtente = ? AND EmailUtenteSeguito = ? LIMIT 1";
session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("ss", $_SESSION['userEmail'], $_GET['emailSeguito']);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $response = array("success" => true);
            } else {
                $response = array("success" => false, "error" => "Utente non seguito");
            }
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