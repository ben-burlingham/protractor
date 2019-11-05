HandleRotate = function({ appId, settings, i }) {
    this.isDragging = false;

    this.node = document.createElement('div');
    this.node.className = `${appId}-handle-rotate ${appId}-handle-rotate-${i}`;
    this.node.style.display = 'none';
    this.node.setAttribute('data-index', i);

    // var move = this.move.bind(this);
    // var onMousedown = this.onMousedown.bind(this, move);
    // var onMouseup = this.onMouseup.bind(this, move);

    // this.node.addEventListener('mousedown', onMousedown);
    // document.body.addEventListener('mouseup', onMouseup);
    // document.body.addEventListener('mouseenter', onMouseup);

    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};


// TODO rotate button
        // TODO labels
        // TODO QA all buttons
        // TODO center all SVGs (particularly nudge)
        // TODO doesn't work on images/pdf (works in dev mode though?)
        // TODO update benburlingham.com protractor copy to say "any browser document"
        // TODO firefox




        

HandleRotate.prototype = {
    onMousedown: function(ref, evt) {
        // if (this.isDragging) {  why isdragging here but not on resize
        //     return;
        // }

        // this.isDragging = true;

        // evt.preventDefault();
        // document.body.addEventListener('mousemove', ref);
    },

    onMouseup: function(ref, evt) {
        this.isDragging = false;

        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.SET_MODE: this.setMode(msg); break;
        }
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

        // this.node.style.transform = `rotate(${phi}deg)`;
        // this.node.style.left = (evt.pageX - 537) + 'px';
        // this.node.style.top = (evt.pageY - 205) + 'px';


        // PubSub.emit(Channels.ROTATE_MOVE, { phi: -1 * phi });
    },

    setMode: function(msg) {
        this.node.style.display = (msg.mode === "rotate" ? "block" : "none");
    },

    setCenter: function(msg) {
        const { x, y, width: w, height: h } = this.node.parentNode.getBoundingClientRect();

        this.center = { x: x + (w / 2), y: y + (h / 2) };

        console.log(this.center);
    },
};
