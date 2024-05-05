import { MessageEvent, type MessagePayload } from "@/events/messageEvent";

export default class ClearStoredDataEvent extends MessageEvent<undefined, void> {
    eventKey: string = "6ff5ad87-3271-417a-87ed-9a6b1dc3aac6";
    eventHandler: (
        payload: MessagePayload<undefined>,
        sender: unknown,
        sendResponse: (response: void) => void
    ) => void = (payload, sender, sendResponse) => {
        chrome.storage.local.clear().then(() => sendResponse);
    };
}
