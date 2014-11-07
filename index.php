<?php
    /* Подключение библиотек */
    include "server/libs/xtemplate.class.php";

    if (isset($_COOKIE["user_id"])) {
        $template = new XTemplate("server/templates/login.html");
    } else {
        $template = new XTemplate("server/templates/application.html");
    }
?>