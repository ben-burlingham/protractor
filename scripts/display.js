Display = function({ appId }) {
    const ref = PubSub.emit.bind(null, Channels.MOVE);
    const div = document.createElement('div');
    div.className = `${appId}-display`;
    div.innerHTML = "999.999 rad";

    div.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));

    return div;
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
};
