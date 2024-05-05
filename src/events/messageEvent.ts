export abstract class MessageEvent<TParam, TResult> {
    /**
     * Should be an unique key to ensure the event are caught in the correct handler.
     * It is recommended to generate an UUID to use as eventKey.
     */
    abstract eventKey: string;

    invoke: invokeEvent<TParam, TResult> = (param?: TParam) => {
        return new Promise<TResult>((resolve) => {
            chrome.runtime.sendMessage<MessagePayload<TParam>, TResult>(
                { eventKey: this.eventKey, eventParams: param } as MessagePayload<TParam>,
                resolve
            );
        });
    };

    abstract eventHandler: (
        payload: MessagePayload<TParam>,
        sender: unknown,
        sendResponse: (response: TResult) => void
    ) => void;

    registerEvent(eventApi: chrome.runtime.ExtensionMessageEvent) {
        eventApi.addListener((message, sender, sendResponse) => {
            if ((message as MessagePayload<TParam>)?.eventKey === this.eventKey) {
                this.eventHandler(message, sender, sendResponse);
            }

            return true;
        });
    }

    protected async storeKey<TModel>(key: string, model: TModel) {
        const storageObject: { [key: string]: any } = {};
        storageObject[key] = JSON.stringify(model);
        chrome.storage.local.set(storageObject);
    }

    protected async fetchKey<TModel>(key: string): Promise<TModel | undefined> {
        return new Promise<TModel | undefined>((resolve) => {
            chrome.storage.local.get(key, (items) => {
                try {
                    const localModel = JSON.parse(items[key]);
                    if (localModel) {
                        resolve(localModel as TModel);
                    }
                } catch {
                    resolve(undefined);
                }
            });
        });
    }

    protected async clearStoredData(): Promise<void> {
        await chrome.storage.local.clear();
    }
}

type invokeEvent<TParam, TResult> = undefined extends TParam
    ? (param?: TParam) => Promise<TResult>
    : (param: TParam) => Promise<TResult>;

export interface MessagePayload<TParam> {
    eventKey: string;
    eventParams: TParam;
}
