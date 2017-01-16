Container = function({ appId }) {
    const docBounds = document.body.getBoundingClientRect();
    const radius = 200;

    this.node = document.createElement('div');
    this.node.className = `${appId}-container`
    this.node.style.left = `${docBounds.width / 2 - radius}px`;
    this.node.style.top = `100px`;
    this.node.style.height = `${radius * 2}px`;
    this.node.style.width = `${radius * 2}px`;

    PubSub.subscribe('resize', this);
    PubSub.subscribe('move', this);

    return this.node;
};

Container.prototype = {
    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE: this.move(msg); break;
            case Channels.RESIZE: this.resize(msg); break;
        }
    },

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        const bounds = this.node.getBoundingClientRect();
        const newX = bounds.left + evt.movementX;
        const newY = bounds.top + evt.movementY;

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
        const w = bounds.width - 2 * msg.offset;
        const h = bounds.height - 2 * msg.offset;

        this.node.style.left = x > 0 ? `${x}px` : 0;
        this.node.style.top = y > 0 ? `${y}px` : 0;

        if (x> 0 && y > 0) {
            this.node.style.width = `${w}px`;
            this.node.style.height = `${h}px`;
        }
    }
};
