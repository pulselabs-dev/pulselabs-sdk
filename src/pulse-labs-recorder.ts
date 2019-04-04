import { HttpService } from './services/http.service';
import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import { LoggerService } from './services/logger.service';
import { IntegrationType } from './enums/integration-type.enum';
import { ServerData } from './interfaces/server-data.inetrface';
import { ConfigService } from './services/config.service';
import { InitOptions } from './interfaces/init-options.interface';

class PulseLabsRecorder {
  private static _instance: PulseLabsRecorder;

  private constructor(private httpService: HttpService, private logger: LoggerService, private configService:ConfigService) {
  }

  /**
   * This method is responsible for initialising apiKey and returning an object of class.
   *
   * Returns the old object if an object has already been created
   *
   * @param apiKey -> The apiKey allotted to the user
   */

  static init(apiKey: string, initOptions?:InitOptions): PulseLabsRecorder {

    if (this._instance) {
      return this._instance;
    }

    let configService = new ConfigService({...initOptions, apiKey: apiKey});
    let httpService = new HttpService(configService);
    let loggerService = new LoggerService(configService);

    this._instance = new PulseLabsRecorder(httpService, loggerService, configService);
    loggerService.logMessage('pulse labs recorder initialised');
    return this._instance;
  }

  /**
   * This method sends the request and response data to the pulselabs website for skills developed using alexa sdk
   * Return type -> A LambdaHandler function
   * @param lambdaHandler -> The lambda handler returned by the alexa sdk .lambda() method
   */

  handler(lambdaHandler: LambdaHandler): LambdaHandler {
    return (requestEnv, context, callback) => {
      this.logger.logMessage('[Request Received]', JSON.stringify(requestEnv));
      lambdaHandler(requestEnv, context, (error, result) => {
        this.logger.logMessage('[Response]', JSON.stringify(result));
        this.sendDataToServer(requestEnv, result, IntegrationType.ALEXA_SDK).then(() => {
          callback(error, result);
        }).catch(() => {
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

  logData(requestBody: any, response: any): Promise<any> {
    const isHostedOnAWS = !!(process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);
    let integrationType:IntegrationType;
    if(isHostedOnAWS) {
      integrationType = IntegrationType.LAMBDA;
    } else {
      integrationType = IntegrationType.REST_SERVER;
    }
    return this.sendDataToServer(requestBody, response, integrationType);
  }

  private sendDataToServer(request:any, response: any, integrationType:IntegrationType) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const date = yyyy + '/' + mm + '/' + dd;
    let data: ServerData = {
      timeSent: Date.now(),
      date: date,
      sdkPrivateKey: this.configService.apiKey,
      integration: integrationType,
      platform: 'alexa',
      payload: {
        request: request,
        response: response
      }
    };

    this.logger.logMessage('[Sending request and response data] ',JSON.stringify(data));
    return this.httpService.postData(data).then((res) => {
      this.logger.logMessage('Data sent to Pulse labs server');
      return res;
    }).catch(error => {
      this.logger.logMessage('Pulse labs Sdk error: ', JSON.stringify(error));
      return error;
    });
  }
}

export = PulseLabsRecorder;