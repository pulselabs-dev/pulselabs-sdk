"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var http_service_1 = require("./services/http.service");
var logger_service_1 = require("./services/logger.service");
var integration_type_enum_1 = require("./enums/integration-type.enum");
var PulseLabsRecorder = /** @class */ (function () {
    function PulseLabsRecorder(httpService, logger) {
        this.httpService = httpService;
        this.logger = logger;
        this.apiKey = '';
    }
    /**
     * This method is responsible for initialising apiKey and returning an object of class.
     *
     * Returns the old object if an object has already been created
     *
     * @param apiKey -> The apiKey allotted to the user
     */
    PulseLabsRecorder.init = function (apiKey, configOptions) {
        if (this._instance) {
            return this._instance;
        }
        var defaultConfig = {
            debug: false,
            timeout: 1000
        };
        var config = __assign({}, defaultConfig, (configOptions || {}));
        var httpService = new http_service_1.HttpService();
        var loggerService = new logger_service_1.LoggerService();
        httpService.timeout = config.timeout;
        loggerService.shouldDebug = config.debug;
        this._instance = new PulseLabsRecorder(httpService, loggerService);
        this._instance.apiKey = apiKey;
        return this._instance;
    };
    /**
     * This method sends the request and response data to the pulselabs website for skills developed using alexa sdk
     * Return type -> A LambdaHandler function
     * @param lambdaHandler -> The lambda handler returned by the alexa sdk .lambda() method
     */
    PulseLabsRecorder.prototype.handler = function (lambdaHandler) {
        var _this = this;
        return function (requestEnv, context, callback) {
            _this.logger.logMessage('[Received Request Envelope]', requestEnv);
            lambdaHandler(requestEnv, context, function (error, result) {
                _this.logger.logMessage('[Response Sent By Skill]', result);
                _this.logData(requestEnv, result, integration_type_enum_1.IntegrationType.ALEXA_SDK).then(function () {
                    callback(error, result);
                }).catch(function () {
                    callback(error, result);
                });
            });
        };
    };
    PulseLabsRecorder.prototype.logLambdaData = function (requestBody, response) {
        return this.logData(requestBody, response, integration_type_enum_1.IntegrationType.LAMBDA);
    };
    PulseLabsRecorder.prototype.logServerData = function (requestBody, response) {
        return this.logData(requestBody, response, integration_type_enum_1.IntegrationType.REST_SERVER);
    };
    /**
     * This method is called to send request and response data to the pulselabs server.
     * Called in case when using lambda function or standalone node application
     * @param requestBody -> The requestBody sent by alexa
     * @param response -> The response sent by user
     */
    PulseLabsRecorder.prototype.logData = function (requestBody, response, integration) {
        this.logger.logMessage('Pulse labs recorder method called');
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var date = yyyy + '/' + mm + '/' + dd;
        var data = {
            timeSent: Date.now(),
            date: date,
            sdkPrivateKey: this.apiKey,
            integration: integration,
            platform: 'alexa',
            payload: {
                request: requestBody,
                response: response
            }
        };
        this.logger.logMessage('[Sending following data to pulse labs server]', data);
        return this.httpService.postData(data).catch(function (error) {
            console.log("Pulse labs Sdk error: ", JSON.stringify(error));
            return error;
        });
    };
    return PulseLabsRecorder;
}());
module.exports = PulseLabsRecorder;
//# sourceMappingURL=pulse-labs-recorder.js.map