<?php

require_once("../connection/dbConnection.php");

$query = "SELECT Username, FotoProfilo, U.Email
            FROM utenti U, follow F
            WHERE F.EmailUtente = ?
            AND F.EmailUtenteSeguito = U.Email";

session_start();
if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("s", $_GET['userEmail']);
    if ($stmt->execute()) {
        $response = $stmt->get_result();
        if ($response->num_rows >= 1) {
            $utenti = $response->fetch_all(MYSQLI_ASSOC);
            for ($i = 0; $i < count($utenti); $i++) {
                $utenti[$i]['FotoProfilo'] = base64_encode($utenti[$i]['FotoProfilo']);
            }
            $response = array("success" => true, "utenti" => $utenti);
        } else {
            $response = array("success" => false, "error" => "Nessun utente trovato");
        }
    } else {
        $response = array("success" => false, "error" => $stmt->error);
    }
} else {
    $response = array("success" => false, "error" => $conn->error);
}

echo json_encode($response);
$conn->close();

?>