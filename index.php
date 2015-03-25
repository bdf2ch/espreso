<?php

    /* Подключение библиотек */
    include "server/libs/xtemplate/xtemplate.class.php";
    include "server/config.php";

    //unset($_COOKIE["user"]);
    /* Проверка, залогинен ли пользователь */
    if (isset($_COOKIE["user"])) {
        /* Если пользователь залогинен - цепляем шаблон приложения */
        $template = new XTemplate("server/templates/app2.html");
        /* Соединение с БД */
        $connection = oci_connect($dbuser, $dbpassword, $dbhost, 'AL32UTF8');
        if (!$connection) {
            oci_close($connection);
            die('Не удалось подключиться к БД');
        } else {
            $cursor = oci_new_cursor($connection);
            $statement = oci_parse($connection, "begin pkg_versions.p_get_versions(:data); end;");
            oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR);
            oci_execute($statement);
            oci_execute($cursor);

            while ($data = oci_fetch_assoc($cursor))
                setcookie(strtolower($data["TABLE_NAME"]), $data["UPDATED"]);

            oci_free_statement($statement);
            oci_free_statement($cursor);
            oci_close($connection);
        }
    } else {
        /* Если пользователь не залогинен - цепляем шаблон формы авторизации */
        $template = new XTemplate("server/templates/login.html");
    }

    /* Парсинг и вывод шаблона */
    $template -> parse("main");
    $template -> out("main");
?>