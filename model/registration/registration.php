<?php

include '../login/loginUtilities.php';
require_once('../connection/dbConnection.php');

$query = "INSERT INTO utenti(Email, Pwd, Salt, Username, Nome, Cognome, FotoProfilo, DataNascita, Descrizione) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

session_start();
if ($_POST['email'] == "") {
    unset($_POST['email']);
}
if ($_POST['password'] == "") {
    unset($_POST['password']);
}
if ($_POST['username'] == "") {
    unset($_POST['username']);
}
if (isset($_POST['email'], $_POST['password'], $_POST['username'])) {
    $pwd = $_POST['password'];
    $random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
    $pwd = hash('sha512', $pwd . $random_salt);
    if ($stmt = $conn->prepare($query)) {
        $pfp = NULL;
        $stmt->bind_param('ssssssbss', $_POST['email'], $pwd, $random_salt, $_POST['username'], $_POST['nome'], $_POST['cognome'], $pfp, $_POST['data'], $_POST['descrizione']);
    
        if ($_FILES && $_FILES['pfp']['error'] == 0)
            $stmt->send_long_data(6, file_get_contents($_FILES['pfp']['tmp_name']));
    
        if ($stmt->execute()) {
            $response = array("success" => true, "error" => "tutto bene");
            $_SESSION['userEmail'] = $_POST['email'];
        } else {
            $response = array("success" => false, "error" => $stmt->error);
        }
    } else {
        $response = array("success" => false, "error" => $conn->error);
    }
} else {
    $response = array("success" => false, "error" => "Parametri mancanti.");
}

echo json_encode($response);
$conn->close();

?>
