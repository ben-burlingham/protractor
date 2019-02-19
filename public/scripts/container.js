Container = function({ appId }) {
    const docBounds = document.body.getBoundingClientRect();
    const radius = 200;

    this.node = document.createElement('div');
    this.node.className = `${appId}-container`;

    // .top and .left set in Protractor.show()
    this.node.style.height = `${radius * 2}px`;
    this.node.style.width = `${radius * 2}px`;

    document.addEventListener('keydown', this.keydown.bind(this));
    document.addEventListener('keyup', this.keyup.bind(this));

    this.shiftIsPressed = false;
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

    keydown: function(evt) {
        if (this.locked) {
            return;
        }

        if (evt.keyCode == 16) {
            this.shiftIsPressed = true;
            return;
        }

        let d = 1;
        if (this.shiftIsPressed) {
            d = 5;
        }

        if (evt.keyCode == 37) {
            this.move(new MouseEvent('mousemove', { movementX: -d, movementY: 0 }));
        }
        else if (evt.keyCode == 38) {
            this.move(new MouseEvent('mousemove', { movementX: 0, movementY: -d }));
        }
        else if (evt.keyCode == 39) {
            this.move(new MouseEvent('mousemove', { movementX: d, movementY: 0 }));
        }
        else if (evt.keyCode == 40) {
            this.move(new MouseEvent('mousemove', { movementX: 0, movementY: d }));
        }
    },

    keyup: function(evt) {
        if (evt.keyCode == 16) {
            this.shiftIsPressed = false;
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

        this.node.style.left = `${window.scrollX + bounds.left + correctedOffset}px`;
        this.node.style.top = `${window.scrollY + bounds.top + correctedOffset}px`;
        this.node.style.width = `${bounds.width - 2 * correctedOffset}px`;
        this.node.style.height = `${bounds.height - 2 * correctedOffset}px`;

        PubSub.emit(Channels.CONTAINER_RESIZE, { radius: (this.node.offsetWidth / 2) });
    }
};
