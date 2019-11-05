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

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);
    // PubSub.subscribe(Channels.MOVE_HANDLE_ROTATE, this);

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
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.move(msg); break;
            // case Channels.MOVE_HANDLE_ROTATE: this.resize(msg); break;
        }
    },

    move: function(msg) {
        const h = this.node.offsetHeight;
        const w = this.node.offsetWidth;

        const x = msg.centerRelativeX - w / 2;
        const y = msg.centerRelativeY - h / 2;

        this.node.style.left = (x + (msg.radius - 20) * Math.cos(this.rad)) + 'px';
        this.node.style.top = (y + (msg.radius - 20) * Math.sin(this.rad)) + 'px';

        this.node.style.transform = `rotate(${this.rad + Math.PI / 2}rad)`;
    }
};
