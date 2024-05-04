import type UserAuthenticationModel from "@/models/userAuthenticationModel";
import { MessageEvent, type MessagePayload } from "./messageEvent";
import { ChromeService } from "@/chromeService";
import { LocalStoageKeys } from "@/messagingService";

export class GetAuthenticationEvent extends MessageEvent<
    undefined,
    UserAuthenticationModel | undefined
> {
    eventKey: string = "a45925df-5e27-402e-93f4-12756d484a89";
    eventHandler: (
        payload: MessagePayload<undefined>,
        sender: unknown,
        sendResponse: (response: UserAuthenticationModel | undefined) => void
    ) => void = (payload, sender, sendResponse) => {
        ChromeService.fetchKey<UserAuthenticationModel>(
            LocalStoageKeys.UserAuthenticationModel
        ).then((model) => sendResponse(model));
    };
}
