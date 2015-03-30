/*****
 *
 *****/

var files = angular.module("espreso.files", [])
    .config(function ($provide) {
        $provide.factory("$files", ["$log", "$http", function ($log, $http) {
            var module = {};

            module.getFilesByTituleId = function (tituleId, destination) {
                if (tituleId !== undefined && destination !== undefined) {
                    var params = {
                        action: "filesByTituleId",
                        data: {
                            id: tituleId
                        }
                    };
                    destination.splice(0, destination.length);
                    $http.post("server/controllers/files-controller.php", params)
                        .success(function (data) {
                            if (data && parseInt(data) !== 0) {
                                destination.splice(0, destination.length);
                                angular.forEach(data, function (file) {
                                    var temp_file = new FileItem();
                                    temp_file.fromSOURCE(file);
                                    //temp_file.onInit();
                                    destination.push(temp_file);
                                });
                            }
                        }
                    );
                }
            };

            /*** Отсылает информацию о загруженном файле на сервер ***/
            module.add = function (tituleId, userId) {
                if (tituleId !== undefined && userId !== undefined) {
                    var params = {
                        action: "add",
                        data: {
                            tituleId: tituleId,
                            userId: userId
                        }
                    };
                    $http.post("server/controllers/files-controller.php", params)
                        .success(function (data) {
                            if (data !== undefined) {

                            }
                        }
                    );
                }
            };

            return module;
        }]);
    })
    .run(function () {

    }
);