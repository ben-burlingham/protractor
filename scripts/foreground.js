const P = new Protractor({ appId: chrome.runtime.id });

chrome.runtime.onMessage.addListener(P.toggle.bind(P));
