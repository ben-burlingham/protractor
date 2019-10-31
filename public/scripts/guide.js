Guide = function({ appId, settings, i }) {
    this.node = document.createElement('div');
    this.appId = appId;
    this.settings = settings;
    this.index = i;
    this.locked = false;
    const ref = this.move.bind(this);

    this.handle = document.createElement('div');
    this.handle.className = `${appId}-guide-handle`;
    this.handle.title = "Double click to lock/unlock";
    this.node.appendChild(this.handle);

    this.node.className = `${appId}-guide`;

    if (i === 0) {
        this.node.style.backgroundColor = settings.guide0Fill;
        this.node.style.borderRightColor = settings.guide0Fill;
        this.handle.style.borderColor = settings.guide0Fill;
    } else {
        this.node.style.backgroundColor = settings.guide1Fill;
        this.node.style.borderRightColor = settings.guide1Fill;
        this.handle.style.borderColor = settings.guide1Fill;
    }

    const deg = settings[`theta${i}`] * 180 / Math.PI;
    this.node.style.transform = `rotate(${-1 * deg}deg)`;

    this.node.addEventListener('click', this.click.bind(this));
    this.node.addEventListener('mousedown', this.dragstart.bind(this, ref));

    document.body.addEventListener('mouseup', this.dragend.bind(this, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    PubSub.subscribe(Channels.ROTATE_MOVE, this);

    return this.node;
};

Guide.prototype = {
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
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    dragend: function(ref, evt) {
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

        if (this.settings.markerSnap === true) {
            const interval = this.settings.markerInterval;
            const delta = theta % interval;
            const lowerBound = 0.03;
            const upperBound = this.settings.markerInterval - 0.03;

            if (delta < lowerBound) {
                theta -= delta;
            } else if (delta > upperBound) {
                theta += (interval - delta);
            }
        }

        this.node.style.transform = `rotate(${-1 * theta * 180 / Math.PI}deg)`;
        PubSub.emit(Channels.GUIDE_MOVE, { index: this.index, theta });
    },

    onRotate: function(msg) {
        console.log(msg)

        const theta = 1;
        this.node.style.transform = `rotate(${-1 * msg.phi * 180 / Math.PI}deg)`;
    },

    onUpdate: function(chan, msg) {
        if (chan === Channels.ROTATE_MOVE) {
            this.onRotate(msg);
        }
    },
};
