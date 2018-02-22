Container = function({ appId }) {
    const docBounds = document.body.getBoundingClientRect();
    const radius = 200;

    this.node = document.createElement('div');
    this.node.className = `${appId}-container`;

    // .top and .left set in Protractor.show()
    this.node.style.height = `${radius * 2}px`;
    this.node.style.width = `${radius * 2}px`;

    this.locked = false;

    PubSub.subscribe(Channels.HANDLE_MOVE, this);
    PubSub.subscribe(Channels.CONTAINER_MOVE, this);
    PubSub.subscribe(Channels.CONTAINER_LOCK, this);

    return this.node;
};

Container.prototype = {
    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.CONTAINER_LOCK: this.locked = msg.locked; break;
            case Channels.CONTAINER_MOVE: this.move(msg); break;
            case Channels.HANDLE_MOVE: this.resize(msg); break;
        }
    },

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        if (this.locked) {
            return;
        }

        const bounds = this.node.getBoundingClientRect();
        const newX = window.scrollX + bounds.left + evt.movementX;
        const newY = window.scrollY + bounds.top + evt.movementY;

        if (newX < 0) {
            this.node.style.left = 0;
        } else if ((newX + bounds.width) > document.body.scrollWidth) {
            this.node.style.left = `${document.body.scrollWidth - bounds.width}px`;
        } else {
            this.node.style.left = `${newX}px`;
        }

        if (newY < 0) {
            this.node.style.top = 0;
        } else if ((newY + bounds.height) > document.body.scrollHeight) {
            this.node.style.top = `${document.body.scrollHeight - bounds.height}px`;
        } else {
            this.node.style.top = `${newY}px`;
        }
    },

    resize: function(msg) {
        const bounds = this.node.getBoundingClientRect();
        const x = bounds.left + msg.offset;
        const y = bounds.top + msg.offset;
        const s = bounds.width - 2 * msg.offset;

        let correctedOffset = msg.offset;

        if (x < 0 || y < 0) {
            correctedOffset = -1 * Math.min(bounds.left, bounds.top);
        } else if (s <= 200) {
            correctedOffset = (bounds.width - 200) / 2;
        }

        this.node.style.left = `${bounds.left + correctedOffset}px`;
        this.node.style.top = `${bounds.top + correctedOffset}px`;
        this.node.style.width = `${bounds.width - 2 * correctedOffset}px`;
        this.node.style.height = `${bounds.height - 2 * correctedOffset}px`;

        PubSub.emit(Channels.CONTAINER_RESIZE, { radius: (this.node.offsetWidth / 2) });
    }
};
