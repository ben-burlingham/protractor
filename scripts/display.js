Display = function({ appId }) {
    const ref = PubSub.emit.bind(null, Channels.MOVE);
    this.node = document.createElement('div');
    this.node.className = `${appId}-display`;
    this.node.innerHTML = "999.999 rad";

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));

    this.guideThetas = { 0: 0, 1: 0 };

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
            const formattedTheta = Math.abs(Math.round(msg.theta * 180 / Math.PI) - 360) % 360;

            // if (msg.index === 0) {
            //     this.guideThetas[0] = formattedTheta;
            //     this.node.innerHTML = formattedTheta - this.guideThetas[1];
            // } else if (msg.index === 1) {
            //     this.guideThetas[1] = formattedTheta;
            //     this.node.innerHTML = formattedTheta - this.guideThetas[0];
            // }

            console.warn(this.guideThetas);
        }
    }
};
