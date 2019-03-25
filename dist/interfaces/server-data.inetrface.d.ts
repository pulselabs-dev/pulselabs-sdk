import { IntegrationType } from '../enums/integration-type.enum';
export interface ServerData {
    timeSent: number;
    date: string;
    sdkPrivateKey: string;
    integration: IntegrationType;
    platform: string;
    payload: {
        request: any;
        response: any;
    };
}
