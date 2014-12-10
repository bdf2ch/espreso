<?php
    $postdata = json_decode(file_get_contents('php://input'));
    include "../config.php";

    $action = $postdata -> action;
    $result = array();

    /* Подключение к БД */
    $connection = oci_connect('espreso', 'espreso', '192.168.50.68/orcldev', 'AL32UTF8');
    if (!$connection){
            oci_close($connection);
            print_r(oci_error());
            die('Не удалось подключиться к БД');
    } else {
        switch ($action) {
            /* Получение списка всех пользователей */
            case "query":
                $cursor = oci_new_cursor($connection);

                if (!$statement = oci_parse($connection, "begin espreso.P_GET_USERS(:data); end;")) {
                    $error = oci_error();
                    echo $error["message"];
                } else {
                    if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                        $error = oci_error();
                        echo $error["message"];
                    }
                    if (!oci_execute($statement)) {
                        $error = oci_error();
                        echo $error["message"];
                    } else {
                        if (!oci_execute($cursor)) {
                            $error = oci_error();
                            echo $error["message"];
                        } else {
                            while ($data = oci_fetch_assoc($cursor)) {
                                array_push($result, $data);
                            }
                        }
                    }
                }

                /* Освобождение ресурсов */
                oci_free_statement($statement);
                oci_free_statement($cursor);
                oci_close($connection);

                /* Возврат результата */
                if (sizeof($result) == 0)
                    echo json_encode(0);
                else
                    echo json_encode($result);
                break;
        }
    }
?>