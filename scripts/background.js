Background = {
    active: false,

    setOn: function(tab) {
        chrome.browserAction.setIcon({
            path : {
                "16": "images/icon16-off.png",
                "48": "images/icon48-off.png",
                "128":  "images/icon128-off.png"
            },
            tabId: tab.id
        });

        Background.active = true;
    },

    setOff: function(tab, cb) {
        chrome.browserAction.setIcon({
            path: chrome.runtime.getManifest().icons,
            tabId: tab.id
        });

        Background.active = false;
    },

    handleClick: function(tab) {
        chrome.browserAction.getTitle({}, str => {
            if (Background.active) {
                Background.setOff(tab);
                chrome.tabs.sendMessage(tab.id, { isOn: false  });
            } else {
                Background.setOn(tab);
                chrome.tabs.sendMessage(tab.id, { isOn: true });
            }
        });
    },
};

chrome.browserAction.onClicked.addListener(Background.handleClick);

chrome.runtime.onMessage.addListener(
    (msg, sender, sendResponse) => {
        if (msg.isOn === false) {
            Background.setOff(sender.tab);
        }
    }
);
