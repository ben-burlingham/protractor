Protractor.Circle = function({ appId, container }) {
    Object.assign(this, { appId, container });

    const ref = this.move.bind(this);
    const div = document.createElement('div');
    div.className = `${appId}-circle`;

    div.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    return div;
};

Protractor.Circle.prototype = {
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
        evt.stopPropagation();
        evt.preventDefault();

        const conBounds = this.container.getBoundingClientRect();
        const docBounds = document.body.getBoundingClientRect();

        const newX = conBounds.left + evt.movementX;
        const newY = conBounds.top + evt.movementY;

        if (newX < docBounds.left) {
            this.container.style.left = `${docBounds.left}px`;
        } else if ((newX + conBounds.width) > docBounds.right) {
            this.container.style.left = `${docBounds.right - conBounds.width}px`;
        } else {
            this.container.style.left = `${newX}px`;
        }

        if (newY < docBounds.top) {
            this.container.style.top = `${docBounds.top}px`;
        } else if ((newY + conBounds.height) > docBounds.bottom) {
            this.container.style.top = `${docBounds.bottom - conBounds.height}px`;
        } else {
            this.container.style.top = `${newY}px`;
        }
    },
};
