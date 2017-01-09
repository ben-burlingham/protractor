const Protractor = {
    isActive: false,
    manifest: chrome.runtime.getManifest(),

    onActive: function(tab) {
        Protractor.isActive = true;

        chrome.browserAction.setIcon({
            path : "iconActive.png",
            tabId: tab.id
        });

    },

    onInactive: function(tab) {
        Protractor.isActive = false;

        // console.warn(Protractor.manifest.icons)

        chrome.browserAction.setIcon({
            // path : "icon16.png",
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
