import { HttpService } from './http.service';
import { CustomSkillBuilder, HandlerInput } from 'ask-sdk-core';
import * as http from "http";
import { RequestListener } from "http";

export default class PulseLabsSdk {
  private static _instance: PulseLabsSdk;

  private httpService: HttpService;

  private constructor(private apiKey: string){
    this.httpService = new HttpService();
  }

  static init(apiKey: string): PulseLabsSdk {
    if (this._instance) {
      throw new Error("Already initialised with an apiKey");
    }

    this._instance = new PulseLabsSdk(apiKey);
    return this._instance;
  }

  attachInterceptor(skillBuilderClass: CustomSkillBuilder) {
    if(!this.isInitialised) {
      throw new Error("Please call init function with api key before adding interceptor for your skill");
    }
    skillBuilderClass.addResponseInterceptors(this.handleResponse.bind(this));
  }

  setInterceptUrls(endPoints: string[] = []) {
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
                response: response
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

  sendRequestResponseData(request: any, response: any) {
    if(!this.isInitialised) {
      throw new Error("Please call init function with api key before sending the data");
    }
    let data = {
      request: request,
      response: response
    };
    this.httpService.postData(data);
  }

  private isInitialised() {
    return !!this.apiKey;
  }

  private handleResponse(handlerInput: HandlerInput) {
    let data: any = {};
    data['request'] = handlerInput.requestEnvelope;
    data['response'] = handlerInput.responseBuilder.getResponse();
    this.httpService.postData(data);
  }

}
