/*
TODO
pubsub for guide move, resize
initial location centering
guide double click to lock/unlock
lower resize handle
window resize
window scroll
resize function rework
consistent argument patterns
switch class on lock/unlock button so hover states show alternative
split style sheets

options page:
    - outer thickness
    - mark size
    - radians / degrees / radians
    - marker count
    - precision
    - guide snap
    - static guides
*/

const P = new Protractor({ radius: 200, appId: chrome.runtime.id });

chrome.runtime.onMessage.addListener(
    (msg, sender, sendResponse) => {
        if (msg.isOn === true) {

            // const buttonContainer = Protractor.UI.buildButtonContainer();
            // const display = new Protractor.Display({ move: Protractor.UI.move });
            //
            // const guide1 = new Protractor.Guide(sender.id, container, display);
            // const guide2 = new Protractor.Guide(sender.id, container, display);
            //
            // const handle1 = new Protractor.Handle(sender.id, container);
            // const handle2 = new Protractor.Handle(sender.id, container);
            //
            // buttonContainer.appendChild(Protractor.UI.buildButtonLock(sender.id));
            // buttonContainer.appendChild(Protractor.UI.buildButtonClose(sender.id));
            //
            // container.appendChild(guide1.build.call(guide1));
            // container.appendChild(guide2.build.call(guide2));
            //
            // container.appendChild(handle1.build.call(handle1, 0));
            // container.appendChild(handle2.build.call(handle2, 1));
            //
            // container.appendChild(Protractor.UI.buildCircle(radius));
            // container.appendChild(display);
            // container.appendChild(buttonContainer);
            //
            // Protractor.UI.buildMarkers(radius).forEach(element => {
            //     container.appendChild(element);
            // });
            //
            // document.body.appendChild(container);
        }

        // if (msg.isOn === false) {
        //     const div = document.getElementById(sender.id);
        //     div.parentNode.removeChild(div);
        // }
    }
);
