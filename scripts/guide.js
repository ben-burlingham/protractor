Guide = function({ appId, initialState, i }) {
    this.node = document.createElement('div');
    this.appId = appId;
    this.index = i;
    this.locked = false;
    const ref = this.move.bind(this);

    this.handle = document.createElement('div');
    this.handle.className = `${appId}-guide-handle`;
    this.handle.title = "Double click to lock/unlock";
    this.node.appendChild(this.handle);

    this.node.className = `${appId}-guide`;

    const deg = initialState[`theta${i}`] * 180 / Math.PI;
    this.node.style.transform = `rotate(${-1 * deg}deg)`;

    this.node.addEventListener('click', this.click.bind(this));
    this.node.addEventListener('mousedown', this.dragstart.bind(this, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(this, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    return this.node;
};

Guide.prototype = {
    snapConstants: {
        interval: Math.PI / 12,
        lowerBound: 0.03,
        upperBound: Math.PI / 12 - 0.03
    },

    click: function() {
        function resetDoubleClick() {
            clearTimeout(this.doubleClickTimer);
            this.doubleClickTimer = null;
        }

        if (this.doubleClickTimer) {
            resetDoubleClick.call(this);
            this.doubleClick();
        } else {
            this.doubleClickTimer = setTimeout(resetDoubleClick.bind(this), 500)
        }
    },

    doubleClick: function() {
        if (this.locked) {
            const classes = this.node.className.split(' ');
            const index = classes.indexOf(`${this.appId}-guide-locked`);

            classes.splice(index, 1);
            this.node.className = classes.join(' ');
            this.locked = false;
        } else {
            this.node.className = this.node.className.split(' ')
                .concat(`${this.appId}-guide-locked`).join(' ');
            this.locked = true;
        }
    },

    dragstart: function(ref, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    dragend: function(ref, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        if (this.locked) {
            return;
        }

        const bounds = this.node.parentNode.getBoundingClientRect();

        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        let theta = Math.abs(Math.atan((evt.clientY - centerY) / (evt.clientX - centerX)));

        if (evt.clientX < centerX && evt.clientY > centerY) {
            theta = Math.PI + theta;
        } else if (evt.clientX < centerX) {
            theta = Math.PI - theta;
        } else if (evt.clientY > centerY) {
            theta = Math.PI * 2 - theta;
        }

        const delta = theta % this.snapConstants.interval;

        if (delta < this.snapConstants.lowerBound) {
            theta -= delta;
        } else if (delta > this.snapConstants.upperBound) {
            theta += (this.snapConstants.interval - delta);
        }

        this.node.style.transform = `rotate(${-1 * theta * 180 / Math.PI}deg)`;
        PubSub.emit(Channels.GUIDE_MOVE, { index: this.index, theta });
    },
};
