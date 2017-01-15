Protractor = function({ appId, radius }) {
    // Main container
    this.container = document.createElement('div');
    this.container.className = `${appId}-container`
    this.container.style.left = `200px`;
    this.container.style.top = `200px`;
    this.container.style.height = `${radius * 2}px`;
    this.container.style.width = `${radius * 2}px`;

    // Buttons container, close button, lock button
    this.buttons = document.createElement('div');
    this.buttons.className = `${appId}-buttons`;

    this.closeBtn = document.createElement('button');
    this.closeBtn.className = `${appId}-button-close`;

    this.lockBtn = document.createElement('button');
    this.lockBtn.className = `${appId}-button-lock`;

    this.buttons.appendChild(this.lockBtn);
    this.buttons.appendChild(this.closeBtn);
    this.container.appendChild(this.buttons);

    // Circle, markers
    this.circle = new Protractor.Circle({ appId, container: this.container });
    this.container.appendChild(this.circle);

    // buildMarkers: (radius) => {
    //     const markers = [];
    //
    //     for (let deg = 0; deg < 360; deg += 15) {
    //         markers.push(new Protractor.Marker({ radius, deg }));
    //     }
    //
    //     return markers;
    // },


    this.show();

    // Object.assign(this, { appId, container });
};

Protractor.prototype = {
    setAppId: id => this.appId = id,

    show: function() {
        // TODO centering (or save last configuration?)
        this.circle.style.borderRadius = '200px'; // TODO pubsub
        document.body.appendChild(this.container);
    }
};
