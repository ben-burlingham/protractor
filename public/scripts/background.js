Background = {
    active: {},

    css: [
        "style/buttons.css",
        "style/circle.css",
        "style/marker.css",
        "style/arc.css",
        "style/display.css",
        "style/handle.css",
        "style/guide.css",
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
        "scripts/arc.js",
        "scripts/button-close.js",
        "scripts/button-lock.js",
        "scripts/display.js",
        "scripts/handle.js",
        "scripts/guide.js"
    ],

    handleClick: function(tab) {
        if (Background.active[tab.id] === undefined) {
            Background.active[tab.id] = true;
            function initJS(n, values) {
                if (n >= Background.js.length) {
                    chrome.tabs.executeScript(tab.id, {
                        code: "const P = new Protractor({ appId: chrome.runtime.id });"
                    });
                } else {
                    chrome.tabs.executeScript(tab.id, { file: Background.js[n] }, initJS.bind(null, n + 1));
                }
            }

            Background.css.forEach(file => chrome.tabs.insertCSS(null, { file }));
            initJS(0);
        } else if (Background.active[tab.id] === true) {
            Background.active[tab.id] = false;

            chrome.browserAction.setIcon({
                    path: chrome.runtime.getManifest().icons,
                    tabId: tab.id
                },
                chrome.tabs.executeScript.bind(null, tab.id, { code: "P.hide();" })
            );
        } else {
            Background.active[tab.id] = true;

            chrome.browserAction.setIcon({
                    path : {
                        "16": "images/icon16-off.png",
                        "48": "images/icon48-off.png",
                        "128":  "images/icon128-off.png"
                    },
                    tabId: tab.id
                },
                chrome.tabs.executeScript.bind(null, tab.id, { code: "P.show();" })
            );
        }
    },
};

chrome.runtime.onMessage.addListener((msg, sender) => {
    Background.handleClick(sender.tab);
});

chrome.browserAction.onClicked.addListener(Background.handleClick);

chrome.tabs.onUpdated.addListener((tabId) => {
    Background.active[tabId] = undefined;
});
