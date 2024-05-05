import type UserAuthenticationModel from "@/models/userAuthenticationModel";
import { MessageEvent, type MessagePayload } from "@/events/messageEvent";

export class StoreAuthenticationEvent extends MessageEvent<UserAuthenticationModel, void> {
    static storageKey: string = "f65856a5-6a3b-4822-b250-cf652dea8fc5";
    eventKey: string = StoreAuthenticationEvent.storageKey;

    eventHandler: (
        payload: MessagePayload<UserAuthenticationModel>,
        sender: unknown,
        sendResponse: (response: void) => void
    ) => void = (payload, sender, sendResponse) => {
        this.storeKey(StoreAuthenticationEvent.storageKey, payload.eventParams).then(() =>
            sendResponse()
        );
    };
}
