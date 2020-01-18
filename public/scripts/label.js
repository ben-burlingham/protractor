Label = function({ appId, settings, rad }) {
    let value = (rad === 0 ? 0 : 2 * Math.PI - rad);

    if (settings.units === "deg") {
        value = `${Math.round(value * 180 / Math.PI)}°`;
    } else {
        value = value.toFixed(settings.precision);
    }

    this.settings = settings;
    this.rad = rad;
    this.phi = 0;
    this.centerRelativeX = 0;
    this.centerRelativeY = 0;
    this.radius = 0;

    this.node = document.createElement('div');
    this.node.className = `${appId}-label`;
    this.node.innerHTML = value;

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);
    PubSub.subscribe(Channels.MOVE_HANDLE_ROTATE, this);

    if (settings.markerLabels === false) {
        this.node.style.display = 'none';
    }

    return this.node;
};

Label.prototype = {
    onMoveHandleRotate: function(msg) {
        this.phi = (this.settings.rotation === "ccw" 
            ? (-1 * msg.phi)
            : msg.phi 
        );

        this.move();
    },

    onMoveContainer: function(msg) {
        this.centerRelativeX = msg.centerRelativeX;
        this.centerRelativeY = msg.centerRelativeY;
        this.radius = msg.radius;

        this.move();
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.onMoveContainer(msg); break;
            case Channels.MOVE_HANDLE_ROTATE: this.onMoveHandleRotate(msg); break;
        }
    },

    move: function(msg) {
        const h = this.node.offsetHeight;
        const w = this.node.offsetWidth;

        const x = this.centerRelativeX - w / 2;
        const y = this.centerRelativeY - h / 2;

        this.node.style.top = (this.settings.rotation === "ccw"
            ? (y - (this.radius - 20) * Math.sin(this.rad + this.phi)) + 'px'
            : (y + (this.radius - 20) * Math.sin(this.rad + this.phi)) + 'px'
        );

        this.node.style.left = (x + (this.radius - 20) * Math.cos(this.rad + this.phi)) + 'px';
    },
};
