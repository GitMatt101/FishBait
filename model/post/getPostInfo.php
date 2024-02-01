<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "SELECT P.Foto, P.Descrizione, P.Luogo, U.Username, U.Email, U.FotoProfilo
            FROM post P, utenti U 
            WHERE ID = ?
            AND U.Email = P.EmailUtente
            LIMIT 1";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("i", $_GET['idPost']);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $postData = $result->fetch_all(MYSQLI_ASSOC);
                $postData[0]['FotoProfilo'] = base64_encode($postData[0]['FotoProfilo']);
                $postData[0]['Foto'] = base64_encode($postData[0]['Foto']);
                $response = array("success" => true, "postData" => $postData);
            } else {
                $response = array("success" => false, "error" => "Post non trovato");
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