"use strict";


var titules_ = new angular.module("espreso.titules_", [])
    .config(function ($provide) {
        $provide.factory("$titules_", ["$log", "$modules", "$factory", function ($log, $modules, $factry) {
            var module = {};

            return module;
        }]);
    })
    .run(function ($titules, $modules) {

    });