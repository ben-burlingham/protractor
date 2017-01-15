/*
TODO
prevent rebuild of container each time
2 guides. double click to lock/unlock
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


Protractor = {};

chrome.runtime.onMessage.addListener(
    (msg, sender, sendResponse) => {
        if (msg.isOn === true) {
            const radius = 200;
            const container = Protractor.UI.buildContainer(sender.id, radius);
            const buttonContainer = Protractor.UI.buildButtonContainer();
            const display = new Protractor.Display({ move: Protractor.UI.move });

            const guide1 = new Protractor.Guide(sender.id, container, display);
            const guide2 = new Protractor.Guide(sender.id, container, display);

            buttonContainer.appendChild(Protractor.UI.buildButtonLock(sender.id));
            buttonContainer.appendChild(Protractor.UI.buildButtonClose(sender.id));

            container.appendChild(guide1.build.call(guide1));
            container.appendChild(guide2.build.call(guide2));

            Protractor.UI.buildMarkers(radius).forEach(element => {
                container.appendChild(element);
            });

            Protractor.UI.buildHandles().forEach(element => {
                container.appendChild(element);
            });

            container.appendChild(Protractor.UI.buildCircle(radius));
            container.appendChild(display);
            container.appendChild(buttonContainer);

            document.body.appendChild(container);
        }

        // if (msg.isOn === false) {
        //     const div = document.getElementById(sender.id);
        //     div.parentNode.removeChild(div);
        // }
    }
);
