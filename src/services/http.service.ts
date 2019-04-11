import * as request from 'request';
import { ServerData } from '../interfaces/server-data.inetrface';
import { ConfigService } from './config.service';
export class HttpService {

  constructor(private configService:ConfigService) {

  }

  /**
   This method is responsible for sending all the data that we get from user to pulselabs website.
   */

  postData(data: ServerData) : Promise<any> {
    return new Promise((resolve, reject) => {
      request.post({
        url: 'https://sdkapi.pulselabs.ai/api/sdk/v1/conversations',
        json: true,
        body: data,
        timeout: this.configService.timeout
      }, (error, response, body) => {
        if (error) {
          reject(JSON.stringify(error.body));
        }
        resolve();
      });
    });
  }
}