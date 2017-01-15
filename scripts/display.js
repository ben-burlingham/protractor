Protractor.Display = function({ appId }) {
    Object.assign(this, { appId });

    const ref = this.move.bind(this);
    const div = document.createElement('div');
    div.className = `${appId}-display`;
    div.innerHTML = "999.999 rad";

    div.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));

    return div;
};

Protractor.Display.prototype = {
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

    move: function(evt) {
        // TODO use pubsub here, reuse move methods from circle
    }
};
