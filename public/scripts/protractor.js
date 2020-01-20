Protractor = function() {
    this.timer = null;

    // Dev only!
    // chrome.storage.sync.clear();

    const options = {
        arcFill: 'rgba(50, 243, 150, 0.1)',
        circleFill: 'rgba(200, 200, 200, 0.03)',
        displayFill: 'rgba(240,240,240,0.5)',
        guide0Fill: 'rgba(46,198,86,1)',
        guide1Fill: 'rgba(0,0,255,1)',
        markerFill: 'rgba(160, 160, 160, 1)',
        markerLabels: true,
        markerLength: 'center',
        markerSnap: true,
        markerInterval: Math.PI / 6,
        precision: 1,
        rotation: 'ccw',
        units: 'deg'
    };

    // Non-chrome (Firefox et al)
    if (typeof browser !== "undefined") {
        browser.storage.sync.get(options).then(this.build.bind(this))
        this.buttonSpriteUrl = browser.runtime.getURL('images/sprite-buttons.svg');
    } else {
        chrome.storage.sync.get(options, this.build.bind(this));
        this.buttonSpriteUrl = chrome.runtime.getURL('images/sprite-buttons.svg');
    }
};

Protractor.prototype = {
    build: function(options) {
        const appId = this.appId;
        const buttonSpriteUrl = this.buttonSpriteUrl;

        const settings = {
            arcFill: options.arcFill,
            circleFill: options.circleFill,
            displayFill: options.displayFill,
            guide0Fill: options.guide0Fill,
            guide1Fill: options.guide1Fill,
            markerFill: options.markerFill,
            markerLabels: JSON.parse(options.markerLabels),
            markerSnap: JSON.parse(options.markerSnap),
            markerInterval: options.markerInterval,
            longMarker: (options.markerLength === 'center'),
            precision: options.precision,
            rotation: options.rotation,
            theta0: options.rotation === "ccw" ? (7 * Math.PI / 4) : (Math.PI / 4),
            theta1: options.rotation === "ccw" ? (5 * Math.PI / 4) : (3 * Math.PI / 4),
            units: options.units
        };

        // Main container, buttons container, close button, lock button
        this.container = new Container();
        this.container.id = 'protractor-extension-container';

        this.buttons = document.createElement('div');
        this.buttons.className = `protractor-extension-buttons`;

        this.buttons.appendChild(new ButtonRotate({ buttonSpriteUrl }));
        this.buttons.appendChild(new ButtonResize({ buttonSpriteUrl }));
        this.buttons.appendChild(new ButtonNudge({ buttonSpriteUrl }));
        this.buttons.appendChild(new ButtonLock({ buttonSpriteUrl }));
        this.buttons.appendChild(new ButtonClose({ buttonSpriteUrl }));

        this.container.appendChild(this.buttons);

        // Circle, markers
        this.container.appendChild(new Circle({ settings }));

        const upperlimit = (2 * Math.PI) - 0.0001; // Numeric precision correction
        for (let rad = 0; rad < upperlimit; rad += settings.markerInterval) {
            this.container.appendChild(new Marker({ settings, rad }));
            this.container.appendChild(new Label({ settings, rad }));
        }

        // Display, guides, arc
        this.display = new Display({ settings });
        this.container.appendChild(this.display);

        this.container.appendChild(new Guide({ settings, i: 0 }));
        this.container.appendChild(new Guide({ settings, i: 1 }));

        this.container.appendChild(new Arc({ settings }));

        // Resize handles
        this.container.appendChild(new HandleResize({ buttonSpriteUrl, settings, i: 0 }));
        this.container.appendChild(new HandleResize({ buttonSpriteUrl, settings, i: 1 }));

        // Rotate handle
        this.container.appendChild(new HandleRotate({ buttonSpriteUrl, settings }));

        // Nudge handles
        this.container.appendChild(new HandleNudge({ buttonSpriteUrl, settings, i: 0 }));
        this.container.appendChild(new HandleNudge({ buttonSpriteUrl, settings, i: 1 }));
        this.container.appendChild(new HandleNudge({ buttonSpriteUrl, settings, i: 2 }));
        this.container.appendChild(new HandleNudge({ buttonSpriteUrl, settings, i: 3 }));

        this.show();
    },

    hide: function() {
        document.body.removeChild(this.container);
    },

    show: function() {
        const radius = 200;

        this.container.style.left = `${window.scrollX + (document.documentElement.offsetWidth / 2) - radius}px`;
        this.container.style.top = `${window.scrollY + 100}px`;
        this.container.style.height = `${radius * 2}px`;
        this.container.style.width = `${radius * 2}px`;

        document.body.appendChild(this.container);

        // Fake sizing event to establish container coords.
        PubSub.emit(Channels.MOVE_HANDLE_RESIZE, { offset: 0 });

        clearTimeout(this.timer);
        this.isShowing = true;
    },

    toggle: function() {
        // const hidden = (this.container.parentNode === null);
        // hidden ? this.show() : this.hide();
        const hidden = true;
        return hidden;
    },
};
