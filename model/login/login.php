<?php

include "loginUtilities.php";
require_once("../connection/dbConnection.php");

function login($email, $password, $connection, $remember) {
    $query = "SELECT Email, Pwd, Salt FROM utenti WHERE Email = ? LIMIT 1";
    if ($excQuery = $connection->prepare($query)) {
        $excQuery->bind_param('s', $email);
        $excQuery->execute();
        $excQuery->store_result();
        $excQuery->bind_result($userEmail, $userPassword, $userSalt);
        $excQuery->fetch();
        $pwd = hash('sha512', $password . $userSalt);

        if ($excQuery->num_rows == 1 && !checkBruteForce($userEmail, $connection)) {
            if ($pwd == $userPassword) {
                if ($remember === 'true') {
                    setcookie("userEmail", $email, time() + (86400 * 30), "/"); // Valido per 1 giorno
                    $_SESSION['userEmail'] = $_COOKIE['userEmail'];
                } else
                    $_SESSION['userEmail'] = $userEmail;
                return true;
            } else {
                $now = time();
                $connection->query("INSERT INTO tentativi_login (EmailUtente, DataOra) VALUES ('$email', '$now')");
            }
        }
    }
    return false;
}


session_start();
$remember = false;

if (isset($_POST['remember'])) {
    $remember = true;
}

if (isset($_POST['email'], $_POST['password'])) {
    if (login($_POST['email'], $_POST['password'], $conn, $remember)) {
        // Utente autenticato con successo
        $query = "SELECT Username, Nome, Cognome, FotoProfilo, Descrizione FROM utenti WHERE Email = ? LIMIT 1";

        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param("s", $_SESSION['userEmail']);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                if ($result->num_rows > 0) {
                    $userData = $result->fetch_assoc();
                    if (!empty($userData['FotoProfilo'])) {
                        $userData['FotoProfilo'] = base64_encode($userData['FotoProfilo']);
                    }
                    header("Location: ../../view/html/profile.html");
                    exit();
                } else {
                    echo json_encode(array("error" => "User not found."));
                }
            } else {
                echo json_encode(array("error" => $stmt->error));
            }
        } else {
            echo json_encode(array("error" => $conn->error));
        }
    } else {
        echo json_encode(array("error" => "Utente non autenticato."));
    }
}

$conn->close();

?>