HandleNudge = function({ buttonSpriteUrl, settings, i }) {
    this.node = document.createElement('div');
    this.node.className = `protractor-extension-handle-nudge protractor-extension-handle-nudge-${i}`;
    this.node.style.backgroundImage = `url('${buttonSpriteUrl}')`;
    this.node.style.display = 'none';
    this.node.setAttribute('data-index', i);

    this.node.addEventListener('click', this.onClick.bind(this));

    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

HandleNudge.prototype = {
    onClick: function(evt) {
        evt.preventDefault();

        let nudge = { x: 0, y: 0 };

        const i = this.node.dataset.index * 1;

        if (i === 0) {
            nudge.y = -1;
        }

        if (i === 1) {
            nudge.x = 1;
        }

        if (i === 2) {
            nudge.y = 1;
        }

        if (i === 3) {
            nudge.x = -1;
        }

        PubSub.emit(Channels.MOVE_HANDLE_NUDGE, nudge);
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
