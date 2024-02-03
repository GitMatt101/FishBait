<?php

include "loginUtilities.php";
require_once("../connection/dbConnection.php");

session_start();
if ($_POST['email'] == "") {
    unset($_POST['email']);
}
if ($_POST['password'] == "") {
    unset($_POST['password']);
}
if (isset($_POST['email'], $_POST['password'])) {
    if (login($_POST['email'], $_POST['password'], $conn)) {
        // Utente autenticato con successo
        $query = "SELECT Username, Nome, Cognome, FotoProfilo, Descrizione FROM utenti WHERE Email = ? LIMIT 1";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param("s", $_SESSION['userEmail']);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                if ($result->num_rows > 0) {
                    $response = array("success" => true);
                } else {
                    $response = array("success" => false, "error" => "Utente non trovato.");
                }
            } else {
                $response = array("success" => false, "error" => $stmt->error);
            }
        } else {
            $response = array("success" => false, "error" => $conn->error);
        }
    } else {
        $response = array("success" => false, "error" => "Email o password errate.", "email" => $_POST['email'], "password" => $_POST['password']);
    }
} else {
    $response = array("success" => false, "error" => "Parametri mancanti.");
}

echo json_encode($response);
$conn->close();

?>