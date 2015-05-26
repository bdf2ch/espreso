<?php

    if (!$_COOKIE["user"])
            die("���������������� ������!");
    else {
        include "../config.php";
        $postdata = json_decode(file_get_contents('php://input'));

        $action = $postdata -> action;
        $result = array();

        /* ����������� � �� */
        $connection = oci_connect($dbuser, $dbpassword, $dbhost, 'AL32UTF8');
        if (!$connection){
            oci_close($connection);
            print_r(oci_error());
            die('�� ������� ������������ � ��');
        } else {
            switch ($action) {
                /* ��������� ���� ����� ����� ��������� ������ */
                case "getNodesByTituleId":
                    get_nodes_by_titule_id($postdata);
                   break;

                /* ��������� �������� ����� �� id ���� */
                case "getChildNodes":
                    get_child_nodes($postdata);
                    break;

                /* �������� ����, ��������� � ������ �����, ��������� �� ��������� ���� */
                case "getBranches":
                    get_branches($postdata);
                    break;

                case "change":
                    change_node($postdata);
                    break;

                case "add":
                    add_node($postdata);
                    break;
            }
            oci_close($connection);
        }
    }


        /* ��������� ���� ����� ����� ��������� ������ */
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

            // ������������ ��������
            oci_free_statement($statement);
            oci_free_statement($cursor);

            // ������� ����������
            if (sizeof($result) == 0)
                echo json_encode(0);
            else
                echo json_encode($result);
        };



        /* ��������� �������� ����� �� id ���� */
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

            // ������������ ��������
            oci_free_statement($statement);
            oci_free_statement($cursor);

            // ������� ����������
            if (sizeof($result) == 0)
                echo json_encode(0);
            else
                echo json_encode($result);
         };


    /* �������� ����, ��������� � ������ �����, ��������� �� ��������� ���� */
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

        // ������������ ��������
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // ������� ����������
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };



    /* �������� ����, ��������� � ������ �����, ��������� �� ��������� ���� */
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

        // ������������ ��������
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // ������� ����������
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };



    /* �������� ����, ��������� � ������ �����, ��������� �� ��������� ���� */
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

        // ������������ ��������
        oci_free_statement($statement);
        oci_free_statement($cursor);

        // ������� ����������
        if (sizeof($result) == 0)
            echo json_encode(0);
        else
            echo json_encode($result);
    };

?>