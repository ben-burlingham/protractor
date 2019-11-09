Display = function({ appId, settings }) {
    this.appId = appId;
    this.settings = settings;

    const ref = PubSub.emit.bind(null, Channels.CONTAINER_MOVE);
    this.node = document.createElement('div');
    this.node.className = `${appId}-display`;
    this.node.style.background = settings.displayFill;

    this.deltaA = document.createElement('div');
    this.deltaA.className = `${appId}-display-delta-a`;

    this.deltaB = document.createElement('div');
    this.deltaB.className = `${appId}-display-delta-b`;

    this.sub0 = document.createElement('div');
    this.sub0.className = `${appId}-display-sub0`;
    this.sub0.style.color = settings.guide0Fill;

    this.sub1 = document.createElement('div');
    this.sub1.className = `${appId}-display-sub1`;
    this.sub1.style.color = settings.guide1Fill;

    this.guideThetas = [settings.theta0, settings.theta1];

    const { sub0, sub1, deltaA, deltaB } = this.buildFormattedStrings(
        ...this.guideThetas,
        this.settings.units,
        this.settings.precision
    );

    this.deltaA.innerHTML = deltaA;
    this.deltaB.innerHTML = deltaB;
    this.sub0.innerHTML = sub0;
    this.sub1.innerHTML = sub1;

    this.node.appendChild(this.deltaA);
    this.node.appendChild(this.deltaB);
    this.node.appendChild(this.sub0);
    this.node.appendChild(this.sub1);

    var move = this.move.bind(this);
    var onMousedown = this.onMousedown.bind(this, move);
    var onMouseup = this.onMouseup.bind(this, move);

    this.node.addEventListener('mousedown', onMousedown);
    document.body.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseenter', onMouseup);

    PubSub.subscribe(Channels.CONTAINER_LOCK, this);
    PubSub.subscribe(Channels.MOVE_GUIDE, this);
    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

Display.prototype = {
    onMousedown: function(cb, evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', cb);
    },

    onMouseup: function(cb, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', cb);
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_GUIDE: this.refresh(msg); break;
            case Channels.SET_MODE: this.setMode(msg); break;
        }
    },

    buildFormattedStrings: function(theta0, theta1, units, precision) {
        const diff = Math.max(theta0, theta1) - Math.min(theta0, theta1);
        const a = diff % (Math.PI * 2);
        const b = Math.PI * 2 - a;

        const deltaA = units === 'deg'
            ? `${Math.abs(a * 180 / Math.PI).toFixed(precision)}˚`
            : `${Math.abs(a).toFixed(precision)}`;

        const deltaB = units === 'deg'
            ? `${Math.abs(b * 180 / Math.PI).toFixed(precision)}˚`
            : `${Math.abs(b).toFixed(precision)}`;

        const sub0 = units === 'deg'
            ? `${(theta0 * 180 / Math.PI).toFixed(precision)}˚`
            : `${theta0.toFixed(precision)}`;

        const sub1 = units === 'deg'
            ? `${(theta1 * 180 / Math.PI).toFixed(precision)}˚`
            : `${theta1.toFixed(precision)}`;

        return { deltaA, deltaB, sub0, sub1 };
    },

    move: function(evt) {
        if (this.mode === "lock") {
            return;
        }

        evt.stopPropagation();
        evt.preventDefault();

        PubSub.emit(Channels.MOVE_CIRCLE, { x: evt.movementX, y: evt.movementY });
    },

    refresh: function(msg) {
        this.guideThetas[msg.index] = msg.theta;

        const { sub0, sub1, deltaA, deltaB } = this.buildFormattedStrings(
            ...this.guideThetas,
            this.settings.units,
            this.settings.precision
        );

        this.deltaA.innerHTML = deltaA;
        this.deltaB.innerHTML = deltaB;
        this.sub0.innerHTML = sub0;
        this.sub1.innerHTML = sub1;
    },

    setMode: function(msg) {
        this.mode = msg.mode;

        this.node.className = (msg.mode === "lock" ? `${this.appId}-display ${this.appId}-display-locked` : `${this.appId}-display`);
    },
};
