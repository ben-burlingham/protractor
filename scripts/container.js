Container = function({ appId }) {
    const docBounds = document.body.getBoundingClientRect();
    const radius = 200;

    this.node = document.createElement('div');
    this.node.className = `${appId}-container`;
    this.node.style.left = `${docBounds.width / 2 - radius}px`;
    this.node.style.top = `100px`;
    this.node.style.height = `${radius * 2}px`;
    this.node.style.width = `${radius * 2}px`;

    this.locked = false;

    PubSub.subscribe(Channels.RESIZE, this);
    PubSub.subscribe(Channels.MOVE, this);
    PubSub.subscribe(Channels.LOCK_ALL, this);

    return this.node;
};

Container.prototype = {
    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE: this.move(msg); break;
            case Channels.RESIZE: this.resize(msg); break;
            case Channels.LOCK_ALL: this.locked = msg.locked; break;
        }
    },

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        if (this.locked) {
            return;
        }

        const bounds = this.node.getBoundingClientRect();
        const newX = document.body.scrollLeft + bounds.left + evt.movementX;
        const newY = document.body.scrollTop + bounds.top + evt.movementY;

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
        } else if (s <= 300) {
            correctedOffset = (bounds.width - 300) / 2;
        }

        this.node.style.left = `${bounds.left + correctedOffset}px`;
        this.node.style.top = `${bounds.top + correctedOffset}px`;
        this.node.style.width = `${bounds.width - 2 * correctedOffset}px`;
        this.node.style.height = `${bounds.height - 2 * correctedOffset}px`;
    }
};
