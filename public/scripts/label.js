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
        const x = (msg.radius + 20) + Math.cos(this.rad) * (msg.radius + 10);
        const y = (msg.radius + 20) + Math.sin(this.rad) * (msg.radius + 10);

        this.node.style.left = x + 'px';
        this.node.style.top = y + 'px';

        if (this.rad === 0) {
            this.node.style.transform = "translate(0, -50%)";
        }
        else if (this.rad === Math.PI / 2) {
            this.node.style.transform = "translate(-50%, 0)";
        }
        // Something about marker intervals prevents an exact comparison to Math.PI
        else if (this.rad < Math.PI + 0.005 && this.rad > Math.PI - 0.005) {
            this.node.style.transform = "translate(-100%, -50%)";
        }
        else if (this.rad === 3 * Math.PI / 2) {
            this.node.style.transform = "translate(-50%, -100%)";
        }
        else if (this.rad < Math.PI / 2) {
            // (Already positioned top left corner to end of guide)
        }
        else if (this.rad > Math.PI / 2 && this.rad < Math.PI) {
            this.node.style.transform = "translate(-100%, 0)";
        }
        else if (this.rad > Math.PI && this.rad < 3 * Math.PI / 2) {
            this.node.style.transform = "translate(-100%, -50%)";
        }
        else if (this.rad > 3 * Math.PI / 2) {
            this.node.style.transform = "translate(0, -50%)";
        }
    }
};
