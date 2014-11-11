/*****
 * Класс модели данных, содержит вспомогательные методы
 *****/
function DataModel () {
    /* Инициализация объекта на основе переданного объекта с параметрами */
    this.init = function (parameters) {
        if (parameters) {
            for (var param in parameters) {
                if (this.hasOwnProperty(param))
                    this[param] = parameters[param];
            }
        }
    };
};


/*****
 * Класс пользователя
 *****/
function User () {
    this.id = 0;
    this.groupId = 0;
    this.email = "";
    this.name = "";
    this.fname = "";
    this.surname = "";
    this.phone = "";
};
User.prototype = new DataModel();
