"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoggerService = /** @class */ (function () {
    function LoggerService() {
    }
    /*
     * This method is responsible for logging information based on the config set by User
     */
    LoggerService.prototype.logMessage = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.shouldDebug) {
            console.log.apply(console, args);
        }
    };
    return LoggerService;
}());
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map