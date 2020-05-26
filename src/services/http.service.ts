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

  async postData(data: ServerData, platform: Platform) : Promise<any> {
    const fetchResult = await fetch(`https://sdkapi.pulselabs.ai/api/sdk/v1/conversations/${platform}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      timeout: this.configService.timeout
    });

    // Based on https://github.com/node-fetch/node-fetch/pull/166 which was later reverted
    // due to compatibility issues with other packages.
    const jsonResponse =
      fetchResult.status === 204 ? {} : await fetchResult.json();

    if (fetchResult.ok) {
      return jsonResponse;
    } else {
      throw jsonResponse
    }
  }
}
