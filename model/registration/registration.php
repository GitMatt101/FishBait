<?php

include '../login/loginUtilities.php';
require_once('../connection/dbConnection.php');

$pwd = $_POST['password'];
$random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
$pwd = hash('sha512', $pwd . $random_salt);

$query = "INSERT INTO utenti(Email, Pwd, Salt, Username, Nome, Cognome, FotoProfilo, DataNascita, Descrizione) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

session_start();
if ($stmt = $conn->prepare($query)) {
    $pfp = NULL;
    $stmt->bind_param('ssssssbss', $_POST['email'], $pwd, $random_salt, $_POST['username'], $_POST['nome'], $_POST['cognome'], $pfp, $_POST['data'], $_POST['descrizione']);

    if ($_FILES && $_FILES['pfp']['error'] == 0)
        $stmt->send_long_data(6, file_get_contents($_FILES['pfp']['tmp_name']));

    $remember = false;
    if (isset($_POST['remember']))
        $remember = true;

    if ($stmt->execute()) {
        $response = array("success" => true, "email" => $_POST['email']);
        $_SESSION['userEmail'] = $_POST['email'];
    } else {
        $response = array("success" => false, "error" => $stmt->error);
    }
} else {
    $response = array(
        "success" => false,
        "error" => $conn->error
    );
}

$conn->close();
echo json_encode($response);

?>
