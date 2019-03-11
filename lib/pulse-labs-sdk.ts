import { HttpService } from './http.service';
import { CustomSkillBuilder, HandlerInput } from 'ask-sdk-core';
import * as http from "http";
import { RequestListener } from "http";

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

  addAlexaInterceptor(skillBuilderClass: CustomSkillBuilder) {
    if(!this.isInitialised) {
      throw new Error("Please call init function with api key before adding interceptor for your skill");
    }
    skillBuilderClass.addResponseInterceptors(this.handleResponse.bind(this));
  }

  /**
   * This function is responsible for intercepting request , response object for self hosted node skills
   *
   * @param endPoints defines which routes to intercept. An empty array intercepts all the request sent on server
   *
   */

  addNodeInterceptor(endPoints: string[] = []) {
    if(!this.isInitialised) {
      throw new Error("Please call init function with api key before adding interceptor for your skill");
    }
    const oldCreateServer = http.createServer;
    (http as any).createServer = (callback: RequestListener) => {
      return oldCreateServer((req, res) => {
        if(!endPoints.length || endPoints.find(endpoint => endpoint === req.url)) {
          let request: any, response;
          let reqBody = '';
          req.on('data', chunk => {
            reqBody += chunk;
          });
          req.on('end', () => {
            try{
              request = JSON.parse(reqBody);
            } catch (e) {
              throw new Error('Something unexpected occurred while processing incoming request');
            }
          });

          let resBody = '';
          const oldWrite = res.write;
          res.write = (...args:any) => {
            resBody +=args[0];
            return oldWrite.apply(res, args);
          };

          const oldEnd = res.end;
          res.end = (...args : any) => {
            if(args[0]) {
              resBody +=args[0];
            }
            try {
              response = JSON.parse(resBody);
              let data = {
                request: request,
                response: response,
                skillType: 'SelfHosted'
              };
              this.httpService.postData(data);
            } catch (e) {
              throw new Error('Something unexpected occurred while processing outgoing response');
            }
            return oldEnd.apply(res, args);
          };
        }
        return callback(req,res);
      });
    };
  }

  /**
   * This method is called for skills generated using lambda function but without using alexa sdk
   *
   * Must be called every time before sending response
   *
   * @param request -> The request object provided by amazon server
   *
   * @param response -> The response object sent by the user in response to alexa request
   *
   */

  sendRequestResponseData(request: any, response: any) {
    if(!this.isInitialised) {
      throw new Error("Please call init function with api key before sending the data");
    }
    let data = {
      request: request,
      response: response,
      skillType: 'Lambda'
    };
    this.httpService.postData(data);
  }

  /**
   * This method is responsible for checking if apiKey has been set
   *
   */

  private isInitialised() {
    return !!this.apiKey;
  }

  /**
   * This method handles sending of response for skills build using alexaSdk
   *
   * @param handlerInput passed to the response interceptors by alexa, can be used to get the request and response object
   *
   */

  private handleResponse(handlerInput: HandlerInput) {
    let data: any = {};
    data['request'] = handlerInput.requestEnvelope;
    data['response'] = handlerInput.responseBuilder.getResponse();
    data['skillType'] = 'AlexaSdk';
    this.httpService.postData(data);
  }

}

export = PulseLabsSdk;