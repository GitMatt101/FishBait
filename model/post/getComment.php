<?php

require_once("../connection/dbConnection.php");
include("../login/loginUtilities.php");

$query = "SELECT Username, FotoProfilo, Contenuto
            FROM utenti U, commenti C
            WHERE U.Email = C.EmailUtente
            AND C.IDPost = ?";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $image = NULL;
        $stmt->bind_param('i', $_GET['postID']);
        if ($stmt->execute()) {
            $response = $stmt->get_result();
            if ($response->num_rows >= 1) {
                $commenti = $response->fetch_all(MYSQLI_ASSOC);
                for ($i = 0; $i < count($commenti); $i++) {
                    $commenti[$i]['FotoProfilo'] = base64_encode($commenti[$i]['FotoProfilo']);
                }
                $response = array("success" => true, "commenti" => $commenti);
            } else {
                $response = array("success" => false, "error" => "Nessun commento trovato");
            }
        } else {
            $response = array("success" => false, "error" => $stmt->error);
        }
    } else {
        $response = array("success" => false, "error" => $conn->error);
    }
} 
echo json_encode($response);
$conn->close();

?>