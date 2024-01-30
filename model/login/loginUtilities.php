<?php

function checkBruteForce($email, $conn)
{
    $now = time();
    $valid_attempts = $now - (2 * 60 * 60);
    if ($query = $conn->prepare("SELECT DataOra FROM tentativi_login WHERE EmailUtente = ? AND DataOra > '$valid_attempts'")) {
        $query->bind_param('s', $email);
        $query->execute();
        $query->store_result();
        if ($query->num_rows > 5)
            return true;
        else
            return false;
    }
}

function checkSession($conn)
{
    if (isset($_SESSION['userEmail'])) {
        if ($query = $conn->prepare("SELECT * FROM utenti WHERE Email = ? LIMIT 1")) {
            $query->bind_param('s', $_SESSION['userEmail']);
            $query->execute();
            $query->store_result();
            if ($query->num_rows == 1)
            {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function login($email, $password, $connection, $remember) {
    $query = "SELECT Email, Pwd, Salt FROM utenti WHERE Email = ? LIMIT 1";
    if ($excQuery = $connection->prepare($query)) {
        $userEmail = null;
        $userPassword = null;
        $userSalt = null;
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

?>