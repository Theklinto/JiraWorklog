import { ChromeService } from "@/chromeService";
import { MessageEvent, type MessagePayload } from "@/events/messageEvent";

export class GetAuthenticationStatusEvent extends MessageEvent<undefined, boolean> {
    eventKey: string = "a701937b-da68-4f90-80f1-d33b1218613c";
    eventHandler: (
        payload: MessagePayload<undefined>,
        sender: unknown,
        sendResponse: (response: boolean) => void
    ) => void = async (payload, sender, sendResponse) => {
        await ChromeService.storeKey<string>(this.eventKey, "Det er en test");
        const test = await ChromeService.fetchKey<string>(this.eventKey);

        console.log("Key fetched from service: ", test);
        sendResponse(true);
    };
}
