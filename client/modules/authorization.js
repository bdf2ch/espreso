/***
 *  Модуль авторизации пользователя
***/

var Authorization = angular.module("Authorization", ["ngCookies", "ngRoute"])
    .config(function ($provide) {
        $provide.factory("Authorization", ["$log", "$http", "$cookies", "$cookieStore", "$window", "$document", "$route",function ($log, $http, $cookies, $cookieStore, $window, $document, $route) {
            var module = {};

            module.email = "";
            module.password = "";
            module.errors = [];

            /* Отсылает индентификационные данные пользователя на сервер */
            module.login = function () {
                var parameters = {
                    action: "login",
                    email: module.email,
                    password: module.password
                };

                module.errors.splice(0, module.errors.length);
                if (module.email == "")
                    module.errors.push("Вы не ввели имя пользователя");
                if (module.password == "")
                    module.errors.push("Вы не ввели пароль");

                if (module.errors.length == 0) {
                    $http.post("server/controllers/authorization.php", parameters).success(function (data) {
                        if (data) {
                            $log.log(data);
                            if (parseInt(data) != 0) {
                                var user = new User();
                                user.fromSOURCE(data[0]);
                                $log.log(user);
                                $cookies.user = JSON.stringify(user);
                                $window.location.reload(true);
                            } else {
                                $log.log("no such user");
                                module.errors.push("Неправильное имя пользователя или пароль");
                            }
                        }
                    });
                }
            };

            /* разлогинивает пользователя и удаляет информацию из кук */
            module.logout = function () {
                $log.log("logout");
                $cookieStore.remove("user");
                $window.location.reload(true);
            };

            return module;
        }])
    }).run(function ($log, Authorization, $cookies, $window) {
        $log.log("AUTHORIZATION EXECUTED");
    });

/* Контроллер модуля авторизации */
Authorization.controller("AuthorizationCtrl", ["$log", "$scope", "Authorization", "$cookies", "$window", function ($log, $scope, Authorization, $cookies, $window) {
    $scope.auth = Authorization;
    if ($cookies.user)
        $window.location.reload();
}]);

Authorization.controller("AuthCtrl", ["$log", "$scope", "Authorization", "$cookies", "$window", function ($log, $scope, Authorization, $cookies, $window) {
    $log.log("auth controller");
    $scope.auth = Authorization;
}]);
