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
                case "getPath":
                    get_path($postdata);
                   break;

                /* ��������� �������� ����� �� id ���� */
                case "getChildNodes":
                    get_child_nodes($postdata);
                    break;
            }
            oci_close($connection);
        }
    }


        /* ��������� ���� ����� ����� ��������� ������ */
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