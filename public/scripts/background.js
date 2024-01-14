// Runs IN BACKGROUND and sends messages to protractor.js content script
const Background = {
    isShowingOnTab: {},

    cssFiles: [
        "style/buttons.css",
        "style/circle.css",
        "style/marker.css",
        "style/label.css",
        "style/arc.css",
        "style/display.css",
        "style/handle-nudge.css",
        "style/handle-resize.css",
        "style/handle-rotate.css",
        "style/guide.css",
        "style/rotate.css",
        "style/container.css"
    ],

    jsFiles: [
        "scripts/pubsub.js",
        "scripts/channels.js",
        "scripts/container.js",

        "scripts/circle.js",
        "scripts/marker.js",
        "scripts/label.js",
        "scripts/arc.js",
        "scripts/display.js",
        "scripts/guide.js",

        "scripts/button-close.js",
        "scripts/button-lock.js",
        "scripts/button-nudge.js",
        "scripts/button-options.js",
        "scripts/button-resize.js",
        "scripts/button-rotate.js",

        "scripts/handle-nudge.js",
        "scripts/handle-rotate.js",
        "scripts/handle-resize.js",

        "scripts/protractor.js",
    ],

    instantiate: (tab) => new Promise((resolve) => {
        // Check if the content exists to only instantiate on load and refresh.
        chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
            // Suppress "Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist."
            chrome.runtime.lastError;

            if (response !== undefined) {
                resolve();
                return;
            }

            chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: Background.cssFiles
            });

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: Background.jsFiles,
            })
            .then(resolve);
        });
    }),

    handleClick: (tab) => {
        // Make sure that content is ready to receive messages.
        chrome.tabs.query({active: true, currentWindow: true, status: 'complete'}, (result) => {
            if (result.length === 0) {
                return;
            }

            Background.instantiate(tab)
                .then(() => {
                    Background.isShowingOnTab[tab.id]
                        ? Background.hide(tab)
                        : Background.show(tab);
                })
        });
    },

    hide: (tab) => {
        Background.isShowingOnTab[tab.id] = false;

        chrome.action.setIcon({
            path : {
                "16": "/images/icon16-on.png",
                "48": "/images/icon48-on.png",
                "128":  "/images/icon128-on.png"
            },
            tabId: tab.id
        });

        chrome.tabs.sendMessage(tab.id, { action: 'hide' });
    },

    show: (tab) => {
        Background.isShowingOnTab[tab.id] = true;

        chrome.action.setIcon({
            path : {
                "16": "/images/icon16-off.png",
                "48": "/images/icon48-off.png",
                "128":  "/images/icon128-off.png"
            },
            tabId: tab.id
        });

        chrome.tabs.sendMessage(tab.id, { action: 'show' });
    },
};

chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === 'close') {
        Background.hide(sender.tab);
    }

    if (msg.action === 'options') {
        chrome.runtime.openOptionsPage();
    }
});

chrome.action.onClicked.addListener(Background.handleClick);

// https://stackoverflow.com/a/14957674/385273
chrome && chrome.runtime && chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install"){
        chrome.tabs.create({ url: "welcome.html" });
    }
});