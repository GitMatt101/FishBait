<?php

include("../login/loginUtilities.php");
require_once("../connection/dbConnection.php");

$query = "SELECT ID, Foto FROM post WHERE EmailUtente = ? ORDER BY DataPubblicazione DESC";

session_start();
if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("s", $_SESSION['userEmail']);
    if ($stmt->execute()) {
        $results = $stmt->get_result();
        if ($results->num_rows > 0) {
            $posts = $results->fetch_all(MYSQLI_ASSOC);
            for ($i = 0; $i < count($posts); $i++) {
                $posts[$i]['Foto'] = base64_encode($posts[$i]['Foto']);
            }
            $response = array("success" => true, "posts" => $posts);
        } else {
            $response = array("success" => false, "error" => "No posts found");
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