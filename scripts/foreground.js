/*
TODO
pubsub for guide move, resize. try to contain side effects and remove node dep injection
initial location centering
guide double click to lock/unlock
lower resize handle
window resize
window scroll
resize function rework
switch class on lock/unlock button so hover states show alternative

options page:
    - mark size
    - radians / degrees / radians
    - marker count
    - precision
    - guide snap
    - background opacity
    - static guide opacity
*/

const P = new Protractor({ radius: 200, appId: chrome.runtime.id });

chrome.runtime.onMessage.addListener(
    (msg, sender, sendResponse) => {
        if (msg.isOn === true) {
            // const guide1 = new Protractor.Guide(sender.id, container, display);
            // const guide2 = new Protractor.Guide(sender.id, container, display);
        }

        // if (msg.isOn === false) {
        //     const div = document.getElementById(sender.id);
        //     div.parentNode.removeChild(div);
        // }
    }
);
