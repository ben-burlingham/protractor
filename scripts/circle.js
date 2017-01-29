Circle = function({ appId, settings }) {
    const ref = PubSub.emit.bind(null, Channels.CONTAINER_MOVE);
    this.node = document.createElement('div');
    this.node.className = `${appId}-circle`;
    this.node.style.borderRadius = `${settings.radius}px`;
    this.node.style.backgroundColor = settings.circleFill;

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    PubSub.subscribe(Channels.CONTAINER_RESIZE, this);

    return this.node;
};

Circle.prototype = {
    dragstart: function(ref, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    dragend: function(ref, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    onUpdate: function(chan, msg) {
        if (chan === Channels.CONTAINER_RESIZE) {
            this.node.style.borderRadius = `${msg.radius}px`;
        }
    },
};
