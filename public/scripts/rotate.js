Rotate = function({ appId, settings, i }) {
    const ref = this.move.bind(this);
    this.index = i;

    this.node = document.createElement('div');
    this.node.className = `${appId}-rotate ${appId}-rotate-${i}`;

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    PubSub.subscribe(Channels.CONTAINER_ROTATE, this);

    return this.node;
};

Rotate.prototype = {
    dragstart: function(ref, evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    dragend: function(ref, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        let offset = 0;

        if (this.locked) {
            return;
        }

        PubSub.emit(Channels.ROTATE_MOVE, { phi: 1 });
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.CONTAINER_ROTATE: this.toggle(msg); break;
        }
    },

    toggle: function(msg) {
        this.node.style.display = msg.rotate ? 'block' : 'none';
    }
};
