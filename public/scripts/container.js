Container = function({ appId }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-container`;

    PubSub.subscribe(Channels.SET_MODE, this);
    PubSub.subscribe(Channels.MOVE_CIRCLE, this);
    PubSub.subscribe(Channels.MOVE_HANDLE_RESIZE, this);

    return this.node;
};

Container.prototype = { 
    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.SET_MODE: this.setMode(msg); break;
            case Channels.MOVE_CIRCLE: this.moveCircle(msg); break;
            case Channels.MOVE_HANDLE_RESIZE: this.moveHandleResize(msg); break;
        }
    },

    moveCircle: function(msg) {
        const bounds = this.node.getBoundingClientRect();

        // Must use documentElement for sites like YouTube. Ben 11/3/19
        const maxX = document.documentElement.scrollWidth - bounds.width;
        const maxY = document.documentElement.scrollHeight - bounds.height;

        const newX = window.scrollX + bounds.left + msg.x;
        const newY = window.scrollY + bounds.top + msg.y;

        if (newX < 0) {
            this.node.style.left = 0;
        } 
        else if (newX > maxX) {
            this.node.style.left = maxX + "px";
        } 
        else {
            this.node.style.left = newX + "px";
        }

        if (newY < 0) {
            this.node.style.top = 0;
        } 
        else if (newY > maxY) {
            
            this.node.style.top = maxY + "px";
        } 
        else {
            this.node.style.top = newY + "px";
        }

        const pad = 20;

        PubSub.emit(Channels.MOVE_CONTAINER, {  
            centerX: newX + (bounds.width / 2),
            centerY: newY + (bounds.height / 2),
            radius: (bounds.width - 2 * pad) / 2,
        });
    },

    moveHandleResize: function(msg) {
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

        const newW = bounds.width + 2 * correctedOffset;
        const newH = bounds.height + 2 * correctedOffset;
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
            centerY: newY + (newH / 2),
            radius: (newW - 2 * pad) / 2,
        });
    },
};
