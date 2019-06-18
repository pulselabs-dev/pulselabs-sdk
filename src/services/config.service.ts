import { ConfigOptions } from '../interfaces/config-options.interface';

export class ConfigService {

  readonly shouldDebug: boolean;
  readonly timeout: number;
  readonly apiKey: string;
  readonly integrationType: string;
  constructor(configOptions: ConfigOptions) {
    this.apiKey = configOptions.apiKey;
    this.shouldDebug = configOptions.debug || false;
    this.timeout = configOptions.timeout || 2000;
    this.integrationType = configOptions.integrationType || '';
  }

}
