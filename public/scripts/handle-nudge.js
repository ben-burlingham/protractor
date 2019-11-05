HandleNudge = function({ appId, settings, i }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-handle-nudge ${appId}-handle-nudge-${i}`;
    this.node.style.display = 'none';
    this.node.setAttribute('data-index', i);

    var move = this.move.bind(this);
    var onMousedown = this.onMousedown.bind(this, move);
    var onMouseup = this.onMouseup.bind(this, move);

    this.node.addEventListener('mousedown', onMousedown);
    document.body.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseenter', onMouseup);

    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

HandleNudge.prototype = {
    onMousedown: function(ref, evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    onMouseup: function(ref, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.SET_MODE: this.setMode(msg); break;
        }
    },

    setMode: function(msg) {
        this.node.style.display = (msg.mode === "nudge" ? "block" : "none");
    },
};

HandleNudge.move = function(evt) {
    // evt.stopPropagation();
    // evt.preventDefault();
    // let offset = 0;

    // const moveX = (evt.target.dataset.index === 1 ? evt.movementX * -1 : evt.movementX);
    // const moveY = (evt.target.dataset.index === 1 ? evt.movementY * -1 : evt.movementY);

    // if (moveX < 0 && moveY < 0) {
    //     offset = Math.min(moveX, moveY);
    // } else if (moveX >= 0 && moveY >= 0) {
    //     offset = Math.max(moveX, moveY);
    // } else if (moveX < 0) {
    //     offset = (Math.abs(moveX) < moveY ? moveY : moveX);
    // } else {
    //     offset = (Math.abs(moveY) < moveX ? moveX : moveY);
    // }

    // PubSub.emit(Channels.MOVE_HANDLE_NUDGE, { offset });
};
