Guide = function({ appId, container, i }) {
    Object.assign(this, { appId });
    this.node = document.createElement('div');
    const ref = this.move.bind(this);

    // TODO handle this side effect / dep chain better
    Object.assign(this, { appId, container });

    div.className = `${appId}-guide ${appId}-guide-${i}`;
    div.addEventListener('mousedown', this.dragstart.bind(this, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(this, ref));

    return div;
};

Guide.prototype = {
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
        // evt.stopPropagation();
        // evt.preventDefault();
        // const bounds = this.container.getBoundingClientRect();
        //
        // const centerX = bounds.left + bounds.width / 2;
        // const centerY = bounds.top + bounds.height / 2;
        //
        // let theta = Math.atan(Math.abs(centerY - evt.clientY) / Math.abs(centerX - evt.clientX));
        //
        // if (evt.clientX < centerX && evt.clientY < centerY) {
        //     theta = Math.PI + theta;
        // } else if (evt.clientX < centerX) {
        //     theta = Math.PI - theta;
        // } else if (evt.clientY < centerY) {
        //     theta = Math.PI * 2 - theta;
        // }
        //
        // this.node.style.transform = `rotate(${theta * 180 / Math.PI}deg)`;
    },
};
