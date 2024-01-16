<?php
/**
 * TO DO: creare i seguenti file per il login e la connessione
 * include '../login/loginUtilities.php';
 * require_once('../connection/dbConnection.php');
 */

$pwd = $_POST['password'];
$random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
$pwd = hash('sha512', $pwd . $random_salt);

$query = "INSERT INTO utenti(Email, Pwd, Salt, Username, Nome, Cognome, FotoProfilo, DataNascita, Descrizione) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

// TO DO: startSession(); per avviare una sessione
if ($insert = $conn->prepare($query)) {
    
}
$conn->close();
?>