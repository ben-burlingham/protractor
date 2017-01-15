Protractor.Guide = function(appId, container, display) {
    Object.assign(this, { appId, container,  display });
};

Protractor.Guide.prototype = {
    build: function() {
        const div = document.createElement('div');
        const ref = this.move.bind(this, div);

        div.className = "protractor-guide";
        div.addEventListener('mousedown', this.dragstart.bind(this, ref));
        document.body.addEventListener('mouseup', this.dragend.bind(this, ref));

        return div;
    },

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
