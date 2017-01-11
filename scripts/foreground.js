/*
TODO
prevent rebuild of container each time
4 guides. double click to lock/unlock

options page:
    - outer thickness
    - mark size
    - radians / degrees / radians
    - marker count
    - precision
*/


Protractor = {};

chrome.runtime.onMessage.addListener(
    (msg, sender, sendResponse) => {
        if (msg.isOn === true) {
            const radius = 200;
            const container = Protractor.UI.buildContainer(sender.id, radius);
            const buttonContainer = Protractor.UI.buildButtonContainer();

            buttonContainer.appendChild(Protractor.UI.buildButtonLock(sender.id));
            buttonContainer.appendChild(Protractor.UI.buildButtonClose(sender.id));

            // Protractor.UI.buildGuides().forEach(element => {
            //     container.appendChild(element);
            // });

            Protractor.UI.buildMarkers(radius).forEach(element => {
                container.appendChild(element);
            });

            // Protractor.UI.buildHandles().forEach(element => {
            //     container.appendChild(element);
            // });

            container.appendChild(Protractor.UI.buildCircle(radius));
            container.appendChild(Protractor.UI.buildDisplay());
            container.appendChild(buttonContainer);

            document.body.appendChild(container);
        }

        // if (msg.isOn === false) {
        //     const div = document.getElementById(sender.id);
        //     div.parentNode.removeChild(div);
        // }
    }
);
