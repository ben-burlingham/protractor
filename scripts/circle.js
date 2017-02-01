Circle = function({ appId, settings }) {
    const ref = PubSub.emit.bind(null, Channels.CONTAINER_MOVE);
    this.appId = appId;
    this.node = document.createElement('div');
    this.node.className = `${appId}-circle`;
    this.node.style.borderRadius = `${settings.radius}px`;
    this.node.style.backgroundColor = settings.circleFill;

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    PubSub.subscribe(Channels.CONTAINER_LOCK, this);
    PubSub.subscribe(Channels.CONTAINER_RESIZE, this);

    return this.node;
};

Circle.prototype = {
    // Document level listener - never stop propagation!
    dragstart: function(ref, evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    // Document level listener - never stop propagation!
    dragend: function(ref, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    onUpdate: function(chan, msg) {
        if (chan === Channels.CONTAINER_RESIZE) {
            this.node.style.borderRadius = `${msg.radius}px`;
        }

        if (chan === Channels.CONTAINER_LOCK) {
            const classes = this.node.className.split(' ');
            const lockedClass = `${this.appId}-circle-locked`;

            if (msg.locked === true) {
                this.node.className = classes.concat(lockedClass).join(' ');
            } else {
                classes.splice(classes.indexOf(lockedClass), 1);
                this.node.className = classes.join(' ');
            }
        }
    },
};
