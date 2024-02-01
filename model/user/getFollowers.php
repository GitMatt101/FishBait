<?php

require_once("../connection/dbConnection.php");

$query = "SELECT Username, FotoProfilo, U.Email
            FROM utenti U, follow F
            WHERE F.EmailUtenteSeguito = ?
            AND F.EmailUtente = U.Email";

session_start();
if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("s", $_GET['userEmail']);
    if ($stmt->execute()) {
        $response = $stmt->get_result();
        if ($response->num_rows >= 1) {
            $followers = $response->fetch_all(MYSQLI_ASSOC);
            for ($i = 0; $i < count($followers); $i++) {
                $followers[$i]['FotoProfilo'] = base64_encode($followers[$i]['FotoProfilo']);
            }
            $response = array("success" => true, "followers" => $followers);
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