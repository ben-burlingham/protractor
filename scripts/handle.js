Handle = function({ appId, i }) {
    Object.assign(this, { appId });

    const ref = this.move.bind(this);

    this.node = document.createElement('div');
    this.node.className = `${appId}-handle ${appId}-handle-${i}`;

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    return this.node;
};

Handle.prototype = {
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

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        let offset = 0;

        if (evt.movementX < 0 && evt.movementY < 0) {
            offset = Math.min(evt.movementX, evt.movementY);
        } else if (evt.movementX >= 0 && evt.movementY >= 0) {
            offset = Math.max(evt.movementX, evt.movementY);
        } else if (evt.movementX < 0) {
            offset = (Math.abs(evt.movementX) < evt.movementY ? evt.movementY : evt.movementX);
        } else {
            offset = (Math.abs(evt.movementY) < evt.movementX ? evt.movementX : evt.movementY);
        }

        PubSub.emit(Channels.RESIZE, { offset })
    }
};
