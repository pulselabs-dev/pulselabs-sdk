import * as request from 'request';
export class HttpService {
  constructor() {

  }

  postData(data: any) {
    request({
      url: 'https://http-reqbin.herokuapp.com/1bbozy51',
      method: 'POST',
      json: true,
      body: data
    });
  }
}