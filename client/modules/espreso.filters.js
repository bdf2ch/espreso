/*****
 * Фильтры
 *****/

"use strict";

var filters = angular.module("espreso.filters", [])
    .config(function ($filterProvider) {

        /* Фильтр опор по id линии */
        $filterProvider.register("pylonsByPowerLine", ["$log", function ($log) {
            return function (input, powerLineId) {
                if (powerLineId && parseInt(powerLineId) > 0 && input.length > 0) {
                    $log.log("powerLineId = ", powerLineId);
                    var pylons = [];
                    angular.forEach(input, function (pylon) {
                        if (pylon.powerLineId.value == parseInt(powerLineId))
                            pylons.push(pylon);
                    });
                    return pylons;
                } else
                    return input;
            };
        }]);

        /* Фильтр типов объектов по массиву id допустимых типов */
        $filterProvider.register("types", function () {
            return function (input, supported) {
                var types = [];
                if (supported) {
                    angular.forEach(input, function (type) {
                        var typeId = parseInt(type.id.value);
                        switch (typeId) {
                            case 0:
                                types.push(type);
                                break;
                            default:
                                if (supported.indexOf(typeId) != -1)
                                    types.unshift(type);
                                break;
                        }
                    });
                    return types;
                } else
                    return input;
            };
        });

        $filterProvider.register("dateDisplay", function () {
            return function (input) {
                return moment.unix(input).format("DD MMM в HH:mm");
            };
        });

        $filterProvider.register("fileSize", function () {
            return function (input) {
                var result = input / 1024;
                if ((result / 1024) >= 1)
                    return (result / 1024).toFixed(2) + " мб";
                else
                    return result.toFixed(0) + " кб";

            };
        });
    });