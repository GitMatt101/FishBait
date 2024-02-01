<?php

require_once("../connection/dbConnection.php");
include("../login/loginUtilities.php");

function getCount($conn, $query) {
    $count = 0;
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("s", $_SESSION['userEmail']); 
        if ($stmt->execute()) {
            $stmt->bind_result($count);
            $stmt->fetch();
        }
    }
    return $count;
}

$infoQuery = "SELECT * FROM utenti WHERE Email = ? LIMIT 1"; 

session_start();
if ($stmt = $conn->prepare($infoQuery)) {
    $stmt->bind_param("s", $_SESSION['userEmail']);
    if ($stmt->execute()) {
        $results = $stmt->get_result();
        if ($results->num_rows > 0) {
            $userData = $results->fetch_all(MYSQLI_ASSOC);
            $userData[0]['FotoProfilo'] = base64_encode($userData[0]['FotoProfilo']);
            $response = array("success" => true, 
                "userData" => $userData,
                "postCount" => getCount($conn, "SELECT COUNT(*) FROM post WHERE EmailUtente = ?"),
                "followersCount" => getCount($conn, "SELECT COUNT(*) FROM follow WHERE EmailUtenteSeguito = ?"),
                "followingCount" => getCount($conn, "SELECT COUNT(*) FROM follow WHERE EmailUtente = ?"));
        } else {
            $response = array("success" => false, "error" => "Utente non trovato");
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