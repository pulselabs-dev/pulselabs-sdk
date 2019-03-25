import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import { ConfigOptions } from './interfaces/config-options.interface';
declare class PulseLabsRecorder {
    private httpService;
    private logger;
    private static _instance;
    private apiKey;
    private constructor();
    /**
     * This method is responsible for initialising apiKey and returning an object of class.
     *
     * Returns the old object if an object has already been created
     *
     * @param apiKey -> The apiKey allotted to the user
     */
    static init(apiKey: string, configOptions?: ConfigOptions): PulseLabsRecorder;
    /**
     * This method sends the request and response data to the pulselabs website for skills developed using alexa sdk
     * Return type -> A LambdaHandler function
     * @param lambdaHandler -> The lambda handler returned by the alexa sdk .lambda() method
     */
    handler(lambdaHandler: LambdaHandler): LambdaHandler;
    logLambdaData(requestBody: any, response: any): Promise<any>;
    logServerData(requestBody: any, response: any): Promise<any>;
    /**
     * This method is called to send request and response data to the pulselabs server.
     * Called in case when using lambda function or standalone node application
     * @param requestBody -> The requestBody sent by alexa
     * @param response -> The response sent by user
     */
    private logData;
}
export = PulseLabsRecorder;
