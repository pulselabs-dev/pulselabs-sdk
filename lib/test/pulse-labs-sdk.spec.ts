import { requestObject, responseObject } from './test-helpers/request-envelope';
import PulseLabsSdk = require('../pulse-labs-sdk');
import { RequestEnvelope } from 'ask-sdk-model';

describe("PulseLabsSdk", () => {
  let pulseLabsSdk: PulseLabsSdk;
  let httpService = {
    postData: jest.fn()
  };
  beforeEach(() => {
    const pulseLabdsSdkClass = PulseLabsSdk as any;
    pulseLabsSdk = new pulseLabdsSdkClass(httpService);
  });


  it("isInitialised should return a boolean value according to the value of apiKey", () => {
    expect((pulseLabsSdk as any).isInitialised()).toEqual(false);
    (pulseLabsSdk as any).apiKey = "randomApiKey";
    expect((pulseLabsSdk as any).isInitialised()).toEqual(true);
  });

  describe("log", () => {
    it("should call isInitialised and throw error if isInitialised return false", (done) => {
      const isInitialisedSpy = jest.spyOn((pulseLabsSdk as any), "isInitialised").mockReturnValue(false);
      try {
        pulseLabsSdk.log(requestObject, responseObject);
        done.fail();
      } catch(e) {
        expect(isInitialisedSpy).toHaveBeenCalledTimes(1);
        done();
      }
    });
    it("should call isInitialised and call postData if isInitialised return true", () => {
      const data = {
        request: requestObject,
        response: responseObject,
      };
      (pulseLabsSdk as any).isInitialised = jest.fn().mockReturnValue(true);
      pulseLabsSdk.log(requestObject, responseObject);
      expect(httpService.postData).toHaveBeenCalledTimes(1);
      expect(httpService.postData).toHaveBeenCalledWith(data);
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