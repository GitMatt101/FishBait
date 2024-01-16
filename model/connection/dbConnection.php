<?php

$conn = new mysqli("localhost", "secureUser", "SeCuRePaSsWoRd123456?!%", "fishbait", 3306);

if ($conn->connect_error) {
    die("Connessione al database fallita: " . $conn->connect_error);
}

?>