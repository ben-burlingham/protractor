const Background = {
    isActive: false
};

module.exports = {
    onActive: function(tab) {
        Background.isActive = true;

        chrome.browserAction.setIcon({
            path : {
                "16": "images/icon16-inactive.png",
                "48": "images/icon48-inactive.png",
                "128":  "images/icon128-inactive.png"
            },
            tabId: tab.id
        });

    },

    onInactive: function(tab) {
        Background.isActive = false;

        chrome.browserAction.setIcon({
            path: chrome.runtime.getManifest().icons,
            tabId: tab.id
        });
    },

    handleClick: function(tab) {
        Background.isActive
            ? Background.onInactive(tab)
            : Background.onActive(tab);

        chrome.tabs.sendMessage(tab.id, { active: Background.isActive });
    },
};

chrome.browserAction.onClicked.addListener(module.exports.handleClick);
