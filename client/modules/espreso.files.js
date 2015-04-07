/*****
 *
 *****/

var files = angular.module("espreso.files", [])
    .config(function ($provide) {
        $provide.factory("$files", ["$log", "$http", function ($log, $http) {
            var module = {};

            module.isLoading = false;
            module.currentFileId = -1;

            /*** Устанавливает состояние загрузки списка файлов ***/
            module.loading = function (flag) {
                if (flag !== undefined && flag.constructor === Boolean) {
                    module.isLoading = flag;
                }
            };

            /**
             * Помечает файл с идентификатором fileId как текущий
             * @param fileId - идентификатор объекта
             * @param files - массив объектов типа FileItem
             * @param destination - приемник найденного оюъекта
             */
            module.setCurrentFile = function (fileId, files, destination) {
                if (fileId !== undefined && files !== undefined && files.constructor === Array && destination !== undefined) {
                    $log.log("destination start value = ", destination.value);
                    angular.forEach(files, function (file) {
                        if (file.id.value === fileId) {
                            if (file.isActive === false) {
                                file.setToActive(true);
                                //destination = file;
                                destination.value = file.id.value;
                            } else {
                                file.setToActive(false);
                                destination.value = -1;
                            }
                        } else {
                            file.setToActive(false);
                        }
                    });
                    $log.log("destination id = ", destination.value);
                }
            };

            /**
             *
             * @param fileId
             * @param files
             */
            module.setCurrent = function (fileId, files) {
                if (fileId !== undefined && files !== undefined) {
                    angular.forEach(files, function (file) {
                        if (file.id.value === fileId) {
                            if (file.isActive === true) {
                                file.setToActive(true);
                                return file;
                            } else {
                                file.setToActive(false);
                            }
                        } else {
                            file.setToActive(false);
                        }
                    });
                }
            };


            /*** Получает файлы по id титула ***/
            module.getFilesByTituleId = function (tituleId, destination) {
                if (tituleId !== undefined && destination !== undefined) {
                    var params = {
                        action: "filesByTituleId",
                        data: {
                            id: tituleId
                        }
                    };
                    destination.splice(0, destination.length);
                    module.loading(true);
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
                            module.loading(false);
                        }
                    );
                }
            };

            /*** Отсылает информацию о загруженном файле на сервер ***/
            module.add = function (tituleId, userId, destination) {
                if (tituleId !== undefined && userId !== undefined && destination !== undefined) {
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
                                var temp_file = new FileItem();
                                temp_file.fromSOURCE(data);
                                destination.push(temp_file);
                            }
                        }
                    );
                }
            };


            /**
             * Удаляет файл с идентификатором fileId
             * @param {number} fileId Идентификатор файла
             * @param {function} callbackFn Callback-функция
             */
            module.delete = function (fileId, callbackFn) {
                if (fileId !== undefined) {
                    var params = {
                        action: "deleteById",
                        data: {
                            id: fileId
                        }
                    };
                    $http.post("server/controllers/files-controller.php", params)
                        .success(function (data) {
                            if (callbackFn !== undefined) {
                                callbackFn(data);
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