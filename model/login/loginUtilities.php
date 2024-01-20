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
?>