Label = function({ appId, settings, rad }) {
    let value = (rad === 0 ? 0 : 2 * Math.PI - rad);

    if (settings.units === "deg") {
        value = `${Math.round(value * 180 / Math.PI)}°`;
    } else {
        value = value.toFixed(settings.precision);
    }

    this.rad = rad;
    this.rotation = 0;

    this.node = document.createElement('div');
    this.node.className = `${appId}-label`;
    this.node.innerHTML = value;

    this.setPosition(settings.radius);

    PubSub.subscribe(Channels.CONTAINER_RESIZE, this);
    // PubSub.subscribe(Channels.ROTATE_MOVE, this);

    if (settings.markerLabels === false) {
        this.node.style.display = 'none';
    }

    return this.node;
};

Label.prototype = {
    onRotate: function(msg) {
        this.rotation += msg.phi;
        this.node.style.transform = `rotate(${this.rotation}deg)`;
    },

    onUpdate: function(chan, msg) {
        if (chan === Channels.CONTAINER_RESIZE) {
            this.setPosition(msg.radius);
        }

        if (chan === Channels.ROTATE_MOVE) {
            this.onRotate(msg);
        }
    },

    setPosition: function(radius) {
        const x = radius * Math.cos(this.rad) + radius;
        const y = radius * Math.sin(this.rad) + radius;

        const xAdjust = (2 - x / radius) * 20;
        const yAdjust = (2 - y / radius) * 16;

        this.node.style.left = (x - xAdjust) + 'px';
        this.node.style.top = (y - yAdjust) + 'px';
    }
};
