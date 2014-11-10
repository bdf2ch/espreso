/***
 * Модуль основного приложения
 ***/

var espreso = angular.module("Espreso", [])
    .config(function ($provide) {
        $provide.factory("Espreso", ["$log", "Espreso", function ($log, Espreso) {
            var module = {};

            return module;
        }]);
    })
    .run(function ($log) {
        $log.log("ESPRESO EXECUTED");
    });