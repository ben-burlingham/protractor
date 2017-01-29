Marker = function({ appId, settings, rad }) {
    const long = settings.longMarker ? `${appId}-marker-long` : "";

    this.node = document.createElement('div');
    this.node.className = `${appId}-marker ${long}`;
    this.node.style.transform = `rotate(${rad * 180 / Math.PI - 90}deg)`

    PubSub.subscribe(Channels.RESIZE, this);

    return this.node;
};

Marker.prototype = {
    onUpdate: function(chan, msg) {
        if (chan === Channels.RESIZE) {
            const pad = 40;
            this.node.style.borderBottomWidth = `${this.node.parentNode.offsetHeight / 2 - pad}px`;
            this.node.style.height = `${pad + 10}px`;
        }
    },
};
