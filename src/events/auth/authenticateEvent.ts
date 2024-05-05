import { MessageEvent, type MessagePayload } from "@/events/messageEvent";
import { v4 as uuidv4 } from "uuid";

export default class AuthenticateEvent extends MessageEvent<undefined, string | undefined> {
    eventKey: string = "f0616159-9283-4d3b-9666-a5362d6df92b";
    eventHandler: (
        payload: MessagePayload<undefined>,
        sender: unknown,
        sendResponse: (response: string | undefined) => void
    ) => void = (message, sender, sendResponse) => {
        const uuid = uuidv4();
        const redirectUri = (import.meta.env.VITE_AUTH_REDIRECT_URL as string).replace(
            import.meta.env.VITE_AUTH_REDIRECT_URL_STATE_PLACEHOLDER,
            uuid
        );
        console.log("Launching oath2 flow using url:", redirectUri);
        chrome.identity
            .launchWebAuthFlow({
                url: redirectUri,
                interactive: true
            })
            .then((result) => sendResponse(result));
    };
}
