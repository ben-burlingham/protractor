Background = {
    setOn: function(tab) {
        chrome.browserAction.setIcon({
            path : {
                "16": "images/icon16-off.png",
                "48": "images/icon48-off.png",
                "128":  "images/icon128-off.png"
            },
            tabId: tab.id
        });

        chrome.browserAction.setTitle({ title: 'Protractor (active)' });
        chrome.tabs.sendMessage(tab.id, { isOn: true });
    },

    setOff: function(tab, cb) {
        chrome.browserAction.setIcon({
            path: chrome.runtime.getManifest().icons,
            tabId: tab.id
        });

        chrome.browserAction.setTitle({ title: 'Protractor' });
        chrome.tabs.sendMessage(tab.id, { isOn: false });
    },

    handleClick: function(tab) {
        chrome.browserAction.getTitle({}, str => {
            (str.indexOf('(active)') > -1)
                ? Background.setOff(tab)
                : Background.setOn(tab);
        });
    },
};

chrome.browserAction.onClicked.addListener(Background.handleClick);
