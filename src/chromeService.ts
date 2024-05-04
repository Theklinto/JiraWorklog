import FetchService from "./fetchService";
import UserAuthenticationModel from "./models/userAuthenticationModel";
import { useAuthStore } from "./stores/authStore";

export enum MessageTypes {
    "LaunchAuthenticationFlow"
}
export enum StorageKeys {
    "UserAuthentication" = "UserAuthentication",
    "CloudId" = "CloudId"
}

export class ChromeService {
    static async isAuthenticated(): Promise<{
        authenticated: boolean;
        authModel?: UserAuthenticationModel;
    }> {
        const userAuthentication = await this.fetchKey(StorageKeys.UserAuthentication);
        console.log("UserAuthentication", userAuthentication);
        if (userAuthentication) {
            return Promise.resolve({ authenticated: true, authModel: userAuthentication });
        }

        return Promise.resolve({ authenticated: false });
    }

    static async launchAuthenticationFlow(): Promise<UserAuthenticationModel | undefined> {
        return new Promise<UserAuthenticationModel | undefined>((resolve) => {
            chrome.runtime.sendMessage<MessageTypes, string | undefined>(
                MessageTypes.LaunchAuthenticationFlow,
                async (resultUrl) => {
                    console.log("AuthenticationFlow resulted in url", resultUrl);

                    const searchParams = new URLSearchParams(resultUrl);
                    const code = searchParams.get("code");
                    if (code) {
                        const model = await this.fetchAccessTokenByCode(code);
                        resolve(model);
                    }

                    resolve(undefined);
                }
            );
        });
    }

    private static async fetchAccessTokenByCode(code: string): Promise<UserAuthenticationModel> {
        const result = await fetch("https://auth.atlassian.com/oauth/token", {
            method: "POST",
            headers: [["content-type", "application/json"]],
            body: JSON.stringify({
                grant_type: "authorization_code",
                client_id: import.meta.env.VITE_CLIENT_ID,
                client_secret: import.meta.env.VITE_CLIENT_SECRET,
                code: code,
                redirect_uri: "https://flfidhhlmghmnfinhfmipcandlcifhem.chromiumapp.org"
            })
        });

        try {
            const resultBody = await result.json();
            const userAuthenticationModel = UserAuthenticationModel.parse(resultBody);

            const cloudId = await this.fetchCloudId(userAuthenticationModel);

            await this.storeKey(StorageKeys.UserAuthentication, userAuthenticationModel);
            const accountId = await this.fetchCurrentUserId(
                cloudId,
                userAuthenticationModel.accessToken ?? ""
            );

            const authStore = useAuthStore();
            authStore.accessToken = userAuthenticationModel.accessToken;
            authStore.cloudId = cloudId;
            authStore.accountId = accountId;

            return userAuthenticationModel;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private static async fetchCloudId(authModel: UserAuthenticationModel): Promise<string> {
        const response = await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
            headers: [["Authorization", `Bearer ${authModel.accessToken}`]]
        });

        const responseObject = await response.json();
        const cloudId = responseObject[0].id;

        console.log("CloudId", cloudId);

        this.storeKey(StorageKeys.CloudId, cloudId);

        return cloudId;
    }

    private static async fetchCurrentUserId(
        cloudId: string,
        authToken: string
    ): Promise<string | undefined> {
        const response = await fetch(
            `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/myself`,
            {
                headers: [["Authorization", `Bearer ${authToken}`]]
            }
        );
        const accountId = (await response.json()).accountId;

        return accountId;
    }

    static async storeKey<TModel>(key: StorageKeys | string, model: TModel) {
        const storageObject: { [key: string]: any } = {};
        storageObject[key] = JSON.stringify(model);
        chrome.storage.local.set(storageObject);
    }

    static async fetchKey<TModel>(key: StorageKeys | string): Promise<TModel | undefined> {
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

    public static async clearStoredData(): Promise<void> {
        await chrome.storage.local.clear();
    }
}
