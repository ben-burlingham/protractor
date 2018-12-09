Marker = function({ appId, settings, rad }) {
    const long = settings.longMarker ? `${appId}-marker-long` : "";

    this.node = document.createElement('div');
    this.node.className = `${appId}-marker ${long}`;
    this.node.style.transform = `rotate(${rad * 180 / Math.PI - 90}deg)`
    this.node.style.height = `${settings.radius + 10}px`;
    this.node.style.borderBottom = `20px solid ${settings.markerFill}`;

    if (settings.longMarker)
    {
        const rgba = settings.markerFill.replace('1)', '0.4)');
        this.node.style.borderTop = `190px solid ${rgba}`;
    }

    PubSub.subscribe(Channels.CONTAINER_RESIZE, this);

    return this.node;
};

Marker.prototype = {
    onUpdate: function(chan, msg) {
        if (chan === Channels.CONTAINER_RESIZE) {
            this.node.style.height = `${msg.radius + 10}px`;
            this.node.style.borderTopWidth = `${msg.radius - 10}px`;
        }
    },
};
