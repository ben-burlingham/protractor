Display = function({ appId, settings }) {
    this.settings = settings;

    const ref = PubSub.emit.bind(null, Channels.MOVE);
    this.node = document.createElement('div');
    this.node.className = `${appId}-display`;
    this.guideThetas = [settings.theta0, settings.theta1];

    const { sub0, sub1, text } = this.buildFormattedStrings(
        ...this.guideThetas,
        this.settings.units,
        this.settings.precision
    );

    this.node.innerHTML = text;
    this.node.setAttribute('data-sub0', sub0);
    this.node.setAttribute('data-sub1', sub1);

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));


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
        const max = Math.max(...this.guideThetas);
        const min = Math.min(...this.guideThetas);
        const delta = max - min;
        const corrected = (delta > Math.PI ? 2 * Math.PI - delta : delta);

        const text = units === 'deg'
            ? `${Math.abs(corrected * 180 / Math.PI).toFixed(precision)}˚`
            : `${Math.abs(corrected).toFixed(precision)}`;

        const sub0 = units === 'deg'
            ? `${(theta0 * 180 / Math.PI).toFixed(precision)}˚`
            : `${theta0.toFixed(precision)}`;

        const sub1 = units === 'deg'
            ? `${(theta1 * 180 / Math.PI).toFixed(precision)}˚`
            : `${theta1.toFixed(precision)}`;

        return { text, sub0, sub1 };
    },

    onUpdate: function(chan, msg) {
        if (chan === Channels.GUIDE_MOVE) {
            this.guideThetas[msg.index] = msg.theta;

            const { sub0, sub1, text } = this.buildFormattedStrings(
                ...this.guideThetas,
                this.settings.units,
                this.settings.precision
            );

            this.node.innerHTML = text;
            this.node.setAttribute('data-sub0', sub0);
            this.node.setAttribute('data-sub1', sub1);
        }
    }
};
