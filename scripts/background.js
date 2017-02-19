Background = {
    active: {},

    handleClick: function(tab) {
        if (Background.active[tab.id]) {
            Background.active[tab.id] = false;

            chrome.browserAction.setIcon({
                path: chrome.runtime.getManifest().icons,
                tabId: tab.id
            }, () => chrome.tabs.sendMessage(tab.id, { isOn: false }));
        } else {
            Background.active[tab.id] = true;

            chrome.browserAction.setIcon({
                path : {
                    "16": "images/icon16-off.png",
                    "48": "images/icon48-off.png",
                    "128":  "images/icon128-off.png"
                },
                tabId: tab.id
            }, () => chrome.tabs.sendMessage(tab.id, { isOn: true }));
        }
    },
};

chrome.browserAction.onClicked.addListener(Background.handleClick);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status && changeInfo.status === 'complete') {
        Background.active[tab.id] = false;
    }
});
