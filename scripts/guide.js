Protractor.Guide = function(appId, container, display) {
    Object.assign(this, {
        appId,
        container,
        display,
    });
};

Protractor.Guide.prototype = {
    build: function() {
        const div = document.createElement('div');
        const moveRef = this.move.bind(this, div);

        div.className = "protractor-guide";
        div.addEventListener('mousedown', this.dragstart.bind(this, moveRef));
        document.body.addEventListener('mouseup', this.dragend.bind(this, moveRef));

        return div;
    },

    dragstart: function(move, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        document.body.addEventListener('mousemove', move);
    },

    dragend: function(move, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        document.body.removeEventListener('mousemove', move);
    },

    move: function(div, evt) {
        const bounds = this.container.getBoundingClientRect();

        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        let theta = Math.atan(Math.abs(centerY - evt.clientY) / Math.abs(centerX - evt.clientX));

        if (evt.clientX < centerX && evt.clientY < centerY) {
            theta = Math.PI + theta;
        } else if (evt.clientX < centerX) {
            theta = Math.PI - theta;
        } else if (evt.clientY < centerY) {
            theta = Math.PI * 2 - theta;
        }

        div.style.transform = `rotate(${theta * 180 / Math.PI}deg)`;
    },
};
