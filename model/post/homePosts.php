<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "SELECT P.ID, P.DataPubblicazione, P.Foto, P.Luogo, P.Descrizione, U.Email, U.Username, U.FotoProfilo, 
            (SELECT COUNT(*) FROM likes L1 WHERE L1.IDPost = P.ID) AS NumLikes, 
            (SELECT COUNT(*) FROM commenti C1 WHERE C1.IDPost = P.ID) AS NumCommenti
            FROM post P INNER JOIN utenti U ON U.Email = P.EmailUtente
            WHERE P.EmailUtente IN (SELECT EmailUtenteSeguito
                                    FROM follow
                                    WHERE EmailUtente = ?)
            ORDER BY P.DataPubblicazione DESC";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("s", $_SESSION['userEmail']);
        if ($stmt->execute()) {
            $response = $stmt->get_result();
            $posts = $response->fetch_all(MYSQLI_ASSOC);
            for ($i = 0; $i < count($posts); $i++) {
                $posts[$i]['FotoProfilo'] = base64_encode($posts[$i]['FotoProfilo']);
                $posts[$i]['Foto'] = base64_encode($posts[$i]['Foto']);
            }
            $response = array("success" => true, "login" => true, "posts" => $posts);
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