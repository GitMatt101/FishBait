<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "SELECT P.ID, P.DataPubblicazione, P.Foto, P.Luogo, P.Descrizione, U.Email, U.Username, U.FotoProfilo, 
            (SELECT COUNT(*) FROM likes L1 WHERE L1.IDPost = P.ID) AS NumLike, 
            (SELECT COUNT(*) FROM likes L2 WHERE L2.EmailUtente = ? AND L2.IDPost = P.ID) AS IsLiked
            FROM post P INNER JOIN utenti U ON U.Email = P.EmailUtente
            WHERE P.EmailUtente IN (SELECT EmailUtenteSeguito
                                    FROM follow
                                    WHERE EmailUtente = ?)
            ORDER BY P.DataPubblicazione DESC";

session_start();
if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("ss", $_SESSION['userEmail'], $_SESSION['userEmail']);
    if ($stmt->execute()) {
        $response = $stmt->get_result();
        if ($response->num_rows >= 1) {
            $posts = $response->fetch_all(MYSQLI_ASSOC);
            for ($i = 0; $i < count($posts); $i++) {
                $posts[$i]['FotoProfilo'] = base64_encode($posts[$i]['FotoProfilo']);
                $posts[$i]['Foto'] = base64_encode($posts[$i]['Foto']);
            }
            $response = array("success" => true, "posts" => $posts);
        } else {
            $response = array("success" => false, "error" => "Nessun post trovato");
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