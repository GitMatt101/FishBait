<?php

session_start();
if (isset($_SESSION['userEmail'])) {
    unset($_SESSION['userEmail']);
    $_SESSION = array();
}
session_destroy();
echo json_encode(array("success" => true, "email" => $_SESSION['userEmail']));

?>