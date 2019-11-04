Marker = function({ appId, settings, rad }) {
    const long = settings.longMarker ? `${appId}-marker-long` : "";

    // this.rotation = 0;
    this.settings = settings;

    this.node = document.createElement('div');
    this.node.className = `${appId}-marker ${long}`;
    this.node.style.transform = `rotate(${rad * 180 / Math.PI - 90}deg)`
    this.node.style.borderBottom = `20px solid ${settings.markerFill}`;

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);
    PubSub.subscribe(Channels.MOVE_HANDLE_ROTATE, this);

    return this.node;
};

Marker.prototype = {
    onRotate: function(msg) {
        this.rotation += msg.phi;
        // this.node.style.transform = `rotate(${this.rotation}deg)`;
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.resize(msg); break;
            case Channels.MOVE_HANDLE_ROTATE: this.resize(msg); break;
        }
    },

    resize: function(msg) {
        this.node.style.height = `${msg.radius + 10}px`;

        if (this.settings.longMarker)
        {
            const rgba = this.settings.markerFill.replace('1)', '0.4)');
            this.node.style.borderTop = `${msg.radius - 10}px solid ${rgba}`;
        }
    },
};
