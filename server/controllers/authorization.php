<?php

    include "../config.php";
    $postdata = json_decode(file_get_contents('php://input'));

    $action = $postdata -> action;

    /* Подключение к БД */
    $connection = oci_connect($dbuser, $dbpassword, $dbhost, 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        print_r(oci_error());
        die('Не удалось подключиться к БД');
    } else {
        switch ($action) {
            /* Добавление пользователя */
            case "sign_in":
                sign_in($postdata);
                break;

            case "remind_password":
                remind_password($postdata);
                break;
        }
    }
    oci_close($connection);



    /* Функция авторизации пользователя */
    function sign_in ($post) {
        global $connection;
        $email = $post -> email;
        $passwd = $post -> password;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_authorization.p_sign_in(:email, :passwd, :data); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
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
            } else {
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

        }

        oci_free_statement($statement);
        oci_free_statement($cursor);

        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };



    /*  Функция генерации нового пароля */
    function remind_password ($post) {
        global $connection;
        $email = $post -> email;
        $new_password = "";

        if (!$statement = oci_parse($connection, "begin pkg_authorization.p_remind_password(:email, :new_password); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":email", $email, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":new_password", $new_password, 50, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                echo $error["message"];
            } else {
                mail($email, "Новый пароль", "Ваш новый пароль для входа в систему: ".$new_password);

            }
        }

        /* Освобождение ресурсов */
        oci_free_statement($statement);

        echo json_encode($new_password);
    };

/*
    $postdata = json_decode(file_get_contents('php://input'));
    include "../config.php";

    //$postdata = json_decode(file_get_contents('php://input'));
    $action = $postdata -> action;
    $result = array();

    $connection = oci_connect($dbuser, $dbpassword, $dbhost, 'AL32UTF8');
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

                if (!$statement = oci_parse($connection, "begin espreso.P_AUTH_USER(:email, :passwd, :data); end;")) {
                    $error = oci_error();
                    echo $error["message"];
                } else {
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
    */

?>