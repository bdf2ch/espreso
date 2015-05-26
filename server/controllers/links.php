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
                /* Добавление последовательного соединения */
                case "append":
                    append_link($postdata);
                    break;
                /* Добавление ветвящегося соединения */
                case "branch":
                    branch_link($postdata);
                    break;
            }
            oci_close($connection);
        }
    }


    /* Добавление последовательного соединения */
    function append_link ($postdata) {
        global $connection;
        $data = $postdata -> data;
        $cursor = oci_new_cursor($connection);
        $result = array();


        if (!$statement = oci_parse($connection, "begin PKG_LINKS.P_APPEND_LINK(:titule_id, :titule_part_id, :start_node_id, :node_path_id, :next_node_id, :end_node_point_id, :end_node_type_id, :end_node_id, :appended_node); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":titule_id", $data -> tituleId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":titule_part_id", $data -> titulePartId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":start_node_id", $data -> startNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":node_path_id", $data -> nodePathId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":next_node_id", $data -> nextNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":end_node_point_id", $data -> endNodePointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":end_node_type_id", $data -> endNodeTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":end_node_id", $data -> endNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":appended_node", $cursor, -1, OCI_B_CURSOR)) {
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


    /* Добавление ветвящегося соединения */
    function branch_link ($postdata) {
        global $connection;
        $data = $postdata -> data;
        $cursor = oci_new_cursor($connection);
        $result = array();


        if (!$statement = oci_parse($connection, "begin PKG_LINKS.P_BRANCH_LINK(:titule_id, :titule_part_id, :start_node_id, :end_node_point_id, :end_node_type_id, :end_node_id, :branched_node); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":titule_id", $data -> tituleId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":titule_part_id", $data -> titulePartId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":start_node_id", $data -> startNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":end_node_point_id", $data -> endNodePointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":end_node_type_id", $data -> endNodeTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":end_node_id", $data -> endNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":branched_node", $cursor, -1, OCI_B_CURSOR)) {
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