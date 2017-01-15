const P = new Protractor({ appId: chrome.runtime.id });

chrome.runtime.onMessage.addListener(
    (msg, sender, sendResponse) => {
        msg.isOn ? P.show.call(P) : P.hide.call(P);
    }
);
