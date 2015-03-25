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
                /* Добавление участка */
                case "add":
                    add_titule_part($postdata);
                    break;
                /* Изменение участка */
                case "edit":
                    edit_titule($postdata);
                    break;
                /* Удаление участка */
                case "delete":
                    delete_group($postdata);
                    break;
                /* Получение всех участков */
                case "query":
                    get_titule_parts();
                    break;
            }
        }
        oci_close($connection);
    }



    /* Функция добавления участка */
    function add_titule_part ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $postdata -> data;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titule_parts.p_insert_titule_part(:ttp_titule_id, :ttp_start_point_id, :ttp_end_point_id, :ttp_start_object_type_id, :ttp_end_object_type_id, :ttp_start_object_id, :ttp_end_object_id, :ttp_length, :ttp_title, :new_ttp); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":ttp_titule_id", $data -> tituleId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttp_start_point_id", $data -> startPointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttp_end_point_id", $data -> endPointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttp_start_object_type_id", $data -> startObjectTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttp_end_object_type_id", $data -> endObjectTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttp_start_object_id", $data -> startObjectId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttp_end_object_id", $data -> endObjectId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttp_length", $data -> length, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":ttp_title", $data -> title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":new_ttp", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($ttp = oci_fetch_assoc($cursor))
                        array_push($result, $ttp);
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



    /* Функция изменения участка */
    function edit_titule ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $postdata -> data;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titules.p_edit_titule(:titule_id, :title, :description, :new_titule); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":title", $data -> title, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":description", $data -> description, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":titule_id", $data -> id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":new_titule", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($titule = oci_fetch_assoc($cursor))
                        array_push($result, $titule);
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



    /* Функция удаления участка */
    function delete_group ($postdata) {
        global $connection;
        $data = $postdata -> data;
        $moment = 0;

        if (!$statement = oci_parse($connection, "begin pkg_usergroups.p_delete_group(:group_id, :moment); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":group_id", $data -> id, -1, OCI_DEFAULT)) {
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



    /* Функция получения всех участков */
    function get_titule_parts () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_titule_parts.p_get_titule_parts(:data); end;")) {
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