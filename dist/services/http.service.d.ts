import { ServerData } from '../interfaces/server-data.inetrface';
export declare class HttpService {
    timeout: any;
    constructor();
    /**
     This method is responsible for sending all the data that we get from user to pulselabs website.
     */
    postData(data: ServerData): Promise<any>;
}
