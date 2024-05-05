import { MessagingService } from "./messagingService";

//Open index on action icon click
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("index.html")
    });
});

//Register all events from MessagingService
MessagingService.getEvents().forEach((event) => {
    event.registerEvent(chrome.runtime.onMessage);
});
