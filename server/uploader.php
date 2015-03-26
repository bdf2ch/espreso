<?php
    include "config.php";
    global $upload_folder;
    $result = -1;


    if (file_exists($upload_folder)) {
        //echo("folder '".$upload_folder."' exists");
        if (is_dir($upload_folder)) {
             if ( !empty( $_FILES ) ) {
                    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
                    $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . $upload_folder . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
                    move_uploaded_file($tempPath, $uploadPath);
                    $answer = array( 'answer' => 'File transfer completed' );
                    $json = json_encode( $answer );
                    echo $json;
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