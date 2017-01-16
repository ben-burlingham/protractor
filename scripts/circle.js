Circle = function({ appId }) {
    PubSub.subscribe('resize', this);

    const ref = PubSub.emit.bind(null, Channels.MOVE);
    this.node = document.createElement('div');
    this.node.className = `${appId}-circle`;
    this.node.style.borderRadius = '200px';

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

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
        if (chan === Channels.RESIZE) {
            this.node.style.borderRadius =
                `${this.node.parentNode.offsetWidth / 2 + msg.offset}px`;
        }
    },
};
