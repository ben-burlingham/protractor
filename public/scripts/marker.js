Marker = function({ settings, rad }) {
    const long = settings.longMarker ? 'protractor-extension-marker-long' : "";

    this.theta = rad - Math.PI / 2;
    this.phi = settings.phi;
    this.settings = settings;

    this.node = document.createElement('div');
    this.node.className = `protractor-extension-marker ${long}`;
    this.node.style.borderBottom = `20px solid ${settings.markerFill}`;

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);
    PubSub.subscribe(Channels.MOVE_HANDLE_ROTATE, this);

    return this.node;
};

Marker.prototype = {
    onRotate: function(msg) {
        this.rotation += msg.phi;
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.onMoveContainer(msg); break;
            case Channels.MOVE_HANDLE_ROTATE: this.onMoveHandleRotate(msg); break;
        }
    },

    onMoveContainer: function(msg) {
        this.node.style.height = `${msg.radius + 10}px`;

        if (this.settings.longMarker)
        {
            const rgba = this.settings.markerFill.replace('1)', '0.4)');
            this.node.style.borderTop = `${msg.radius - 10}px solid ${rgba}`;
        }

        this.transform();
    },

    onMoveHandleRotate: function(msg) {
        this.phi = msg.phi;
        this.transform();
    },

    transform: function() {
        this.node.style.transform = `rotate(${this.theta + this.phi}rad)`;
    },

    setMode: function() {
        this.node.className = (msg.mode === "lock" ? 'protractor-extension-marker protractor-extension-marker-locked' : 'protractor-extension-marker');
    },
};
