Marker = function({ appId, settings, rad }) {
    const long = settings.longMarker ? `${appId}-marker-long` : "";

    this.node = document.createElement('div');
    this.node.className = `${appId}-marker ${long}`;
    this.node.style.transform = `rotate(${rad * 180 / Math.PI - 90}deg)`
    this.node.style.height = `${settings.radius + 10}px`;

    PubSub.subscribe(Channels.CONTAINER_RESIZE, this);

    return this.node;
};

Marker.prototype = {
    onUpdate: function(chan, msg) {
        if (chan === Channels.CONTAINER_RESIZE) {
            this.node.style.height = `${msg.radius + 10}px`;
        }
    },
};
