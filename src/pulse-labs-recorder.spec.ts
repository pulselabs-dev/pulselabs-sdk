import { requestObject, responseObject } from './test-helpers/request-envelope';
import PulseLabsRecorder = require('./pulse-labs-recorder');
import { RequestEnvelope } from 'ask-sdk-model';
import { IntegrationType } from './enums/integration-type.enum';

describe("PulseLabsRecorder", () => {
  let pulseLabsRecorder: PulseLabsRecorder;
  let httpService = {
    postData: jest.fn().mockResolvedValue("")
  };
  let loggerService = {
    logMessage: jest.fn()
  };
  let configService = {
    apiKey: 'randomKey',
    integrationType: ''
  };
  beforeEach(() => {
    const pulseLabsRecorderClass = PulseLabsRecorder as any;
    pulseLabsRecorder = new pulseLabsRecorderClass(httpService, loggerService, configService);
  });

  describe("sendDataToServer", () => {
    it("should call postData and logMessage", () => {
      (pulseLabsRecorder as any).sendDataToServer(requestObject, responseObject, IntegrationType.ALEXA_SDK);
      expect(httpService.postData).toHaveBeenCalledTimes(1);
      expect(loggerService.logMessage).toHaveBeenCalledTimes(1);

    });

    it("should return error returned by postData function if it fails", async() => {
      httpService.postData.mockRejectedValue("error");
      let returnVal = await (pulseLabsRecorder as any).sendDataToServer(requestObject, responseObject, IntegrationType.LAMBDA);
      expect(returnVal).toEqual("error");
      expect(loggerService.logMessage).toHaveBeenCalledTimes(2);
    });

  });

  describe("logData", () => {
    it("should call sendDataToServer with correct params", () => {
      const sendDataSpy = jest.spyOn(pulseLabsRecorder as any, "sendDataToServer");
      pulseLabsRecorder.logData(requestObject, responseObject);
      expect(sendDataSpy).toHaveBeenCalledTimes(1);
      expect(sendDataSpy).toHaveBeenCalledWith(requestObject,responseObject,IntegrationType.REST_SERVER);
      process.env.LAMBDA_TASK_ROOT = 'environmentVariable';
      pulseLabsRecorder.logData(requestObject, responseObject);
      expect(sendDataSpy).toHaveBeenCalledWith(requestObject,responseObject,IntegrationType.LAMBDA);
    });
  });

  describe("handler", () => {
    it("should call original lambdaHandler and logger when the returned function is called", () => {
      const lambdaHandler = jest.fn();
      const returnedFunction = pulseLabsRecorder.handler(lambdaHandler);
      returnedFunction({} as RequestEnvelope, {}, () => {});
      expect(lambdaHandler).toHaveBeenCalledTimes(1);
      expect(loggerService.logMessage).toHaveBeenCalledTimes(1);
    });

    it("should call logMessage, sendDataToServer and the original callback when callback is called", async () => {
      (pulseLabsRecorder as any).sendDataToServer = jest.fn().mockResolvedValue("");
      const callback = jest.fn();
      const lambdaHandler = jest.fn();
      const returnedFunction = pulseLabsRecorder.handler(lambdaHandler);
      returnedFunction({} as RequestEnvelope, {}, callback);
      const callBackToHandler = lambdaHandler.mock.calls[0][2];
      await callBackToHandler();
      expect((pulseLabsRecorder as any).sendDataToServer).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

  });

  afterEach(() => {
    jest.clearAllMocks();
  })
});
