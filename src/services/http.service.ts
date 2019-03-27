import * as request from 'request';
export class HttpService {
  constructor() {

  }

  /**
   This method is responsible for sending all the data that we get from user to pulselabs website.
   */

  postData(apiKey: string, data: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      request.post({
        url: 'https://http-reqbin.herokuapp.com/rsz7zirt?apiKey='+apiKey,
        json: true,
        body: data
      }, (error, response, body) => {
        if (error) {
          reject(JSON.stringify(error.body));
        }
        resolve();
      });
    });
  }
}