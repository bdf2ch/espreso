"use strict";

var modules = angular.module("espreso.modules", [])
    .config(function ($provide) {
        $provide.factory("$modules", ["$log", function ($log) {
            var module = {};

            module.modules = [];

            /* Регистрирует модуль в системе */
            module.register = function (mod) {
                if (mod && mod.constructor == Module) {
                    module.modules.push(mod);
                    $log.log(module.modules);
                }
            };

            return module;
        }]);
    })
    .run(function ($modules) {

    });