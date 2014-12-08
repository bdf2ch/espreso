<?php
    $postdata = json_decode(file_get_contents('php://input'));
    include "../config.php";

    //$postdata = json_decode(file_get_contents('php://input'));
    $action = $postdata -> action;
    $result = array();

    $connection = oci_connect('espreso', 'espreso', '192.168.50.68/orcldev', 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        print_r(oci_error());
        die('Не удалось подключиться к БД');
    } else {
        switch ($action) {
            case "login":
                $email = $postdata -> email;
                $passwd = $postdata -> password;
                
                $cursor = oci_new_cursor($connection);
                $statement = oci_parse($connection, "begin P_AUTH_USER(:email, :passwd, :data); end;");

                if (!oci_bind_by_name($statement, ":email", $email, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":passwd", $passwd, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_execute($statement)) {
                    $error = oci_error();
                    echo $error["message"];
                };
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    echo $error["message"];
                }

                while ($data = oci_fetch_assoc($cursor))
                    array_push($result, $data);

                oci_free_statement($statement);
                oci_free_statement($cursor);
                oci_close($connection);

                if (sizeof($result) == 0)
                    echo json_encode(0);
                else
                    echo json_encode($result);
                break;
        }
    }

?>