export default class UserAuthenticationModel {
    accessToken?: string;
    expirationDate?: string;
    refreshToken?: string;
    tokenType?: string;
    scope?: string;
    cloudId?: string;
    accountId?: string;

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

    static isAccessTokenValid(authModel: UserAuthenticationModel): boolean {
        if (authModel.accessToken === undefined || authModel.expirationDate === undefined) {
            return false;
        }

        const now = new Date();
        const expirationDate = new Date(authModel.expirationDate);
        console.log(
            "Comparing token expiration date",
            "now =>",
            now,
            "Expiration =>",
            expirationDate
        );
        return expirationDate > now;
    }

    //Everything needs to be defined
    static validate(authModel: UserAuthenticationModel): boolean {
        let valid = true;
        Object.values(authModel).forEach((value) => {
            valid &&= value !== undefined && valid !== null;
        });
        return valid;
    }
}
