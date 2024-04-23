export default class UserAuthenticationModel {
    accessToken?: string;
    expirationDate?: string;
    refreshToken?: string;
    tokenType?: string;
    scope?: string;

    static parse(tokenObject: any): UserAuthenticationModel {
        const model = new UserAuthenticationModel();
        model.accessToken = tokenObject["access_token"];
        model.tokenType = tokenObject["token_type"];
        model.refreshToken = tokenObject["refresh_token"];
        model.scope = tokenObject["scope"];
        model.expirationDate = new Date(
            Date.now() + tokenObject["expires_in"] * 1000
        ).toISOString();

        return model;
    }
}
