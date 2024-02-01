<?php

include '../login/loginUtilities.php';
require_once('../connection/dbConnection.php');

$query = "INSERT INTO notifiche(EmailRicevente, EmailRiferimento, IDPost, DataRicevimento, Descrizione) 
            VALUES (?, ?, ?, CURRENT_DATE(), ?)";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $idp = $_POST['idPost'];
        if (!isset($_POST['idPost']) || $_POST['idPost'] == "" || $_POST['idPost'] == "null" || $_POST['idPost'] == null) {
            $idp = null;
        }
        $stmt->bind_param('ssis', $_POST['emailRicevente'], $_SESSION['userEmail'], $idp, $_POST['descrizione']);
        if ($stmt->execute()) {
            $response = array("success" => true);
        } else {
            $response = array("success" => false, "error" => $stmt->error, "idp" => $idp);
        }
    }
} else {
    $response = array("success" => false, "error" => "Utente non loggato");
}

echo json_encode($response);
$conn->close();

?>