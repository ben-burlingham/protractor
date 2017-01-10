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
    },

    setOff: function(tab, cb) {
        chrome.browserAction.setIcon({
            path: chrome.runtime.getManifest().icons,
            tabId: tab.id
        });

        chrome.browserAction.setTitle({ title: 'Protractor' });
    },

    handleClick: function(tab) {
        chrome.browserAction.getTitle({}, str => {
            const isOn = (str.indexOf('(active)') > -1);

            isOn
                ? Background.setOff(tab)
                : Background.setOn(tab);

            chrome.tabs.sendMessage(tab.id, { isOn });
        });
    },
};

chrome.browserAction.onClicked.addListener(Background.handleClick);
