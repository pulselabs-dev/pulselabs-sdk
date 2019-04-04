import { ConfigService } from './config.service';

export class LoggerService {

  constructor(private configService:ConfigService) {

  }

  /*
   * This method is responsible for logging information based on the config set by User
   */

  logMessage(...args) {
    if(this.configService.shouldDebug) {
      console.log(...args);
    }
  }
}