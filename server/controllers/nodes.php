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
                case "getNodesByTituleId":
                    get_nodes_by_titule_id($postdata);
                   break;

                /* Получение дочерних узлов по id узла */
                case "getChildNodes":
                    get_child_nodes($postdata);
                    break;

                /* Получает узлы, вхоядящие в состав путей, исходящих из заданного узла */
                case "getBranches":
                    get_branches($postdata);
                    break;

                case "change":
                    change_node($postdata);
                    break;

                case "add":
                    add_node($postdata);
                    break;

                case "delete":
                    delete_node($postdata);
                    break;
            }
            oci_close($connection);
        }
    }


        /* Получение пути между двумя заданными узлами */
        function get_nodes_by_titule_id ($postdata) {
            global $connection;
            $data = $postdata -> data;
            $cursor = oci_new_cursor($connection);
            $result = array();

            if (!$statement = oci_parse($connection, "begin PKG_NODES.P_GET_TITULE_NODES(:titule_id, :session_id, :nodes); end;")) {
                $error = oci_error();
                echo $error["message"];
            } else {
                if (!oci_bind_by_name($statement, ":titule_id", $data -> tituleId, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":session_id", $data -> sessionId, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
                }
                if (!oci_bind_by_name($statement, ":nodes", $cursor, -1, OCI_B_CURSOR)) {
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

            if (!$statement = oci_parse($connection, "begin PKG_NODES.P_GET_CHILD_NODES(:titule_id, :titule_part_id, :node_id, :session_id, :child_nodes); end;")) {
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


    /* Получает узлы, вхоядящие в состав путей, исходящих из заданного узла */
    function get_branches ($postdata) {
        global $connection;
        $data = $postdata -> data;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin PKG_NODES.P_GET_BRANCHES(:titule_id, :titule_part_id, :node_id, :session_id, :nodes); end;")) {
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
            if (!oci_bind_by_name($statement, ":node_id", $data -> nodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":session_id", $data -> sessionId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":nodes", $cursor, -1, OCI_B_CURSOR)) {
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



    /* Получает узлы, вхоядящие в состав путей, исходящих из заданного узла */
    function change_node ($postdata) {
        global $connection;
        $data = $postdata -> data;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin PKG_NODES.P_CHANGE_NODE(:n_id, :n_new_id, :n_titule_id, :n_titule_part_id, :n_node_path_id, :n_new_node); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":n_id", $data -> nodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_new_id", $data -> newNodeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_titule_id", $data -> tituleId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_titule_part_id", $data -> titulePartId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_node_path_id", $data -> nodePathId, -1, OCI_DEFAULT)) {
                    $error = oci_error();
                    echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_new_node", $cursor, -1, OCI_B_CURSOR)) {
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



    /* Получает узлы, вхоядящие в состав путей, исходящих из заданного узла */
    function add_node ($postdata) {
        global $connection;
        $data = $postdata -> data;
        $cursor = oci_new_cursor($connection);
        $result = array();

        if (!$statement = oci_parse($connection, "begin PKG_NODES.P_ADD_NODE(:n_node_type_id, :n_point_id, :n_pylon_type_id, :n_pylon_scheme_type_id, :n_power_line_id, :n_pylon_number, :n_node); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":n_node_type_id", $data -> nodeTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_point_id", $data -> pointId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_pylon_type_id", $data -> pylonTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_pylon_scheme_type_id", $data -> pylonSchemeTypeId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_power_line_id", $data -> powerLineId, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_pylon_number", $data -> pylonNumber, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":n_node", $cursor, -1, OCI_B_CURSOR)) {
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



    function delete_node ($postdata) {
         global $connection;
         $data = $postdata -> data;
         $result = "";

         if (!$statement = oci_parse($connection, "begin PKG_NODES.P_DELETE_NODE(:n_id, :n_titule_id, :n_titule_part_id, :n_path_id, :res); end;")) {
             $error = oci_error();
             echo $error["message"];
         } else {
              if (!oci_bind_by_name($statement, ":n_id", $data -> nodeId, -1, OCI_DEFAULT)) {
                  $error = oci_error();
                  echo $error["message"];
              }
              if (!oci_bind_by_name($statement, ":n_titule_id", $data -> tituleId, -1, OCI_DEFAULT)) {
                  $error = oci_error();
                  echo $error["message"];
              }
              if (!oci_bind_by_name($statement, ":n_titule_part_id", $data -> titulePartId, -1, OCI_DEFAULT)) {
                  $error = oci_error();
                  echo $error["message"];
              }
              if (!oci_bind_by_name($statement, ":n_path_id", $data -> pathId, -1, OCI_DEFAULT)) {
                  $error = oci_error();
                  echo $error["message"];
              }
              if (!oci_bind_by_name($statement, ":res", $result, -1, OCI_DEFAULT)) {
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
         oci_free_statement($cursor);

         // Возврат результата
         echo json_encode($result);
    };

?>