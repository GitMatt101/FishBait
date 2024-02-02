<?php

include '../login/loginUtilities.php';
require_once('../connection/dbConnection.php');

$query = "SELECT N.IDPost, N.Descrizione, N.Visualizzato, U.Username, U.FotoProfilo, U.Email
            FROM notifiche N INNER JOIN utenti U ON N.EmailRiferimento = U.Email
            WHERE N.EmailRicevente = ? ORDER BY N.DataRicevimento DESC";

session_start();
if (checkSession($conn)) {
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param('s', $_SESSION['userEmail']);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $notifications = $result->fetch_all(MYSQLI_ASSOC);
                for ($i = 0; $i < count($notifications); $i++) {
                    $notifications[$i]['FotoProfilo'] = base64_encode($notifications[$i]['FotoProfilo']);
                }
                $response = array("success" => true, "login" => true, "notifications" => $notifications);
            } else {
                $response = array("success" => false, "login" => true, "error" => "Nessuna notifica trovata");
            }
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