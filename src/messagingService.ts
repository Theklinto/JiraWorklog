import { MessageEvent } from "@/events/messageEvent";
import { StoreAuthenticationEvent } from "./events/storeAuthenticationEvent";
import { GetAuthenticationEvent } from "./events/getAuthenticationEvent";

export enum LocalStoageKeys {
    CustomWorklogs = "CustomWorklogs",
    UserAuthenticationModel = "UserAuthenticationModel"
}

export class MessagingService {
    //Events
    static storeAuthenticationStatus = new StoreAuthenticationEvent();
    static getAuthentication = new GetAuthenticationEvent();

    static getEvents(): MessageEvent<any, any>[] {
        return Object.values(this).filter<MessageEvent<any, any>>(
            (val): val is MessageEvent<any, any> => val
        );
    }
}
