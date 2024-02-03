<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "SELECT P.ID, P.Foto
            FROM post P, bookmarks B
            WHERE B.EmailUtente = ? AND B.IDPost = P.ID";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("s", $_SESSION['userEmail']);
        if ($stmt->execute()) {
            $response = $stmt->get_result();
            $posts = $response->fetch_all(MYSQLI_ASSOC);
            for ($i = 0; $i < count($posts); $i++) {
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