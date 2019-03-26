import { requestObject, responseObject } from './test-helpers/request-envelope';
import PulseLabsSdk = require('../pulse-labs-sdk');
import { RequestEnvelope } from 'ask-sdk-model';

describe("PulseLabsSdk", () => {
  let pulseLabsSdk: PulseLabsSdk;
  let httpService = {
    postData: jest.fn().mockResolvedValue("")
  };
  beforeEach(() => {
    const pulseLabdsSdkClass = PulseLabsSdk as any;
    pulseLabsSdk = new pulseLabdsSdkClass(httpService);
  });

  describe("log", () => {
    it("should call postData", () => {
      (pulseLabsSdk as any).apiKey = "secret";
      const data = {
        request: requestObject,
        response: responseObject,
      };
      pulseLabsSdk.log(requestObject, responseObject);
      expect(httpService.postData).toHaveBeenCalledTimes(1);
      expect(httpService.postData).toHaveBeenCalledWith("secret",data);
    });

    it("should return error returned by postData function if it fails", async() => {
      httpService.postData = jest.fn().mockRejectedValue("error");
      let returnVal = await pulseLabsSdk.log(requestObject, responseObject);
      expect(returnVal).toEqual("error");
    });

  });

  describe("handler", () => {
    it("should call original lambdaHandler when the returned function is called", () => {
      const lambdaHandler = jest.fn();
      const returnedFunction = pulseLabsSdk.handler(lambdaHandler);
      returnedFunction({} as RequestEnvelope, {}, () => {});
      expect(lambdaHandler).toHaveBeenCalledTimes(1);
    });

    it("should call logOutgoingMessage and the original callback when callback is called", async () => {
      pulseLabsSdk.log = jest.fn().mockResolvedValue("");
      const callback = jest.fn();
      const lambdaHandler = jest.fn();
      const returnedFunction = pulseLabsSdk.handler(lambdaHandler);
      returnedFunction({} as RequestEnvelope, {}, callback);
      const callBackToHandler = lambdaHandler.mock.calls[0][2];
      await callBackToHandler();
      expect(pulseLabsSdk.log).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

  });

  afterEach(() => {
    jest.clearAllMocks();
  })
});