<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "UPDATE utenti SET Username = ?, Nome = ?, Cognome = ?, Descrizione = ?, FotoProfilo = ?
            WHERE Email = ?";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $pfp = NULL;
        $stmt->bind_param("ssssbs", $_POST['username'], $_POST['nome'], $_POST['cognome'], $_POST['descrizione'], $pfp, $_SESSION['userEmail']);
        if ($_FILES && $_FILES['pfp']['error'] == 0)
            $stmt->send_long_data(4, file_get_contents($_FILES['pfp']['tmp_name']));
        if ($stmt->execute()) {
            $response = array("success" => true);
        } else {
            $response = array("success" => false, "login" => true, "error" => $stmt->error);
        }
    } else {
        $response = array("success" => false, "login" => true, "error" => $conn->error);
    }
} else {
    $response = array("success" => false, "login" => false, "error" => "Utente non loggato");
}

echo json_encode($response);
$conn->close();

?>