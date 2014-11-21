/***
 *  Модуль авторизации пользователя
***/

var Authorization = angular.module("Authorization", ["ngCookies"])
    .config(function ($provide) {
        $provide.factory("Authorization", ["$log", "$http", "$cookies", "$cookieStore", "$window", function ($log, $http, $cookies, $cookieStore, $window) {
            var module = {};

            /* Отсылает индентификационные данные пользователя на сервер */
            module.login = function (parameters) {
                if (parameters) {
                    parameters.action = "login";
                    $http.post("server/controllers/authorization.php", parameters).success(function (data) {
                        if (data) {
                            if (data != 0) {
                                //$cookies.user_id = parseInt(data["ID"]);
                                //$window.location.reload();
                                $log.log(data);
                            } else {

                            }
                        }
                    });
                }
            };

            return module;
        }])
    })
    .run(function ($log, Authorization) {
        $log.log("AUTHORIZATION EXECUTED");
        Authorization.login({email: 'savoronov@kolenergo.ru', password: '111'});
    });

/* Контроллер модуля авторизации */
Authorization.controller("AuthorizationCtrl", ["$log", "$scope", "Authorization", function ($log, $scope, Authorization) {
    $scope.auth = Authorization;
    $scope.email = "";
    $scope.password = "";


}]);