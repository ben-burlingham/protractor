Circle = function({ appId, settings }) {
    this.appId = appId;
    this.node = document.createElement('div');
    this.node.className = `${appId}-circle`;
    this.node.style.borderRadius = `${settings.radius}px`;
    this.node.style.backgroundColor = settings.circleFill;

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);

    return this.node;
};

Circle.prototype = {
    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.resize(msg); break;
        }
    },

    resize: function(msg) {
        this.node.style.borderRadius = `${msg.radius}px`;
        this.node.style.height = `${msg.radius * 2}px`;
        this.node.style.width = `${msg.radius * 2}px`;
    },
};
