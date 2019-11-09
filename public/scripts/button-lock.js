ButtonLock = function({ appId }) {
    this.activeClassname = `${appId}-button ${appId}-button-locked`;
    this.inactiveClassname = `${appId}-button ${appId}-button-lock`;

    this.node = document.createElement('div');
    this.node.title = "Lock"
    this.node.className = this.inactiveClassname;

    this.node.addEventListener('click', (evt) => {
        const mode = (this.node.className === this.activeClassname ? null : "lock")
        PubSub.emit(Channels.SET_MODE, { mode });
    });

    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

ButtonLock.prototype = {
    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.SET_MODE: this.setMode(msg); break;
        }
    },

    setMode: function(msg) {
        this.node.className = (msg.mode === "lock" ? this.activeClassname : this.inactiveClassname);
    },
};