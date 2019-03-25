import * as request from 'request';
export class HttpService {
  constructor() {

  }

  /**
   This method is responsible for sending all the data that we get from user to pulselabs website.
   */

  postData(data: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      request.post({
        url: 'https://http-reqbin.herokuapp.com/w7jjc9w7',
        json: true,
        body: data
      }, (error, response, body) => {
        if (error) {
          reject('Some error occurred while sending data');
        }
        resolve('');
      });
    });
  }
}