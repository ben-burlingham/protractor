Background = {
    blocking: {},

    css: [
        "style/buttons.css",
        "style/circle.css",
        "style/marker.css",
        "style/label.css",
        "style/arc.css",
        "style/display.css",
        "style/handle.css",
        "style/guide.css",
        "style/rotate.css",
        "style/arc.css",
        "style/container.css"
    ],

    js: [
        "scripts/pubsub.js",
        "scripts/channels.js",
        "scripts/protractor.js",
        "scripts/container.js",
        "scripts/circle.js",
        "scripts/marker.js",
        "scripts/label.js",
        "scripts/arc.js",
        "scripts/button-close.js",
        "scripts/button-lock.js",
        "scripts/button-rotate.js",
        "scripts/display.js",
        "scripts/handle.js",
        "scripts/guide.js",
        "scripts/rotate.js"
    ],

    handleClick: function(tab) {
        if (Background.blocking[tab.id] === true) {
            return;
        }

        Background.blocking[tab.id] = true;

        chrome.tabs.executeScript(tab.id, {
            code: "window.Protractor"
        }, (results) => {
            if (results[0] === null) {
                function initJS(n, values) {
                    if (n >= Background.js.length) {
                        chrome.tabs.executeScript(tab.id, {
                            code: "window.Protractor = new Protractor({ appId: chrome.runtime.id });"
                        }, chrome.browserAction.setIcon({
                            path : {
                                "16": "images/icon16-off.png",
                                "48": "images/icon48-off.png",
                                "128":  "images/icon128-off.png"
                            },
                            tabId: tab.id
                        }, () => { Background.blocking[tab.id] = false; }));
                    } else {
                        chrome.tabs.executeScript(tab.id, { file: Background.js[n] }, initJS.bind(null, n + 1));
                    }
                }

                Background.css.forEach(file => chrome.tabs.insertCSS(null, { file }));
                initJS(0);
            } else {
                chrome.tabs.executeScript(tab.id, {
                    code: "window.Protractor.toggle();"
                }, (isHidden) => {
                    if (isHidden[0]) {
                        chrome.browserAction.setIcon({
                            path : {
                                "16": "images/icon16-off.png",
                                "48": "images/icon48-off.png",
                                "128":  "images/icon128-off.png"
                            },
                            tabId: tab.id
                        }, () => { Background.blocking[tab.id] = false; })
                    } else {
                        chrome.browserAction.setIcon({
                            path: chrome.runtime.getManifest().icons,
                            tabId: tab.id
                        }, () => { Background.blocking[tab.id] = false; });
                    }
                });
            }
        });
    },
};

chrome.runtime.onMessage.addListener((msg, sender) => {
    Background.handleClick(sender.tab);
});

chrome.browserAction.onClicked.addListener(Background.handleClick);
