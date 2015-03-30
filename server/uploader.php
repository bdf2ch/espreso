<?php
    include "config.php";
    global $dbuser;
    global $dbhost;
    global $dbpassword;
    global $upload_folder;
    $result = array();

    if (file_exists($upload_folder)) {
        if (is_dir($upload_folder)) {
             if (!empty($_FILES)) {
                if (isset($_POST["tituleId"])) {
                    $tituleId = $_POST["tituleId"];
                    if (file_exists($upload_folder.DIRECTORY_SEPARATOR.$tituleId)) {
                        $tempPath = $_FILES["file"]["tmp_name"];
                        $fsize = $_FILES["file"]["size"];
                        $uploadPath = dirname(__FILE__).DIRECTORY_SEPARATOR.$upload_folder.DIRECTORY_SEPARATOR.$tituleId.DIRECTORY_SEPARATOR.$_FILES['file']['name'];
                        move_uploaded_file($tempPath, $uploadPath);
                        $furl = "server".DIRECTORY_SEPARATOR.$upload_folder.DIRECTORY_SEPARATOR.$tituleId.DIRECTORY_SEPARATOR.$_FILES["file"]["name"];

                        $connection = oci_connect($dbuser, $dbpassword, $dbhost, 'AL32UTF8');

                        if (!$connection) {
                            oci_close($connection);
                            print_r(oci_error());
                            die('Не удалось подключиться к БД');
                        } else {
                             $cursor = oci_new_cursor($connection);
                             if (!$statement = oci_parse($connection, "begin pkg_files.p_insert_file(:f_ttl_id, :f_user_id, :f_title, :f_size, :f_url, :inserted_file); end;")) {
                                $error = oci_error();
                                echo $error["message"];
                             } else {

                                 if (!oci_bind_by_name($statement, ":f_ttl_id", $_POST["tituleId"], -1, OCI_DEFAULT)) {
                                     $error = oci_error();
                                     echo $error["message"];
                                 }

                                 if (!oci_bind_by_name($statement, ":f_user_id", $_POST["userId"], -1, OCI_DEFAULT)) {
                                     $error = oci_error();
                                     echo $error["message"];
                                 }

                                 if (!oci_bind_by_name($statement, ":f_title", $_FILES["file"]["name"], -1, OCI_DEFAULT)) {
                                     $error = oci_error();
                                     echo $error["message"];
                                 }

                                 if (!oci_bind_by_name($statement, ":f_size", $fsize, -1, OCI_DEFAULT)) {
                                     $error = oci_error();
                                     echo $error["message"];
                                 }

                                 if (!oci_bind_by_name($statement, ":f_url", $furl, -1, OCI_DEFAULT)) {
                                     $error = oci_error();
                                     echo $error["message"];
                                 }

                                 if (!oci_bind_by_name($statement, ":inserted_file", $cursor, -1, OCI_B_CURSOR)) {
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
                             echo(json_encode($result));
                             oci_close($connection);
                         }
                    } else {
                        if (mkdir(dirname(__FILE__).DIRECTORY_SEPARATOR.$upload_folder.DIRECTORY_SEPARATOR.$tituleId)) {
                            $tempPath = $_FILES["file"]["tmp_name"];
                            $uploadPath = dirname(__FILE__).DIRECTORY_SEPARATOR.$upload_folder.DIRECTORY_SEPARATOR.$tituleId.DIRECTORY_SEPARATOR.$_FILES['file']['name'];
                            move_uploaded_file($tempPath, $uploadPath);
                            $answer = array( 'answer' => 'File transfer completed to new directory', "tituleId" => $_POST["tituleId"], "userId" => $_POST["userId"]);
                            $json = json_encode( $answer );
                            echo $json;
                        } else {
                            $answer = array("answer" => "Directory '".$tituleId."' NOT created");
                            echo(json_encode($answer));
                        }
                    }
                } else {
                    $answer = array("answer" => "tituleId NOT set");
                    echo(json_encode($answer));
                }
             } else {
                echo 'No files';
             }
        } else {
            echo("'".$upload_folder."' not a directory");
            $result = -1;
        }
    } else {
        echo("folder '".$upload_folder."' DOES NOT exists");
        $result = -1;
    }
?>