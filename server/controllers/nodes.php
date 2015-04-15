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
                /* Получение пути между двумя заданными узлами */
                case "getPath":
                    get_path($postdata);
                   break;

                /* Получение дочерних узлов по id узла */
                case "getChildNodes":
                    get_child_nodes($postdata);
                    break;
            }
            oci_close($connection);
        }
    }


        /* Получение пути между двумя заданными узлами */
        function get_path ($postdata) {
            global $connection;
            $data = $postdata -> data;
            $cursor = oci_new_cursor($connection);
            $result = array();

            if (!$statement = oci_parse($connection, "begin PKG_NODES.P_GET_PATH(:start_node_id, :end_node_id, :session_id, :path); end;")) {
                $error = oci_error();
                echo $error["message"];
            } else {
                if (!oci_bind_by_name($statement, ":start_node_id", $data -> startNodeId, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":end_node_id", $data -> endNodeId, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":session_id", $data -> sessionId, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":path", $cursor, -1, OCI_B_CURSOR)) {
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
                        while ($node = oci_fetch_assoc($cursor))
                            array_push($result, $node);
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



        /* Получение дочерних узлов по id узла */
        function get_child_nodes ($postdata) {
            global $connection;
            $data = $postdata -> data;
            $cursor = oci_new_cursor($connection);
            $result = array();

            if (!$statement = oci_parse($connection, "begin PKG_NODES.P_GET_CHILD_NODES(:node_id, :session_id, :child_nodes); end;")) {
                $error = oci_error();
                echo $error["message"];
            } else {
                if (!oci_bind_by_name($statement, ":node_id", $data -> nodeId, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":session_id", $data -> sessionId, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":child_nodes", $cursor, -1, OCI_B_CURSOR)) {
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
                        while ($node = oci_fetch_assoc($cursor))
                            array_push($result, $node);
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


?>