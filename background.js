const Protractor = {
    isActive: false,
    manifest: chrome.runtime.getManifest(),

    onActive: function(tab) {
        Protractor.isActive = true;

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
        Protractor.isActive = false;

        chrome.browserAction.setIcon({
            path: Protractor.manifest.icons,
            tabId: tab.id
        });
    },

    handleClick: function(tab) {
        Protractor.isActive
            ? Protractor.onInactive(tab)
            : Protractor.onActive(tab);

        chrome.tabs.sendMessage(tab.id, { active: Protractor.isActive });
    },
};

chrome.browserAction.onClicked.addListener(Protractor.handleClick);
