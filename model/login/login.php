<?php

include "loginUtilities.php";
require_once("../connection/dbConnection.php");

session_start();
$remember = false;

if (isset($_POST['remember'])) {
    $remember = true;
}

if (isset($_POST['email'], $_POST['password'])) {
    if (login($_POST['email'], $_POST['password'], $conn, $remember)) {
        // Utente autenticato con successo
        $query = "SELECT Username, Nome, Cognome, FotoProfilo, Descrizione FROM utenti WHERE Email = ? LIMIT 1";

        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param("s", $_SESSION['userEmail']);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                if ($result->num_rows > 0) {
                    $userData = $result->fetch_assoc();
                    if (!empty($userData['FotoProfilo'])) {
                        $userData['FotoProfilo'] = base64_encode($userData['FotoProfilo']);
                    }
                    header("Location: ../../view/html/home.html");
                    exit();
                } else {
                    echo json_encode(array("error" => "User not found."));
                }
            } else {
                echo json_encode(array("error" => $stmt->error));
            }
        } else {
            echo json_encode(array("error" => $conn->error));
        }
    } else {
        echo json_encode(array("error" => "Utente non autenticato."));
    }
}

$conn->close();

?>