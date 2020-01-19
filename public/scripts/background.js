Background = {
    blocking: {},
    tabId: null,

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
        "scripts/protractor.js",
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
    ],

    instantiate: function() {
        console.log("Protractor: Instantiating...");

        function injectJS(i, values) {
            if (i === Background.js.length) {
                console.log('Protractor: JS injected');
                console.log('Protractor: Instantiation complete.');

                console.log(browser.runtime)
                browser.tabs.executeScript(
                    Background.tabId, 
                    { code: "window.Protractor = new Protractor({ appId: '" + browser.runtime.id + "' });" },
                    Background.toggle
                );
                return;
            }

            const file = Background.js[i];
            browser.tabs.executeScript(Background.tabId, { file }, injectJS.bind(null, i + 1));
        }

        console.log(Background.tabId);
        
        Background.css.forEach(file => browser.tabs.insertCSS(Background.tabId, { file }));
        console.log('Protractor: CSS inserted');

        injectJS(0);
    },

    toggle: function() {
        console.log("Protractor: Toggling");
        
        browser.tabs.executeScript(Background.tabId, {
            code: "window.Protractor.toggle();"
        }, ([isHidden]) => {
            if (isHidden) {
                browser.browserAction.setIcon({
                    path : {
                        "16": "images/icon16-off.png",
                        "48": "images/icon48-off.png",
                        "128":  "images/icon128-off.png"
                    },
                    tabId: Background.tabId
                }, () => { Background.blocking[Background.tabId] = false; })
            } else {
                browser.browserAction.setIcon({
                    path: browser.runtime.getManifest().icons,
                    tabId: Background.tabId
                }, () => { Background.blocking[Background.tabId] = false; });
            }
        });
    },

    handleClick: function(tab) {
        if (Background.blocking[tab.id] === true) {
            return;
        }

        Background.blocking[tab.id] = true;
        Background.tabId = tab.id;

        function onCheckExists([exists]) {
            exists 
                ? Background.toggle() 
                : Background.instantiate();
        }

        console.log("Protractor: Checking existence");
        browser.tabs.executeScript(tab.id, { code: "window.Protractor" }, onCheckExists);
    },
};

if (window.browser === undefined) {
    window.browser = chrome;
}

browser.runtime.onMessage.addListener((msg, sender) => {
    Background.handleClick(sender.tab);
});

browser.browserAction.onClicked.addListener(Background.handleClick);