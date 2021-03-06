Background = {
    blocking: {},
    tabId: null,
    instantiated: false,

    css: [
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

    js: [
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
        "scripts/button-resize.js",
        "scripts/button-rotate.js",

        "scripts/handle-nudge.js",
        "scripts/handle-rotate.js",
        "scripts/handle-resize.js",

        "scripts/protractor.js",
    ],

    instantiate: function(tab) {
        console.log("Protractor: Instantiating...");

        function injectJS(i, values) {
            if (i === Background.js.length) {
                console.log('Protractor: JS injected');
                console.log('Protractor: Instantiation complete.');

                browser.browserAction.setIcon({
                    path : {
                        "16": "images/icon16-off.png",
                        "48": "images/icon48-off.png",
                        "128":  "images/icon128-off.png"
                    },
                    tabId: tab.id
                }, () => { 
                    Background.instantiated = true;
                    Background.blocking[tab.id] = false; 
                })

                return;
            }

            const file = Background.js[i];
            browser.tabs.executeScript(tab.id, { file }, injectJS.bind(null, i + 1));
        }

        Background.css.forEach(file => browser.tabs.insertCSS(tab.id, { file }));
        console.log('Protractor: CSS inserted');

        injectJS(0);
    },

    toggle: function(tab) {
        console.log("Protractor: Toggling");
        
        browser.tabs.executeScript(tab.id, {
            code: "window.ProtractorExtensionInstance.toggle();"
        }, ([isHidden]) => {
            if (isHidden) {
                browser.browserAction.setIcon({
                    path : {
                        "16": "images/icon16-off.png",
                        "48": "images/icon48-off.png",
                        "128":  "images/icon128-off.png"
                    },
                    tabId: tab.id
                }, () => { Background.blocking[tab.id] = false; })
            } else {
                browser.browserAction.setIcon({
                    path: browser.runtime.getManifest().icons,
                    tabId: tab.id
                }, () => { Background.blocking[tab.id] = false; });
            }
        });
    },

    handleClick: function(tab) {
        if (Background.blocking[tab.id] === true) {
            return;
        }

        Background.blocking[tab.id] = true;

        browser.tabs.executeScript(tab.id, {
            code: "typeof window.ProtractorExtensionInstance;"
        }, ([type]) => {
            if (type === "undefined") {
               Background.instantiate(tab);
               return; 
            }

            Background.toggle(tab);
        });
    },
};

if (window.browser === undefined) {
    window.browser = chrome;
}

browser.runtime.onMessage.addListener((msg, sender) => {
    if (msg === "close") {
        Background.handleClick(sender.tab);
    }
});

browser.browserAction.onClicked.addListener(Background.handleClick);

// https://stackoverflow.com/a/14957674/385273
chrome && chrome.runtime && chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({ url: "welcome.html" });
});