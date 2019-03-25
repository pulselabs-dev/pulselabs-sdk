import { HttpService } from './http.service';
import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';

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
   * This method sends the request and response data to the pulselabs website for skills developed using alexa sdk
   * Return type -> A LambdaHandler function
   * @param lambdaHandler -> The lambda handler returned by the alexa sdk .lambda() method
   */

  handler(lambdaHandler: LambdaHandler): LambdaHandler {
    return (requestEnv, context, callback) => {
      lambdaHandler(requestEnv, context, (error, result) => {
        this.logOutgoingMessage(requestEnv, result).finally(() => {
          callback(error, result);
        });
      });
    };
  }

  /**
   * This method is called to send request and response data to the pulselabs server.
   * Called in case when using lambda function or standalone node application
   * @param requestBody -> The requestBody sent by alexa
   * @param response -> The response sent by user
   */

  logOutgoingMessage(requestBody: any, response: any): Promise<any> {
    if(!this.isInitialised()) {
      throw new Error("Please call init function with api key before sending the data");
    }
    let data = {
      request: requestBody,
      response: response,
    };
    return this.httpService.postData(data);
  }

  /**
   * This method is responsible for checking if apiKey has been set
   *
   */

  private isInitialised() {
    return !!this.apiKey;
  }

}

export = PulseLabsSdk;