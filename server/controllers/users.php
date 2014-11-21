<?php
    $postdata = file_get_contents('php://input');
    $params = json_decode($postdata, true);

    switch ($action) {
        case "query":
            break;
        case "add":
            break;
        case "edit":
            break;
        case "delete":
            break;
    }

?>