<?php

    include("server/config.php");

    $postdata = json_decode(file_get_contents('php://input'));
    $email = $postdata -> email;
    $passwd = $postdata -> password;

    $connection = oci_connect("espreso", "espreso", "192.168.50.68/orcldev", 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        die('Не удалось подключиться к БД');
    } else {
        $result = "";
        $query = "SELECT *
                  FROM users
                  WHERE users.email = '$email' AND
                        users.password = '$passwd'";
        $statement = oci_parse($connection, $query);
        if(oci_execute($statement, OCI_DEFAULT)){
            $result = oci_fetch_array($statement);
        } else {
            $error = oci_error();
            die("Не удалось выполнить запрос : ".$err[message]);
        }
        if ($result != "") {
            echo json_encode($result);
        } else
            echo "fail";
    }

?>