import { MessagingService } from "@/messagingService";
import UserAuthenticationModel from "@/models/userAuthenticationModel";

export enum AuthenticationStatus {
    NotAuthenticated,
    UseRefreshToken,
    Authenticated
}

export default class AuthenticationService {
    static async getAuthenticationStatus(): Promise<AuthenticationStatus> {
        const authModel = await MessagingService.getAuthentication.invoke();
        if (authModel && UserAuthenticationModel.isAccessTokenValid(authModel)) {
            return AuthenticationStatus.Authenticated;
        }
        if (authModel && authModel.refreshToken !== undefined) {
            const reuslt = await this.consumeRefreshToken(authModel);
            if (reuslt) {
                await MessagingService.storeAuthentication.invoke(authModel);
                console.log("Access token has been refreshed");
                return AuthenticationStatus.Authenticated;
            }
        }

        return AuthenticationStatus.NotAuthenticated;
    }

    /**
     * Provided object will be modified with new data if successfull.
     * Returns a boolean indicating result
     */
    static async consumeRefreshToken(authModel: UserAuthenticationModel): Promise<boolean> {
        if (authModel.refreshToken === undefined) {
            return false;
        }

        const payload = {
            grant_type: "refresh_token",
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            refresh_token: authModel.refreshToken
        };
        const result = await fetch("https://auth.atlassian.com/oauth/token", {
            body: JSON.stringify(payload),
            method: "POST",
            headers: [["content-type", "application/json"]]
        });

        if (!result.ok) {
            return false;
        }

        const newAuthData = UserAuthenticationModel.parse(await result.json());
        authModel.accessToken = newAuthData.accessToken;
        authModel.expirationDate = newAuthData.expirationDate;
        authModel.refreshToken = newAuthData.refreshToken;
        authModel.scope = newAuthData.scope;

        return true;
    }

    /**
     * Return boolean indicating the result of authentication.
     * On success the authentication information is stored in LocalStorage.
     */
    static async launchAuthenticationFlow(): Promise<boolean> {
        try {
            const authRedirectUri = await MessagingService.authenticate.invoke();
            if (!authRedirectUri) {
                return false;
            }

            //query param [code] is used to obtain access token
            const searchParams = new URLSearchParams(authRedirectUri);
            const code = searchParams.get("code");
            if (!code) {
                return false;
            }

            const authModel = await this.fetchAccessTokenByCode(code);
            if (!authModel.accessToken) {
                return false;
            }

            authModel.cloudId = await this.fetchCloudId(authModel);
            authModel.accountId = await this.fetchCurrentUserId(
                authModel.cloudId,
                authModel.accessToken
            );

            if (!UserAuthenticationModel.validate(authModel)) {
                return false;
            }

            await MessagingService.storeAuthentication.invoke(authModel);

            return true;
        } catch {
            return false;
        }
    }

    private static async fetchAccessTokenByCode(code: string): Promise<UserAuthenticationModel> {
        try {
            const result = await fetch("https://auth.atlassian.com/oauth/token", {
                method: "POST",
                headers: [["content-type", "application/json"]],
                body: JSON.stringify({
                    grant_type: "authorization_code",
                    client_id: import.meta.env.VITE_CLIENT_ID,
                    client_secret: import.meta.env.VITE_CLIENT_SECRET,
                    code: code,
                    redirect_uri: `https://${import.meta.env.VITE_EXTENSION_ID}.chromiumapp.org`
                })
            });

            const resultBody = await result.json();
            const userAuthenticationModel = UserAuthenticationModel.parse(resultBody);

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
}
