<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "INSERT INTO commenti(IDPost, EmailUtente, Contenuto, DataPubblicazione) VALUES (?, ?, ?, CURRENT_DATE())";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("iss", $_POST['idPost'], $_SESSION['userEmail'], $_POST['contenuto']);
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