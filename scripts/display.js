Display = function({ appId, initialState }) {
    this.initialState = initialState;

    const ref = PubSub.emit.bind(null, Channels.MOVE);
    this.node = document.createElement('div');
    this.node.className = `${appId}-display`;

    const { theta0, theta1 } = initialState;
    const delta = theta1 - theta0;
    this.guideThetas = [theta0, theta1];

    this.node.setAttribute('data-guide-0', `${(theta0 * 180 / Math.PI).toFixed(this.initialState.precision)}˚`);
    this.node.setAttribute('data-guide-1', `${(theta1 * 180 / Math.PI).toFixed(this.initialState.precision)}˚`);

    this.node.innerHTML = `${(delta * 180 / Math.PI).toFixed(initialState.precision)}˚`;

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

    onUpdate: function(chan, msg) {
        if (chan === Channels.GUIDE_MOVE) {
            this.guideThetas[msg.index] = msg.theta;

            const max = Math.max(...this.guideThetas);
            const min = Math.min(...this.guideThetas);
            const delta = max - min;
            const corrected = (delta > Math.PI ? 2 * Math.PI - delta : delta);

            const text = `${Math.abs(corrected * 180 / Math.PI).toFixed(this.initialState.precision)}`;
            const theta0 = this.guideThetas[0];
            const theta1 = this.guideThetas[1];
            // const text = `${((theta1 - theta0) * 180 / Math.PI).toFixed(this.initialState.precision)}`;

            this.node.setAttribute('data-guide-0', `${(theta0 * 180 / Math.PI).toFixed(this.initialState.precision)}˚`);
            this.node.setAttribute('data-guide-1', `${(theta1 * 180 / Math.PI).toFixed(this.initialState.precision)}˚`);

            this.node.innerHTML = text + '˚';
        }
    }
};
