<?php

require_once("../connection/dbConnection.php");
include("../login/loginUtilities.php");

$query = "SELECT Username, FotoProfilo, Email
            FROM utenti 
            WHERE Username LIKE ?
            ORDER BY Username ASC ";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        if (isset($_GET['lettera']) && is_string($_GET['lettera'])) {
            $text = "%" . $_GET['lettera'] . "%";
            $stmt->bind_param("s", $text);
            if ($stmt->execute()) {
                $response = $stmt->get_result();
                if ($response->num_rows >= 1) {
                    $cerca = $response->fetch_all(MYSQLI_ASSOC);
                    for ($i = 0; $i < count($cerca); $i++) {
                        $cerca[$i]['FotoProfilo'] = base64_encode($cerca[$i]['FotoProfilo']);
                    }
                    $response = array("success" => true, "login" => true, "cerca" => $cerca);
                } else {
                    $response = array("success" => false, "login" => true, "error" => "Nessun utente trovato");
                }
            } else {
                $response = array("success" => false, "login" => true, "error" => $stmt->error);
            }
        } else {
            $response = array("success" => false, "login" => true, "error" => "Parametro 'lettera' non valido");
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
