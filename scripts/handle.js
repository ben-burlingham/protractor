Handle = function({ appId, settings, i }) {
    const ref = this.move.bind(this);
    this.index = i;

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

        const moveX = (this.index === 1 ? evt.movementX * -1 : evt.movementX);
        const moveY = (this.index === 1 ? evt.movementY * -1 : evt.movementY);

        if (moveX < 0 && moveY < 0) {
            offset = Math.min(moveX, moveY);
        } else if (moveX >= 0 && moveY >= 0) {
            offset = Math.max(moveX, moveY);
        } else if (moveX < 0) {
            offset = (Math.abs(moveX) < moveY ? moveY : moveX);
        } else {
            offset = (Math.abs(moveY) < moveX ? moveX : moveY);
        }

        PubSub.emit(Channels.HANDLE_MOVE, { offset });
    }
};
