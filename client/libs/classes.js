"use strict";

/*****
 * Класс поля данных
 *****/
function Field (parameters) {
    this.source = "";   // Источник данных поля
    this.value = 0;     // Значение поля

    if (parameters) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param))
                this[param] = parameters[param];
        }
    }

    /* Устанавливает источник данных поля */
    this.source = function (new_source) {
        if (new_source) {
            this.source = new_source;
            return this;
        }
    };

    /* Устанавливает значение поля */
    this.value = function (new_value) {
        if (new_value) {
            this.value = new_value;
            return this;
        }
    };

    return this;
};



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

    /* Инициализация объекта на основе JSON-данных */
    this.fromJSON = function (JSONdata) {
        if (JSONdata) {
            for (var data in JSONdata) {
                for (var field in this) {
                    if (this[field][source] == data) {
                        this[field][value] = JSONdata[data];
                    }
                }
            }
        }
    };

};



/*****
 * Класс пользователя
 *****/
function User () {
    this.id = new Field({ source: "ID", value: 0 });
    this.groupId = new Field({ source: "USER_GROUP_ID", value: 0 });
    this.email = new Field({ source: "EMAIL", value: "" });
    this.name = new Field({ source: "FNAME", value: "" });
    this.fname = new Field({ source: "SNAME", value: "" });
    this.surname = new Field({ source: "SURNAME", value: "" });
    this.phone = new Field({ source: "PHONE", value: "" });
};
User.prototype = new DataModel();
