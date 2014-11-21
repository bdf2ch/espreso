<?php
    include "server/config.php";

    $postdata = json_decode(file_get_contents('php://input'));
    $action = $postdata -> action;
    $result = 0;

    $connection = oci_connect($dbuser, $dbpassword, $dbhost, 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        die('Не удалось подключиться к БД');
    } else {
        switch ($action) {
            case "login":
                $email = $params -> email;
                $passwd = $params -> password;
                
                $cursor = oci_new_cursor($connection);
                $statement = oci_parse($connection, "begin P_AUTH_USER(:email, :passwd, :data); end;");
                oci_bind_by_name($statement, ":email", $cursor, -1, OCI_B_CURSOR);
                oci_bind_by_name($statement, ":passwd", $cursor, -1, OCI_B_CURSOR);
                oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR);
                oci_execute($statement);
                oci_execute($cursor);
                $result = oci_fetch_assoc($cursor);

                oci_free_statement($statement);
                oci_free_statement($cursor);
                oci_close($connection);
                break;
        }
        echo json_encode($result);
    }

?>