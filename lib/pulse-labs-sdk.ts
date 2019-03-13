import { HttpService } from './http.service';
import { CustomSkillBuilder, HandlerInput } from 'ask-sdk-core';

class PulseLabsSdk {
  private static _instance: PulseLabsSdk;

  private apiKey: string | null = null;

  private constructor(private httpService: HttpService) {
  }

  /**
   * This method is responsible for initialising apiKey and returning an object of class.
   *
   * Throws error if an object has already been created
   *
   * @param apiKey -> The apiKey allotted to the user
   */

  static init(apiKey: string): PulseLabsSdk {
    if (this._instance) {
      throw new Error("Already initialised with an apiKey");
    }
    // TODO:: send request to pulselabs site to verify apiKey. Once apiKey is verified create object for the class
    this._instance = new PulseLabsSdk(new HttpService());
    this._instance.apiKey = apiKey;
    return this._instance;
  }

  /**
   * This method is responsible for sending the request, response data for skills build using alexa Sdk
   *
   * Uses addResponseInterceptors method of skillBuilderClass defined by alexa
   *
   * @param skillBuilderClass -> the object to which the interceptor is to be attached
   *
   */

  attachInterceptor(skillBuilderClass: CustomSkillBuilder) {
    if(!this.isInitialised()) {
      throw new Error("Please call init function with api key before adding interceptor for your skill");
    }
    skillBuilderClass.addRequestInterceptors(this.handleIncomingRequest.bind(this));
    skillBuilderClass.addResponseInterceptors(this.handleOutgoingResponse.bind(this));
  }

  /**
   * This method is called to send request to the pulselabs server.
   * Called in case when using lambda function or standalone node application
   * @param requestBody -> The requestBody sent by alexa
   */

  logIncomingMessage(requestBody: any) {
    let data = {
      request: requestBody
    };
    if(!this.isInitialised()) {
      throw new Error("Please call init function with api key before sending the data");
    }
    this.httpService.postData(data);
  }

  /**
   * This method is called to send request and response data to the pulselabs server.
   * Called in case when using lambda function or standalone node application
   * @param requestBody -> The requestBody sent by alexa
   * @param response -> The response sent by user
   */

  logOutgoingMessage(requestBody: any, response: any) {
    if(!this.isInitialised()) {
      throw new Error("Please call init function with api key before sending the data");
    }
    let data = {
      request: requestBody,
      response: response,
    };
    this.httpService.postData(data)
  }

  /**
   * This method is responsible for checking if apiKey has been set
   *
   */

  private isInitialised() {
    return !!this.apiKey;
  }

  /**
   * This method handles sending of request body for skills build using alexaSdk
   *
   * @param handlerInput passed to the response interceptors by alexa, can be used to get the request and response object
   *
   */

  private handleIncomingRequest(handlerInput: HandlerInput) {
    let requestBody = handlerInput.requestEnvelope;
    this.logIncomingMessage(requestBody);
  }

  /**
   * This method handles sending of response for skills build using alexaSdk
   *
   * @param handlerInput passed to the response interceptors by alexa, can be used to get the request and response object
   *
   */

  private handleOutgoingResponse(handlerInput: HandlerInput) {
    let requestBody = handlerInput.requestEnvelope;
    let response = handlerInput.responseBuilder.getResponse();
    this.logOutgoingMessage(requestBody, response);
  }

}

export = PulseLabsSdk;