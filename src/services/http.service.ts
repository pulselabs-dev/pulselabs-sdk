import { Platform } from "../enums/platform.enum";
import { ServerData } from '../interfaces/server-data.inetrface';
import { ConfigService } from './config.service';
import fetch from "node-fetch";

export class HttpService {

  constructor(private configService:ConfigService) {

  }

  /**
   This method is responsible for sending all the data that we get from user to pulselabs website.
   */

  postData(data: ServerData, platform: Platform) : Promise<any> {
    return fetch(`https://sdkapi.pulselabs.ai/api/sdk/v1/conversations/${platform}`, {
      method: "POST",
      body: JSON.stringify(data),
      timeout: this.configService.timeout
    }).catch(error => {
      throw JSON.stringify(error.body);
    });
  }
}
