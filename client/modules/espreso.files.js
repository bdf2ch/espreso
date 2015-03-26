/*****
 *
 *****/

var files = angular.module("espreso.files", [])
    .config(function ($provide) {
        $provide.factory("$files", ["$log", "$http", function ($log, $http) {
            var module = {};

            module.files = new Collection();

            module.getFilesByTituleId = function (tituleId) {
                if (tituleId !== undefined) {
                    var params = {
                        id: tituleId
                    };
                    $http.post("server/controllers/documentation-controller.php", params)
                        .success(function (data) {
                            if (data && parseInt(data) !== 0) {

                            }
                        });
                }
            };

            return module;
        }]);
    })
    .run(function () {

    }
);