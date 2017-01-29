Display = function({ appId, settings }) {
    this.appId = appId;
    this.settings = settings;

    const ref = PubSub.emit.bind(null, Channels.CONTAINER_MOVE);
    this.node = document.createElement('div');
    this.node.className = `${appId}-display`;

    this.delta = document.createElement('div');
    this.delta.className = `${appId}-display-delta`;

    this.sub0 = document.createElement('div');
    this.sub0.className = `${appId}-display-sub0`;
    this.sub0.style.color = settings.guide0Fill;

    this.sub1 = document.createElement('div');
    this.sub1.className = `${appId}-display-sub1`;
    this.sub1.style.color = settings.guide1Fill;

    this.guideThetas = [settings.theta0, settings.theta1];

    const { sub0, sub1, delta } = this.buildFormattedStrings(
        ...this.guideThetas,
        this.settings.units,
        this.settings.precision
    );

    this.delta.innerHTML = delta;
    this.sub0.innerHTML = sub0;
    this.sub1.innerHTML = sub1;

    this.node.appendChild(this.delta);
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
        evt.stopPropagation();
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    dragend: function(ref, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    buildFormattedStrings: function(theta0, theta1, units, precision) {
        const diff = Math.max(theta0, theta1) - Math.min(theta0, theta1);
        const corrected = (diff > Math.PI ? 2 * Math.PI - diff : diff);

        const delta = units === 'deg'
            ? `${Math.abs(corrected * 180 / Math.PI).toFixed(precision)}˚`
            : `${Math.abs(corrected).toFixed(precision)}`;

        const sub0 = units === 'deg'
            ? `${(theta0 * 180 / Math.PI).toFixed(precision)}˚`
            : `${theta0.toFixed(precision)}`;

        const sub1 = units === 'deg'
            ? `${(theta1 * 180 / Math.PI).toFixed(precision)}˚`
            : `${theta1.toFixed(precision)}`;

        return { delta, sub0, sub1 };
    },

    onUpdate: function(chan, msg) {
        if (chan === Channels.GUIDE_MOVE) {
            this.guideThetas[msg.index] = msg.theta;

            const { sub0, sub1, delta } = this.buildFormattedStrings(
                ...this.guideThetas,
                this.settings.units,
                this.settings.precision
            );

            this.delta.innerHTML = delta;
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
