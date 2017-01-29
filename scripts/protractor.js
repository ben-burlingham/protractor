/*
TODO
arc flip
hover behavior on drag handle
not global classes
not allowed cursor on circle if locked
resize broken
larger display text

options page:
    - mark size (${appId}-marker-full)
    - radians / degrees (ready)
    - marker count
    - precision (ready)
    - guide snap (ready)
    - background opacity
    - static guide opacity
    - arc opacity
*/

Protractor = function({ appId }) {
    const settings = {
        precision: 2,
        radius: 200,
        theta0: Math.PI / 4,
        theta1: 3 * Math.PI / 4,
        units: 'deg'
    };

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

    // Display, guides, arc
    this.display = new Display({ appId, settings });
    this.container.appendChild(this.display);

    this.guide0 = new Guide({ appId, settings, i: 0 });
    this.guide1 = new Guide({ appId, settings, i: 1 });
    this.container.appendChild(this.guide0);
    this.container.appendChild(this.guide1);

    this.arc = new Arc({ appId, settings });
    this.container.appendChild(this.arc);

    // Handle
    this.handle0 = new Handle({ appId, i: 0 });
    this.handle1 = new Handle({ appId, i: 1 });
    this.container.appendChild(this.handle0);
    this.container.appendChild(this.handle1);

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
