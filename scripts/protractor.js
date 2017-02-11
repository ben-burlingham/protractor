/*
TODO
readme
better icon
remove-show-remove-show not working
DRY options
*/

Protractor = function({ appId }) {
    this.appId = appId;
};

Protractor.prototype = {
    build: function(options) {
        const appId = this.appId;

        const settings = {
            arcFill: options.arcFill,
            circleFill: options.circleFill,
            guide0Fill: '#2EC656',
            guide1Fill: 'blue',
            markerSnap: options.markerSnap,
            markerInterval: options.markerInterval,
            longMarker: (options.markerLength === 'center'),
            precision: options.precision,
            radius: 200,
            theta0: Math.PI / 4,
            theta1: 3 * Math.PI / 4,
            units: options.units
        };

        // Main container, buttons container, close button, lock button
        this.container = new Container({ appId });

        this.buttons = document.createElement('div');
        this.buttons.className = `${appId}-buttons`;

        this.closeBtn = new ButtonClose({ appId, hide: this.hide.bind(this) });
        this.lockBtn = new ButtonLock({ appId });

        this.buttons.appendChild(this.lockBtn);
        this.buttons.appendChild(this.closeBtn);
        this.container.appendChild(this.buttons);

        // Circle, markers
        this.circle = new Circle({ appId, settings });
        this.container.appendChild(this.circle);

        for (let rad = 0; rad < 2 * Math.PI; rad += settings.markerInterval) {
            this.container.appendChild(new Marker({ appId, settings, rad }));
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
        this.handle0 = new Handle({ appId, settings, i: 0 });
        this.handle1 = new Handle({ appId, settings, i: 1 });
        this.container.appendChild(this.handle0);
        this.container.appendChild(this.handle1);

        document.body.appendChild(this.container);

        // TODO remove this
        // this.show();
    },

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
        if (this.container === undefined) {
            chrome.storage.sync.get({
                arcFill: 'rgba(50, 243, 150, 0.1)',
                circleFill: 'rgba(200, 200, 200, 0.03)',
                markerLength: 'center',
                markerSnap: true,
                markerInterval: 4,
                precision: 1,
                units: 'deg'
            }, this.build.bind(this));
        } else {
            const className = this.container.className.split(' ');
            const i = className.findIndex(v => v.search(/hidden/) !== -1);
            this.container.className =
                className.slice(0, i).concat(className.slice(i + 1)).join(' ');
        }
    }
};
