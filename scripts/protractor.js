/*
TODO
colored arc!
window resize
window scroll
small document size
guide double click to lock/unlock

options page:
    - mark size (${appId}-marker-full)
    - radians / degrees / radians
    - marker count
    - precision
    - guide snap
    - background opacity
    - static guide opacity
*/

Protractor = function({ appId }) {
    // Main container, buttons container, close button, lock button
    this.container = new Container({ appId });
    this.appId = appId;

    this.buttons = document.createElement('div');
    this.buttons.className = `${appId}-buttons`;

    this.closeBtn = document.createElement('button');
    this.closeBtn.className = `${appId}-button-close`;
    this.closeBtn.addEventListener('click', this.hide.bind(this));

    this.lockBtn = new ButtonLock({ appId });

    this.buttons.appendChild(this.lockBtn);
    this.buttons.appendChild(this.closeBtn);
    this.container.appendChild(this.buttons);

    // Circle, markers
    this.circle = new Circle({ appId });
    this.container.appendChild(this.circle);

    for (let deg = 0; deg < 360; deg += 15) {
        this.container.appendChild(new Marker({ appId, deg }));
    }

    // Display, guides, handles
    this.display = new Display({ appId });
    this.container.appendChild(this.display);

    this.handle0 = new Handle({ appId, i: 0 });
    this.handle1 = new Handle({ appId, i: 1 });
    this.container.appendChild(this.handle0);
    this.container.appendChild(this.handle1);

    this.guide0 = new Guide({ appId, i: 0 });
    this.guide1 = new Guide({ appId, i: 1 });
    this.container.appendChild(this.guide0);
    this.container.appendChild(this.guide1);

    // TODO remove this
    this.show();
};

Protractor.prototype = {
    hide: function() {
        const self = this;

        function afterAnimate() {
            document.body.removeChild(self.container);
            chrome.runtime.sendMessage({ isOn: false });
        }

        this.container.className = this.container.className
            .split(' ').concat(`${this.appId}-container-hidden`).join(' ');

        setTimeout(afterAnimate, 500);
    },

    show: function() {
        const self = this;
        const className = this.container.className.split(' ');
        const i = className.findIndex(v => v.search(/hidden/) !== -1);

        document.body.appendChild(this.container);

        self.container.className =
            className.slice(0, i).concat(className.slice(i + 1)).join(' ');
    }
};
