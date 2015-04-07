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
                /* Получение файлов по идентификатору титула */
                case "filesByTituleId":
                    get_files_by_titule_id($postdata);
                    break;
                case "deleteById":
                    delete_file_by_id($postdata);
                    break;
            }
        }
        oci_close($connection);
    }


    global $upload_folder;


    /* Функция получения всех объектов по идентификатору титула */
    function get_files_by_titule_id ($postdata) {
        global $connection;

        $cursor = oci_new_cursor($connection);
        $data = $postdata -> data;
        $result = array();

        if (!$statement = oci_parse($connection, "begin pkg_files.p_get_files_by_titule_id(:f_ttl_id, :files); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":f_ttl_id", $data -> id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":files", $cursor, -1, OCI_B_CURSOR)) {
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
                    while ($object = oci_fetch_assoc($cursor))
                        array_push($result, $object);
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



    /* Функция удаления файла */
    function delete_file_by_id ($postdata) {
        global $connection;
        $cursor = oci_new_cursor($connection);
        $data = $postdata -> data;
        $result = array();
        global $upload_folder;

        if (!$statement = oci_parse($connection, "begin pkg_files.p_delete_file_by_id(:f_id, :deleted_file); end;")) {
            $error = oci_error();
            echo $error["message"];
        } else {
            if (!oci_bind_by_name($statement, ":f_id", $data -> id, -1, OCI_DEFAULT)) {
                $error = oci_error();
                echo $error["message"];
            }
            if (!oci_bind_by_name($statement, ":deleted_file", $cursor, -1, OCI_B_CURSOR)) {
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
                    $result = oci_fetch_assoc($cursor);
                    $filePath = $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."espreso".DIRECTORY_SEPARATOR."server".DIRECTORY_SEPARATOR.$upload_folder.DIRECTORY_SEPARATOR.$result["TITULE_ID"].DIRECTORY_SEPARATOR.iconv("UTF-8", "windows-1251", $result["TITLE"]);
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    } else
                        echo(json_encode($filePath));
                }
            }
        }

        echo(json_encode($result));
    };

?>