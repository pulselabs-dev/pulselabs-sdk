import { ConfigService } from './config.service';

describe("ConfigService", () => {
  let configService: ConfigService;

  it("should set class varibles at the time of object creation", () => {
    configService = new ConfigService({apiKey:'randomKey',timeout:1000})
    expect(configService.timeout).toEqual(1000);
    expect(configService.shouldDebug).toEqual(false);
    expect(configService.apiKey).toEqual('randomKey');
  })

});