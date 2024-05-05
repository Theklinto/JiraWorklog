import { MessageEvent } from "@/events/messageEvent";
import { StoreAuthenticationEvent } from "@/events/auth/storeAuthenticationEvent";
import { GetAuthenticationEvent } from "@/events/auth/getAuthenticationEvent";
import AuthenticateEvent from "@/events/auth/authenticateEvent";
import ClearStoredDataEvent from "@/events/data/clearStoredDataEvent";
import GetStoredDataEvent from "@/events/data/getStoredDataEvent";

export enum LocalStoageKeys {
    CustomWorklogs = "CustomWorklogs",
    UserAuthenticationModel = "UserAuthenticationModel"
}

export class MessagingService {
    //Events
    static storeAuthentication = new StoreAuthenticationEvent();
    static getAuthentication = new GetAuthenticationEvent();
    static authenticate = new AuthenticateEvent();

    static clearStoredData = new ClearStoredDataEvent();
    static getStoredData = new GetStoredDataEvent();

    static getEvents(): MessageEvent<any, any>[] {
        return Object.values(this).filter<MessageEvent<any, any>>(
            (val): val is MessageEvent<any, any> => val
        );
    }
}
