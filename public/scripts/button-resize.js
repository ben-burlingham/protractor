ButtonResize = function({ buttonSpriteUrl }) {
    this.activeClassname = 'protractor-extension-button protractor-extension-button-resizing';
    this.inactiveClassname = 'protractor-extension-button protractor-extension-button-resize';

    this.node = document.createElement('div');
    this.node.title = 'Resize';
    this.node.className = this.inactiveClassname;
    this.node.style.backgroundImage = `url('${buttonSpriteUrl}')`;

    this.node.addEventListener('click', (evt) => {
        const mode = (this.node.className === this.activeClassname ? null : "resize")
        PubSub.emit(Channels.SET_MODE, { mode });
    });

    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

ButtonResize.prototype = {
    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.SET_MODE: this.setMode(msg); break;
        }
    },

    setMode: function(msg) {
        this.node.className = (msg.mode === "resize" ? this.activeClassname : this.inactiveClassname);
    },
};