HandleRotate = function({ appId, settings, i }) {
    this.settings = settings;

    this.node = document.createElement('div');
    this.node.className = `${appId}-handle-rotate ${appId}-handle-rotate-${i}`;
    this.node.style.display = 'none';
    this.node.setAttribute('data-index', i);

    this.dragstartTheta = 0;
    this.centerViewportX = 0;
    this.centerViewportY = 0;
    this.rotation = 0;

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
        this.centerViewportX = msg.centerViewportX;
        this.centerViewportY = msg.centerViewportY;
        this.radius = msg.radius;

        const t = 40;

        this.node.style.width = `${2 * msg.radius - 2 * t}px`;
        this.node.style.height = `${2 * msg.radius - 2 * t}px`;
        this.node.style.left = `${msg.centerRelativeX - msg.radius + t}px`;
        this.node.style.top = `${msg.centerRelativeY - msg.radius + t}px`;
        this.node.style.borderRadius = `${msg.radius}px`;
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

        if (this.locked) {
            return;
        }

        const theta = this.getTheta(evt.pageX, evt.pageY)
        const delta = theta - this.dragstartTheta;

        this.rotation += -0.01//delta;
        //console.log(this.dragstartTheta * 180 / Math.PI, theta * 180 / Math.PI, delta * 180 / Math.PI)

        PubSub.emit(Channels.MOVE_HANDLE_ROTATE, { phi: this.rotation });

        // TODO rotate button
        // TODO rotate buttons to inside, follow mouse
        // TODO QA all buttons
        // TODO kill settings radius (and others?)
        // TODO center all SVGs (particularly nudge)
        // TODO doesn't work on images/pdf (works in dev mode though?)
        // TODO update benburlingham.com protractor copy to say "any browser document"
        // TODO firefox
        // TODO respond to reviews
    },

    setMode: function(msg) {
        this.node.style.display = (msg.mode === "rotate" ? "block" : "none");
    },
};
