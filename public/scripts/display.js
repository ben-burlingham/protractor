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

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));

    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    PubSub.subscribe(Channels.CONTAINER_LOCK, this);
    PubSub.subscribe(Channels.GUIDE_MOVE, this);

    return this.node;
};

Display.prototype = {
    dragstart: function(ref, evt) {
        // evt.stopPropagation();
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    dragend: function(ref, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
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

    onUpdate: function(chan, msg) {
        if (chan === Channels.GUIDE_MOVE) {
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
        }

        if (chan === Channels.CONTAINER_LOCK) {
            const classes = this.node.className.split(' ');
            const lockedClass = `${this.appId}-display-locked`;

            if (msg.locked === true) {
                this.node.className = classes.concat(lockedClass).join(' ');
            } else {
                classes.splice(classes.indexOf(lockedClass), 1);
                this.node.className = classes.join(' ');
            }
        }
    }
};
