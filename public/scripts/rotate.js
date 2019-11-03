Rotate = function({ appId, settings, i }) {
    const ref = this.move.bind(this);
    this.index = i;
    this.isDragging = false;
    this.center = { x: 736, y: 297 };

    this.node = document.createElement('div');
    this.node.className = `${appId}-rotate ${appId}-rotate-${i}`;

    this.node.addEventListener('mousedown', this.dragstart.bind(null, ref));
    document.body.addEventListener('mouseup', this.dragend.bind(null, ref));
    document.body.addEventListener('mouseenter', this.dragend.bind(null, ref));

    // PubSub.subscribe(Channels.CONTAINER_ROTATE, this);
    // PubSub.subscribe(Channels.CONTAINER_MOVE, this);

    return this.node;
};

Rotate.prototype = {
    dragstart: function(ref, evt) {
        if (this.isDragging) {
            return;
        }

        this.isDragging = true;

        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    dragend: function(ref, evt) {
        this.isDragging = false;

        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        if (this.locked) {
            return;
        }

        
        var legX = (evt.pageX - this.center.x);
        var legY = -1 * (evt.pageY - this.center.y);
        var atan = Math.atan(legY / legX);

        let phi = 2 * Math.PI + atan;

        // if (evt.clientX < centerX && evt.clientY > centerY) {
        //     phi = Math.PI + phi;
        // } else if (evt.clientX < centerX) {
        //     phi = Math.PI - phi;
        // } else if (evt.clientY > centerY) {
        //     phi = Math.PI * 2 - phi;
        // }

        console.log(centerX, y, width, height);

        // TODO broadcast container bounds (on show?) and consume in guide, rotate
        // TODO labels to inside
        // TODO doesn't work on youtube
        // TODO doesn't work on images/pdf
        // TODO container sizing bug
        // TODO nudge button
        // TODO resize button
        // TODO firefox

        // this.node.style.transform = `rotate(${phi}deg)`;
        // this.node.style.left = (evt.pageX - 537) + 'px';
        // this.node.style.top = (evt.pageY - 205) + 'px';


        // PubSub.emit(Channels.ROTATE_MOVE, { phi: -1 * phi });
    },

    setCenter: function(msg) {
        const { x, y, width: w, height: h } = this.node.parentNode.getBoundingClientRect();

        this.center = { x: x + (w / 2), y: y + (h / 2) };

        console.log(this.center);
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.CONTAINER_ROTATE: this.toggle(msg); break;
            case Channels.CONTAINER_MOVE: this.setCenter(msg); break;
        }
    },

    toggle: function(msg) {
        this.node.style.display = msg.rotate ? 'block' : 'none';
    }
};
