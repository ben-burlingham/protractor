Marker = function({ appId, settings, rad }) {
    const long = settings.longMarker ? `${appId}-marker-long` : "";

    this.node = document.createElement('div');
    this.node.className = `${appId}-marker ${long}`;
    this.node.style.transform = `rotate(${rad * 180 / Math.PI - 90}deg)`
    this.node.style.height = `${settings.radius + 10}px`;

    if (settings.markerLabels === true) {
        let value = (rad === 0 ? 0 : 2 * Math.PI - rad);

        if (settings.units === "deg") {
            value = `${Math.round(value * 180 / Math.PI)}°`;
        } else {
            value = Math.round(value * 100, 2) / 100;
        }

        const label = document.createElement('div');
        label.className = `${appId}-marker-label`;
        label.style.transform = ((rad >= Math.PI / 2) && (rad <= 3 * Math.PI / 2)) ? 'rotate(270deg)' : 'rotate(90deg)';
        label.innerHTML = value;
        this.node.appendChild(label);
    }

    PubSub.subscribe(Channels.CONTAINER_RESIZE, this);

    return this.node;
};

Marker.prototype = {
    onUpdate: function(chan, msg) {
        if (chan === Channels.CONTAINER_RESIZE) {
            this.node.style.height = `${msg.radius + 10}px`;
            this.node.style.borderTopWidth = `${msg.radius - 10}px`;;
        }
    },
};
