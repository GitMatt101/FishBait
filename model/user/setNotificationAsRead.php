<?php

require_once("../connection/dbConnection.php");
include("../login/loginUtilities.php");

$query = "UPDATE notifiche SET Visualizzato=TRUE WHERE IDNotifica=?";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("s", $_GET['idNotifica']);
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