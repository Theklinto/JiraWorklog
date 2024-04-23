import { MessageTypes } from "@/chromeService";
import { v4 as uuidv4 } from "uuid";

//Open index on action icon click
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("index.html")
    });
});

//Get authentication from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === MessageTypes.LaunchAuthenticationFlow) {
        const uuid = uuidv4();
        const redirectUri = (import.meta.env.VITE_AUTH_REDIRECT_URL as string).replace(
            import.meta.env.VITE_AUTH_REDIRECT_URL_STATE_PLACEHOLDER,
            uuid
        );
        console.log("Launching oath2 flow using url:", redirectUri);
        chrome.identity
            .launchWebAuthFlow({
                url: redirectUri,
                interactive: true
            })
            .then((result) => sendResponse(result));
    }

    return true;
});

// async function getAuthRequestKey() {
//   const uuid = uuidv4();
//   const redirectUri = (import.meta.env.VITE_AUTH_REDIRECT_URL as string).replace(
//     import.meta.env.VITE_AUTH_REDIRECT_URL_STATE_PLACEHOLDER,
//     uuid,
//   );

//   const result = await chrome.identity.launchWebAuthFlow({
//     url: redirectUri,
//     interactive: true,
//   });
//   const params = new URLSearchParams(result);
//   const keyPair: { key: string; val: string }[] = [];
//   params.forEach((val, key) => {
//     keyPair.push({ key, val });
//   });
//   console.log("AuthRequestKey", keyPair);

//   const authKey = new URLSearchParams(result).get("code");
//   if (authKey) {
//     const result1 = await Security.requestAccessToken(authKey);
//     const bearerToken = (await result1.json()).access_token;
//     console.log("bearerToken", bearerToken);

//     const result2 = await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
//       method: "GET",
//       headers: [
//         ["Authorization", `Bearer ${bearerToken}`],
//         ["Accept", "application/json"],
//       ],
//     });
//     console.log("result2", result2);

//     const cloudId = "5ce54194-a7aa-4fc3-bb77-c80433d9689d";
//     const jql = encodeURIComponent('worklogAuthor = currentUser() and worklogDate >= "-14d"');
//     const result3 = await fetch(
//       `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search?jql=${jql}`,
//       {
//         headers: [
//           ["Authorization", `Bearer ${bearerToken}`],
//           ["Accept", "application/json"],
//         ],
//       },
//     );
//     console.log("result3", result3);
//   }

//   return result;
// }
