Label = function({ appId, settings, rad }) {
    let value = (rad === 0 ? 0 : 2 * Math.PI - rad);

    if (settings.units === "deg") {
        value = `${Math.round(value * 180 / Math.PI)}°`;
    } else {
        value = Math.round(value * 100, 2) / 100;
    }

    this.node = document.createElement('div');
    this.node.className = `${appId}-label`;

    const x = settings.radius * Math.cos(rad) + settings.radius;
    const y = settings.radius * Math.sin(rad) + settings.radius;

    const xAdjust = (2 - x / settings.radius) * 20;
    const yAdjust = (2 - y / settings.radius) * 16;

    this.node.style.left = (x - xAdjust) + 'px';
    this.node.style.top = (y - yAdjust) + 'px';
    this.node.innerHTML = value;

    PubSub.subscribe(Channels.CONTAINER_RESIZE, this);

    if (settings.markerLabels === false) {
        this.node.style.display = 'none';
    }

    return this.node;
};

Label.prototype = {
    onUpdate: function(chan, msg) {
        if (chan === Channels.CONTAINER_RESIZE) {
            this.node.style.height = `${msg.radius + 10}px`;
            this.node.style.borderTopWidth = `${msg.radius - 10}px`;;
        }
    },
};
