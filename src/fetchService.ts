import { ChromeService, StorageKeys } from "./chromeService";
import type UserAuthenticationModel from "./models/userAuthenticationModel";
import { useAuthStore } from "./stores/authStore";

export default class FetchService {
    static async fetchModel<TModel>(
        url: string,
        fetchModel?: Partial<FetchModel>,
        requiresAuth: boolean = true
    ): Promise<{ data?: TModel; response?: Response }> {
        const headers: HeadersInit = [];
        const authStore = useAuthStore();
        if (fetchModel) {
            if (fetchModel.queryParams) {
                url = url + "?" + fetchModel.queryParams.toString();
            }
        }
        if (requiresAuth) {
            const auth = await ChromeService.fetchKey<UserAuthenticationModel>(
                StorageKeys.UserAuthentication
            );

            headers.push(["Authorization", `Bearer ${authStore.accessToken}`]);
        }

        let result: TModel | undefined;

        const response = await fetch(url, {
            headers: headers
        });

        if (response.ok) {
            try {
                result = await response.json();
            } catch (error) {
                return Promise.reject(error);
            }
        }

        return Promise.resolve({ data: result, response: response });
    }
}

export class FetchModel {
    queryParams?: URLSearchParams;
}
