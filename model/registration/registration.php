<?php

require_once('../connection/dbConnection.php');
include '../login/login.php';

$pwd = $_POST['password'];
$random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
$hashedPassword = hash('sha512', $pwd . $random_salt);

$sql = "INSERT INTO utenti(Email, Pwd, Salt, Username, Nome, Cognome, FotoProfilo, DataNascita, Descrizione) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if ($conn && $stmt = $conn->prepare($sql)) {
    $pfp = NULL;
    $stmt->bind_param('ssssssbss', $_POST['email'], $pwd, $random_salt, $_POST['username'], $_POST['nome'], $_POST['cognome'], $pfp, $_POST['data'], $_POST['descrizione']);

    if ($_FILES && $_FILES['pfp']['error'] == 0) {
        $stmt->send_long_data(6, file_get_contents($_FILES['pfp']['tmp_name']));
    }

    $remember = isset($_POST['remember']);

    if ($stmt->execute()) {
        login($_POST['email'], $hashedPassword, $conn, $remember);
    } else {
        $response = array(
            "success" => false,
            "error" => $stmt->error
        );
    }
} else {
    $response = array(
        "success" => false,
        "error" => $conn->error
    );
}

if (!isset($response)) {
    $response = array(
        "success" => true,
        "username" => $_POST['username']
    );
}

echo json_encode($response);

?>
