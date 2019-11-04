Container = function({ appId }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-container`;

    var move = this.move.bind(this);
    var onMousedown = this.onMousedown.bind(this, move);
    var onMouseup = this.onMouseup.bind(this, move);

    this.node.addEventListener('mousedown', onMousedown);
    document.body.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseenter', onMouseup);

    this.shiftIsPressed = false;

    PubSub.subscribe(Channels.SET_MODE, this);
    PubSub.subscribe(Channels.MOVE_RESIZE_HANDLE, this);

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
            case Channels.MOVE_RESIZE_HANDLE: this.moveResizeHandle(msg); break;
        }
    },

    move: function(evt) {
        if (this.mode === "lock") {
            return;
        }

        evt.stopPropagation();
        evt.preventDefault();

        const bounds = this.node.getBoundingClientRect();

        // Must use documentElement for sites like YouTube. Ben 11/3/19
        const newH = document.documentElement.scrollHeight - bounds.height;
        const newW = document.documentElement.scrollWidth - bounds.width;

        const newX = window.scrollX + bounds.left + evt.movementX;
        const newY = window.scrollY + bounds.top + evt.movementY;

        if (newX < 0) {
            this.node.style.left = 0;
        } 
        else if (newX > newW) {
            this.node.style.left = newW + "px";
        } 
        else {
            this.node.style.left = newX + "px";
        }

        if (newY < 0) {
            this.node.style.top = 0;
        } 
        else if (newY > newH) {
            
            this.node.style.top = newH + "px";
        } 
        else {
            this.node.style.top = newY + "px";
        }

        // PubSub.emit(Channels.MOVE_CONTAINER, "foo")
    },

    moveResizeHandle: function(msg) {
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

        const newW = bounds.width - 2 * correctedOffset;
        const newH = bounds.height - 2 * correctedOffset;
        const newX = window.scrollX + bounds.left + correctedOffset;
        const newY = window.scrollY + bounds.top + correctedOffset;
        const pad = 20;

        this.node.style.left = newX + 'px';
        this.node.style.top = newY + 'px';
        this.node.style.width = newW + 'px';
        this.node.style.height = newH + 'px';
        this.node.style.padding = pad + 'px';

        PubSub.emit(Channels.MOVE_CONTAINER, {  
            centerX: newX + (newW / 2),
            centerY: newY + (newW / 2),
            radius: (newW - 2 * pad) / 2,
        });
    },

    setMode: function(msg) {
        this.mode = msg.mode;
    },
};
