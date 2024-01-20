<?php

require_once("../model/connection/dbConnection.php");
include("../model/login/loginUtilities.php");

$query = "SELECT * FROM utenti WHERE Email = ? LIMIT 1"; 

if ($selectQuery = $conn->prepare($query)) {
    $selectQuery->bind_param("s", $_POST['targetUser']); 
    if ($selectQuery->execute()) {
        $results = $selectQuery->get_result();
        if ($results->num_rows > 0) {
            $userData = $results->fetch_all(MYSQLI_ASSOC);
            $userData[0]['FotoProfilo'] = base64_encode($userData[0]['FotoProfilo']);
            echo json_encode($userData);
        } else {
            $e = array("error" => "User not found.");
            echo json_encode($e);
        }
    } else {
        $e = array("error" => $selectQuery->error);
        echo json_encode($e);
    }
} else {
    $e = array("error" => $conn->error);
    echo json_encode($e);
}

$conn->close();

?>
