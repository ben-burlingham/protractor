Circle = function({ appId, settings }) {
    this.appId = appId;
    this.node = document.createElement('div');
    this.node.className = `${appId}-circle`;
    this.node.style.borderRadius = `${settings.radius}px`;
    this.node.style.backgroundColor = settings.circleFill;

    PubSub.subscribe(Channels.RESIZE_MOVE, this);

    return this.node;
};

Circle.prototype = {
    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.RESIZE_MOVE: this.resize(msg); break;
        }
    },

    resize: function(msg) {
        this.node.style.borderRadius = `${msg.radius}px`;
    },
};
