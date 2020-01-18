HandleRotate = function({ appId, settings, i }) {
    this.node = document.createElement('div');
    this.appId = appId;
    this.settings = settings;

    this.phi = 0;

    this.handle = document.createElement('div');
    this.handle.className = `${appId}-handle-rotate-knob`;

    this.node.className = `${appId}-handle-rotate`;
    this.node.style.display = 'none';
    this.node.appendChild(this.handle);

    var move = this.move.bind(this);
    var onMousedown = this.onMousedown.bind(this, move);
    var onMouseup = this.onMouseup.bind(this, move);

    this.node.addEventListener('mousedown', onMousedown);

    document.body.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseenter', onMouseup);

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);
    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

HandleRotate.prototype = {
    onMousedown: function(ref, evt) {
        evt.preventDefault();

        this.dragstartTheta = this.getTheta(evt.pageX, evt.pageY);

        document.body.addEventListener('mousemove', ref);
    },

    onMouseup: function(ref, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    onMoveContainer: function(msg) {
        this.node.style.width = `${msg.radius}px`;
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.onMoveContainer(msg); break;
            case Channels.SET_MODE: this.setMode(msg); break;
        }
    },

    getTheta: function(x, y) {
        const legX = x - this.centerViewportX;
        const legY = this.centerViewportY - y;

        let theta = Math.atan(legY / legX);

        if (legX >= 0 && legY >= 0) {
            return theta;
        } else if (legX <= 0 && legY >= 0) {
            return Math.PI + theta;
        } else if (legX <= 0) {
            return Math.PI + theta;
        } else if (legY <= 0) {
            return Math.PI * 2 + theta;
        } 
    },

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();


        const bounds = this.node.parentNode.getBoundingClientRect();

        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        let theta = Math.abs(Math.atan((evt.clientY - centerY) / (evt.clientX - centerX)));

        if (this.settings.rotation === "ccw") {
            if (evt.clientX > centerX && evt.clientY < centerY) {
                theta = Math.PI * 2 - theta;
            } else if (evt.clientY < centerY) {
                theta = Math.PI + theta;
            } else if (evt.clientX < centerX) {
                theta = Math.PI - theta;
            } 
        } else {
            if (evt.clientX < centerX && evt.clientY > centerY) {
                theta = Math.PI + theta;
            } else if (evt.clientX < centerX) {
                theta = Math.PI - theta;
            } else if (evt.clientY > centerY) {
                theta = Math.PI * 2 - theta;
            } 
        }

        if (this.settings.markerSnap === true) {
            const interval = this.settings.markerInterval;
            const delta = theta % interval;
            const lowerBound = 0.03;
            const upperBound = this.settings.markerInterval - 0.03;

            if (this.settings.rotation === 'ccw' && delta < lowerBound) {
                theta -= delta;
            } else if (this.settings.rotation === 'ccw' && delta > upperBound) {
                theta += (interval - delta);
            } else if (delta < lowerBound) {
                theta -= delta;
            } else if (delta > upperBound) {
                theta += (interval - delta);
            }
        }

        this.theta = (this.settings.rotation === "ccw" ? theta : (-1 * theta));
        this.transform();

        PubSub.emit(Channels.MOVE_HANDLE_ROTATE, { phi: this.theta });
    },

    transform: function() {
        this.node.style.transform = `rotate(${this.theta + this.phi}rad)`;
    },

    setMode: function(msg) {
        this.node.style.display = (msg.mode === "rotate" ? "block" : "none");
    },
};
