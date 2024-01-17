<?php

include '../login/login.php';
require_once('../connection/dbConnection.php');

$pwd = $_POST['password'];
$random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
$pwd = hash('sha512', $pwd . $random_salt);

$query = "INSERT INTO utenti(Email, Pwd, Salt, Username, Nome, Cognome, FotoProfilo, DataNascita, Descrizione) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

session_start();
if ($insert = $conn->prepare($query)) {
    $image = NULL;
    $insert->bind_param('ssssssbss', $_POST['email'], $pwd, $random_salt, $_POST['username'], $_POST['nome'], $_POST['cognome'], $image, $_POST['data'], $_POST['descrizione']);
    if($_FILES && $_FILES['pfp']['error'] == 0)
        $insert->send_long_data(6, file_get_contents($_FILES['pfp']['tmp_name']));

    $remember = false;
    if (isset($_POST['remember']))
        $remember = true;
    if ($insert->execute())
        login($_POST['email'], $pwd, $conn, $remember);
}
$conn->close();

?>