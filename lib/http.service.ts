import * as request from 'request';
export class HttpService {
  constructor() {

  }

  /**
   This method is responsible for sending all the data that we get from user to pulselabs website.
   */

  postData(data: any) {
    request.post({
      url: 'https://http-reqbin.herokuapp.com/1p2uobb1',
      json: true,
      body: data
    });
  }
}