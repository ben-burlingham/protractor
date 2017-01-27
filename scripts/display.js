Display = function({ appId }) {
    const ref = PubSub.emit.bind(null, Channels.MOVE);
    this.node = document.createElement('div');
    this.node.className = `${appId}-display`;
    this.node.innerHTML = "90˚";

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    this.guideThetas = { 0: 45, 1: 135 };

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
            this.guideThetas[msg.index] = 360 - msg.theta * 180 / Math.PI;

            const max = Math.max(this.guideThetas[0], this.guideThetas[1]);
            const min = Math.min(this.guideThetas[0], this.guideThetas[1]);
            const delta = max - min;

            const corrected = (delta > 180 ? 360 - delta : delta);
            const text = `${Math.abs(corrected).toFixed(2)}`;

            this.node.setAttribute('data-guide-0', `${this.guideThetas[0].toFixed(2)}˚`);
            this.node.setAttribute('data-guide-1', `${this.guideThetas[1].toFixed(2)}˚`);

            this.node.innerHTML = text + '˚';
        }
    }
};
