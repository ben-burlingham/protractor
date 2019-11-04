HandleNudge = function({ appId, settings, i }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-handle-nudge ${appId}-handle-nudge-${i}`;
    this.node.style.display = 'none';
    this.node.setAttribute('index', i);

    this.node.addEventListener('mousedown', this.onMousedown);
    document.body.addEventListener('mouseup', this.onMouseup);
    document.body.addEventListener('mouseenter', this.onMouseup);

    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

HandleNudge.prototype = {
    onMousedown: function(evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', HandleNudge.move);
    },

    onMouseup: function(evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', HandleNudge.move);
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
