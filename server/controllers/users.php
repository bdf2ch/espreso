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
                /* Добавление пользователя */
                case "add":
                    add_user($postdata);
                    break;
                /* Изменение пользователя */
                case "edit":
                    edit_user($postdata);
                    break;
                /* Удаление пользователя */
                case "delete":
                    delete_user($postdata);
                    break;
                /* Получение всех пользователей */
                case "query":
                    get_users();
                    break;
            }
        }
        oci_close($connection);
    }



    /* Функция добавления пользователя */
    function add_user ($post) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $post -> data;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_users.p_insert_user(:group_id, :name, :fname, :surname, :phone, :email, :passwd, :new_user ); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":group_id", $data -> groupId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":name", $data -> name, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":fname", $data -> fname, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":surname", $data -> surname, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":phone", $data -> phone, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":email", $data -> email, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":passwd", $data -> password, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":new_user", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($user = oci_fetch_assoc($cursor))
                        array_push($result, $user);
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



    /* Функция изменения пользователя */
    function edit_user ($post) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $post -> data;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_users.p_edit_user(:usr_id, :usr_group_id, :usr_name, :usr_fname, :usr_surname, :usr_phone, :usr_email, :usr); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":usr_id", $data -> id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":usr_group_id", $data -> groupId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":usr_name", $data -> name, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":usr_fname", $data -> fname, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":usr_surname", $data -> surname, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":usr_phone", $data -> phone, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":usr_email", $data -> email, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":usr", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($user = oci_fetch_assoc($cursor))
                        array_push($result, $user);
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



    /* Функция удаления пользователя */
    function delete_user ($post) {
        global $connection;
        $data = $post -> data;
        $moment = 0;

        if (!$statement = oci_parse($connection, "begin pkg_users.p_delete_user(:user_id, :moment); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":user_id", $data -> id, -1, OCI_DEFAULT)) {
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

        /* Освобождение ресурсов */
        oci_free_statement($statement);

        /* Возврат результата */
        echo json_encode($moment);
    };



    /* Функция получения всех пользователей */
    function get_users () {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_users.p_get_users(:data); end;")) {
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