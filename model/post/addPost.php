<?php

include '../login/loginUtilities.php';
require_once('../connection/dbConnection.php');

$query = "INSERT INTO post (EmailUtente, Foto, DataPubblicazione, Luogo, Descrizione) VALUES (?, ?, CURRENT_TIMESTAMP(), ?, ?)";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $image = NULL;
        $stmt->bind_param('sbss', $_SESSION['userEmail'], $image, $_POST['luogo'], $_POST['descrizione']);
        if ($_FILES['immagine']['error'] == 0) {
            $stmt->send_long_data(1, file_get_contents($_FILES['immagine']['tmp_name']));
        }
        if ($stmt->execute()) {
            $response = array("success" => true);
        } else {
            $response = array("success" => false, "error" => $stmt->error);
        }
    }
} else {
    $response = array("success" => false, "error" => $conn->error);
}

echo json_encode($response);

?>