import type UserAuthenticationModel from "@/models/userAuthenticationModel";
import { MessageEvent, type MessagePayload } from "./messageEvent";
import { ChromeService } from "@/chromeService";
import { LocalStoageKeys } from "@/messagingService";

export class StoreAuthenticationEvent extends MessageEvent<UserAuthenticationModel, void> {
    eventKey: string = "f65856a5-6a3b-4822-b250-cf652dea8fc5";
    eventHandler: (
        payload: MessagePayload<UserAuthenticationModel>,
        sender: unknown,
        sendResponse: (response: void) => void
    ) => void = (payload, sender, sendResponse) => {
        ChromeService.storeKey(LocalStoageKeys.UserAuthenticationModel, payload.eventParams).then(
            () => sendResponse()
        );
    };
}
