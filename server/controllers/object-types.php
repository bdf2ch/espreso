<?php
    if (!$_COOKIE["user"])
        die("Неавторизованный доступ!");
    else {
        include "../config.php";
        $postdata = json_decode(file_get_contents('php://input'));

        $action = $postdata -> action;
        $result = array();

        /* Подключение к БД */
        $connection = oci_connect($dbuser, $dbpassword, $dbhost, 'AL32UTF8');
        if (!$connection){
            oci_close($connection);
            print_r(oci_error());
            die('Не удалось подключиться к БД');
        } else {
            switch ($action) {
                /* Получение всех типов объектов */
                case "query":
                    get_object_types();
                    break;
                /* Получение типов объектов по идентификатору точки */
                case "objectTypesByPointId":
                    get_object_types_by_point_id($postdata);
                    break;
            }
        }
        oci_close($connection);
    }



    /* Функция получения всех типов кабеля */
    function get_object_types () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_object_types.p_get_object_types(:data); end;")) {
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
                    while ($data = oci_fetch_assoc($cursor))
                        array_push($result, $data);
                }
            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);
        oci_free_statement($cursor);

        /* Возврат результата */
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };


    /* Функция получения типов объектов по идентификатору точки */
    function get_object_types_by_point_id ($postdata) {
                global $connection;
                $cursor = oci_new_cursor($connection);
                $data = $postdata -> data;
                $result = array();

                if (!$statement = oci_parse($connection, "begin pkg_objects.p_get_object_types_by_point_id(:p_id, :data); end;")) {
                    $error = oci_error();
                    echo $error["message"];
                } else {
                    if (!oci_bind_by_name($statement, ":p_id", $data -> id, -1, OCI_DEFAULT)) {
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
                    } else {
                        if (!oci_execute($cursor)) {
                            $error = oci_error();
                            echo $error["message"];
                        } else {
                            while ($data = oci_fetch_assoc($cursor))
                                array_push($result, $data);
                        }
                    }
                }

                /* Освобождение ресурсов */
                oci_free_statement($statement);
                oci_free_statement($cursor);

                /* Возврат результата */
                if (sizeof($result) == 0)
                    echo json_encode(0);
                else
                    echo json_encode($result);
            };


?>