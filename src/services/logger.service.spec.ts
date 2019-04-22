import { LoggerService } from './logger.service';

describe("LoggerService", () => {
  let loggerService: LoggerService;
  let configService = {
    shouldDebug: true
  } as any;
  beforeEach(() => {
    loggerService = new LoggerService(configService);
  });

  describe("logger", () => {
    it("should call console.log if shouldDebug is true", () => {
      const logSpy = jest.spyOn(console,"log");
      loggerService.logMessage("arguements");
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith("arguements");
    });
    it("should not call console.log if shouldDebug is false", () => {
      configService.shouldDebug = false;
      const logSpy = jest.spyOn(console,"log");
      loggerService.logMessage("arguements");
      expect(logSpy).toHaveBeenCalledTimes(0);
    })
  });

  afterEach(() => {
    jest.clearAllMocks();
  })
});