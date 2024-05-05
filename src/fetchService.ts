import { MessagingService } from "@/messagingService";
import type UserAuthenticationModel from "./models/userAuthenticationModel";

export default class FetchService {
    static async fetchModel<TModel>(
        url: string,
        fetchModel?: Partial<FetchModel>,
        requiresAuth: boolean = true
    ): Promise<{ data?: TModel; response?: Response }> {
        const headers: HeadersInit = [];
        if (fetchModel) {
            if (fetchModel.queryParams) {
                url = url + "?" + fetchModel.queryParams.toString();
            }
        }
        if (requiresAuth) {
            const authModel = await MessagingService.getAuthentication.invoke();
            if (!authModel) {
                return Promise.reject("User is not authenticated");
            }

            headers.push(["Authorization", `Bearer ${authModel.accessToken}`]);
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
