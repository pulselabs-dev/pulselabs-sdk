export interface ServerData {
  timeSent: number,
  date: string,
  sdkPrivateKey: string,
  /*
    Changing type to string here so that if in future, someone decides
    to wrap our sdk code, we don't have to change anything
   */
  integration: string,
  platform: string,
  payload: {
    request: any,
    response: any
  }
}
