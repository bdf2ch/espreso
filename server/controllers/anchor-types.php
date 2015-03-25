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
                /* Добавление типа крепления */
                case "add":
                    add_anchor_type($postdata);
                    break;
                /* Изменение типа крепления */
                case "edit":
                    edit_anchor_type($postdata);
                    break;
                /* Удаление типа крепления */
                case "delete":
                    delete_anchor_type($postdata);
                    break;
                /* Получение всех типов крепления */
                case "query":
                    get_anchor_types();
                    break;
            }
        }
        oci_close($connection);
    }



    /* Функция добавления типа крепления */
    function add_anchor_type ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $postdata -> data;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_anchor_types.p_insert_anchor_type(:at_title, :new_anchor_type); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":at_title", $data -> title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":new_anchor_type", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($anchor_type = oci_fetch_assoc($cursor))
                        array_push($result, $anchor_type);
                }
            }

        }

        // Освобождение ресурсов
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // Возврат результата
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };



    /* Функция изменения типа крепления */
    function edit_anchor_type($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $postdata -> data;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_anchor_types.p_edit_anchor_type(:at_id, :at_title, :anchor_type); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {

            if (!oci_bind_by_name($statement, ":at_id", $data -> id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":at_title", $data -> title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":anchor_type", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($at = oci_fetch_assoc($cursor))
                        array_push($result, $at);
                }
            }
        }

        // Освобождение ресурсов
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // Возврат результата
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };



    /* Функция удаления типа крепления */
    function delete_anchor_type ($postdata) {
        global $connection;
        $data = $postdata -> data;
        $moment = 0;

        if (!$statement = oci_parse($connection, "begin pkg_anchor_types.p_delete_anchor_type(:at_id, :moment); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":at_id", $data -> id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":moment", $moment, -1, OCI_B_INT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                echo $error["message"];
            }
        }

        // Освобождение ресурсов
        oci_free_statement($statement);

        // Возврат результата
        echo json_encode($moment);
    };



    /* Функция получения всех типов креплений */
    function get_anchor_types () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_anchor_types.p_get_anchor_types(:data); end;")) {
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

?>