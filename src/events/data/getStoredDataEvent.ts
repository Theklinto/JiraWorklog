import { MessageEvent, type MessagePayload } from "@/events/messageEvent";

export default class GetStoredDataEvent extends MessageEvent<undefined, { [key: string]: any }> {
    eventKey: string = "96c35145-6284-4557-afe7-ca917d9e0927";
    eventHandler: (
        payload: MessagePayload<undefined>,
        sender: unknown,
        sendResponse: (response: object) => void
    ) => void = (payload, sender, sendResponse) => {
        chrome.storage.local.get(null).then((value) => {
            sendResponse(value);
        });
    };
}
