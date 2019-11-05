Circle = function({ appId, settings }) {
    this.appId = appId;
    this.node = document.createElement('div');
    this.node.className = `${appId}-circle`;
    this.node.style.borderRadius = `${settings.radius}px`;
    this.node.style.backgroundColor = settings.circleFill;

    var move = this.move.bind(this);
    var onMousedown = this.onMousedown.bind(this, move);
    var onMouseup = this.onMouseup.bind(this, move);

    this.node.addEventListener('mousedown', onMousedown);
    document.body.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseenter', onMouseup);

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);
    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

Circle.prototype = {
    onMousedown: function(cb, evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', cb);
    },

    onMouseup: function(cb, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', cb);
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.resize(msg); break;
            case Channels.SET_MODE: this.setMode(msg); break;
        }
    },

    move: function(evt) {
        if (this.mode === "lock") {
            return;
        }

        evt.stopPropagation();
        evt.preventDefault();

        PubSub.emit(Channels.MOVE_CIRCLE, { x: evt.movementX, y: evt.movementY });
    },

    resize: function(msg) {
        this.node.style.borderRadius = `${msg.radius}px`;
        this.node.style.height = `${msg.radius * 2}px`;
        this.node.style.width = `${msg.radius * 2}px`;
    },

    setMode: function(msg) {
        this.mode = msg.mode;

        if (msg.mode === "lock") {
            this.node.className = `${this.appId}-circle ${this.appId}-circle-locked`;
        }
        else {
            this.node.className = `${this.appId}-circle`;
        }
    },
};
