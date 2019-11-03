Container = function({ appId }) {
    const radius = 200;

    this.node = document.createElement('div');
    this.node.className = `${appId}-container`;

    // .top and .left set in Protractor.show()
    this.node.style.height = `${radius * 2}px`;
    this.node.style.width = `${radius * 2}px`;

    var move = this.move.bind(this);
    var onMousedown = this.onMousedown.bind(this, move);
    var onMouseup = this.onMouseup.bind(this, move);

    this.node.addEventListener('mousedown', onMousedown);
    document.body.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseenter', onMouseup);

    this.shiftIsPressed = false;

    PubSub.subscribe(Channels.SET_MODE, this);
    PubSub.subscribe(Channels.MOVE_RESIZE, this);

    return this.node;
};

Container.prototype = { 
    // Document level listener - never stop propagation!
    onMousedown: function(cb, evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', cb);
    },

    // Document level listener - never stop propagation!
    onMouseup: function(cb, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', cb);
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            // case Channels.CONTAINER_LOCK: this.locked = msg.locked; break;
            case Channels.SET_MODE: this.setMode(msg); break;
            case Channels.MOVE_RESIZE: this.resize(msg); break;
        }
    },

    move: function(evt) {
        // if (this.mode !== "move") {
        //     return;
        // }

        evt.stopPropagation();
        evt.preventDefault();

        const bounds = this.node.getBoundingClientRect();
        const newX = window.scrollX + bounds.left + evt.movementX;
        const newY = window.scrollY + bounds.top + evt.movementY;

        if (newX < 0) {
            this.node.style.left = 0;
        } 
        else if ((newX + bounds.width) > document.documentElement.scrollWidth) {
            // Must use documentElement for sites like YouTube. Ben 11/3/19
            this.node.style.left = `${document.documentElement.scrollWidth - bounds.width}px`;
        } 
        else {
            this.node.style.left = `${newX}px`;
        }

        if (newY < 0) {
            this.node.style.top = 0;
        } 
        else if ((newY + bounds.height) > document.documentElement.scrollHeight) {
            this.node.style.top = `${document.documentElement.scrollHeight - bounds.height}px`;
        } 
        else {
            this.node.style.top = `${newY}px`;
        }
    },

    resize: function(msg) {
        // const bounds = this.node.getBoundingClientRect();
        // const x = bounds.left + msg.offset;
        // const y = bounds.top + msg.offset;
        // const s = bounds.width - 2 * msg.offset;

        // let correctedOffset = msg.offset;

        // if (x < 0 || y < 0) {
        //     correctedOffset = -1 * Math.min(bounds.left, bounds.top);
        // } else if (s <= 200) {
        //     correctedOffset = (bounds.width - 200) / 2;
        // }

        // this.node.style.left = `${window.scrollX + bounds.left + correctedOffset}px`;
        // this.node.style.top = `${window.scrollY + bounds.top + correctedOffset}px`;
        // this.node.style.width = `${bounds.width - 2 * correctedOffset}px`;
        // this.node.style.height = `${bounds.height - 2 * correctedOffset}px`;

        // PubSub.emit(Channels.CONTAINER_RESIZE, { radius: (this.node.offsetWidth / 2) });
    },
};
