/* Модуль авторизации пользователя */

var Authorization = angular.module("Authorization", ["ngCookies"])
    .config(function ($provide) {
        $provide.factory("Auth", ["$log", "$http", "$cookies", "$cookieStore", "$window", function ($log, $http, $cookies, $cookieStore, $window) {

        }])
    })
    .run(function ($log) {
        $log.log("AUTHORIZATION EXECUTED");
    });