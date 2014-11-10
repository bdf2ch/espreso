/***
 *  Модуль авторизации пользователя
***/

var Authorization = angular.module("Authorization", ["ngCookies"])
    .config(function ($provide) {
        $provide.factory("Authorization", ["$log", "$http", "$cookies", "$cookieStore", "$window", function ($log, $http, $cookies, $cookieStore, $window) {
            var module = {};

            /* Идентификационные данные пользователя */
            module.authData = {
                email: "savoronov@kolenergo.ru",
                password: "12345"
            };

            /* Отсылает индентификационные данные пользователя на сервер */
            module.login = function () {
                $http.post("server/controllers/authorization.php", module.authData).success(function (data) {

                });
            };

            return module;
        }])
    })
    .run(function ($log) {
        $log.log("AUTHORIZATION EXECUTED");
    });

/* Контроллер модуля авторизации */
Authorization.controller("AuthorizationCtrl", ["$log", "$scope", "Authorization", function ($log, $scope, Authorization) {
    $scope.auth = Authorization;
}]);