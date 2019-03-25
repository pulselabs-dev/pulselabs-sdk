"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var HttpService = /** @class */ (function () {
    function HttpService() {
    }
    /**
     This method is responsible for sending all the data that we get from user to pulselabs website.
     */
    HttpService.prototype.postData = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request.post({
                url: 'https://http-reqbin.herokuapp.com/1nu7usu1',
                json: true,
                body: data,
                timeout: _this.timeout
            }, function (error, response, body) {
                if (error) {
                    reject(JSON.stringify(error.body));
                }
                resolve();
            });
        });
    };
    return HttpService;
}());
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map