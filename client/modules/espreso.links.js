"use strict";


angular.module("espreso.links", [])
    .config(function ($provide) {
        $provide.factory("$links", ["$log", "$http", function ($log, $http) {
            var module = {};

            module.currentTituleLinks = [];
            module.currentTitulePartLinks = [];
            module.linkTypes = [
                {
                    id: 1,
                    title: "Последовательное"
                },
                {
                    id: 2,
                    title: "Ответвление"
                }
            ];

            /**
             * Добавляет последовательное соединение
             * @param tituleId
             * @param titulePartId
             * @param startNodeId
             * @param nextNodeId
             * @param endNodePointId
             * @param endNodeTypeId
             * @param endNodeId
             * @param callback
             */
            module.append = function (tituleId, titulePartId, startNodeId, nodePathId,  nextNodeId, endNodePointId, endNodeTypeId, endNodeId, callback) {
                if (tituleId !== undefined && titulePartId !== undefined && startNodeId !== undefined && nodePathId !== undefined
                    && endNodeId !== undefined && endNodePointId !== undefined && endNodeTypeId !== undefined && endNodeId !== undefined) {
                    var params = {
                        action: "append",
                        data: {
                            tituleId: tituleId,
                            titulePartId: titulePartId,
                            startNodeId: startNodeId,
                            nodePathId: nodePathId,
                            nextNodeId: nextNodeId,
                            endNodePointId: endNodePointId,
                            endNodeTypeId: endNodeTypeId,
                            endNodeId: endNodeId
                        }
                    };
                    $http.post("server/controllers/links.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                callback(data);
                            }
                        }
                    );
                }
            };



            /**
             * Добавляет ветвящееся соединение
             * @param tituleId
             * @param titulePartId
             * @param startNodeId
             * @param endNodePointId
             * @param endNodeTypeId
             * @param endNodeId
             * @param callback
             */
            module.branch = function (tituleId, titulePartId, startNodeId, endNodePointId, endNodeTypeId, endNodeId, callback) {
                if (tituleId !== undefined && titulePartId !== undefined && startNodeId !== undefined &&
                    endNodePointId !== undefined && endNodeTypeId !== undefined && endNodeId !== undefined) {
                    var params = {
                        action: "branch",
                        data: {
                            tituleId: tituleId,
                            titulePartId: titulePartId,
                            startNodeId: startNodeId,
                            endNodePointId: endNodePointId,
                            endNodeTypeId: endNodeTypeId,
                            endNodeId: endNodeId
                        }
                    };
                    $http.post("server/controllers/links.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                callback(data);
                            }
                        }
                    );
                }
            };

            return module;
        }]);
    });