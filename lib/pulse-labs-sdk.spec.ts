import PulseLabsSdk = require('./pulse-labs-sdk');
import { requestObject, responseObject } from './test-helpers/request-envelope';

describe("PulseLabsSdk", () => {
  let pulseLabsSdk: PulseLabsSdk;
  let httpService = {
    postData: jest.fn()
  };
  beforeEach(() => {
    const pulseLabdsSdkClass = PulseLabsSdk as any;
    pulseLabsSdk = new pulseLabdsSdkClass(httpService);
  });

  it('handleResponse should call postData method with correct data', () => {
    const handlerInput = {
      requestEnvelope: requestObject,
      responseBuilder: {
        getResponse: () => {
          return responseObject;
        }
      }
    };
    const data = {
      request: requestObject,
      response: responseObject,
      skillType: 'AlexaSdk'
    };
    (pulseLabsSdk as any).handleResponse(handlerInput);
    expect(httpService.postData).toHaveBeenCalledTimes(1);
    expect(httpService.postData).toHaveBeenCalledWith(data);
  });

  it("isInitialised should return a boolean value according to the value of apiKey", () => {
    expect((pulseLabsSdk as any).isInitialised()).toEqual(false);
    (pulseLabsSdk as any).apiKey = "randomApiKey";
    expect((pulseLabsSdk as any).isInitialised()).toEqual(true);
  });

  describe("sendRequestResponseData", () => {
    it("should call isInitialised and throw error if isInitialised return false", (done) => {
      const isInitialisedSpy = jest.spyOn((pulseLabsSdk as any), "isInitialised").mockReturnValue(false);
      try {
        pulseLabsSdk.sendRequestResponseData(requestObject, responseObject);
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
        skillType: 'Lambda'
      };
      (pulseLabsSdk as any).isInitialised = jest.fn().mockReturnValue(true);
      pulseLabsSdk.sendRequestResponseData(requestObject, responseObject);
      expect(httpService.postData).toHaveBeenCalledTimes(1);
      expect(httpService.postData).toHaveBeenCalledWith(data);
    });
  });

  describe("addAlexaInterceptor", () => {
    let skillBuilderClass: any;
    beforeEach(() => {
      skillBuilderClass = {
        addResponseInterceptors: jest.fn()
      }
    });
    it("should call isInitialised and throw error if isInitialised return false", (done) => {
      const isInitialisedSpy = jest.spyOn((pulseLabsSdk as any), "isInitialised").mockReturnValue(false);
      try {
        pulseLabsSdk.addAlexaInterceptor(skillBuilderClass);
        done.fail();
      } catch(e) {
        expect(isInitialisedSpy).toHaveBeenCalledTimes(1);
        done();
      }
    });

    it("should call addResponseInterceptors method with correct parameter if isInitialised return true", () => {
      (pulseLabsSdk as any).isInitialised = jest.fn().mockReturnValue(true);
      pulseLabsSdk.addAlexaInterceptor(skillBuilderClass);
      expect(skillBuilderClass.addResponseInterceptors).toHaveBeenCalledTimes(1);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  })
});