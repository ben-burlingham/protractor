HandleRotate = function({ buttonSpriteUrl, settings }) {
    this.settings = settings;

    this.handle = document.createElement('div');
    this.handle.className = 'protractor-extension-handle-rotate-knob';
    this.handle.style.backgroundImage = `url('${buttonSpriteUrl}')`;

    this.node = document.createElement('div');
    this.node.className = 'protractor-extension-handle-rotate';
    this.node.style.display = 'none';
    this.node.style.transform = `rotate(${settings.phi}rad)`;
    this.node.appendChild(this.handle);

    // Non-chrome (Firefox et al)
    this.debouncedSave = HandleRotate.debouncedStorageSet(1000);

    var move = this.move.bind(this);
    var onMousedown = this.onMousedown.bind(this, move);
    var onMouseup = this.onMouseup.bind(this, move);

    this.node.addEventListener('mousedown', onMousedown);

    document.body.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseenter', onMouseup);

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);
    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

HandleRotate.debouncedStorageSet = function (ms) { 
    let timer;
    
    return function() { 
        const args = arguments;
        clearTimeout(timer);

        timer = setTimeout(function() {
            typeof browser !== "undefined" 
                ? browser.storage.sync.set(args[0])
                : chrome.storage.sync.set(args[0]);
        }, ms) 
    };
};

HandleRotate.prototype = {
    onMousedown: function(ref, evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    onMouseup: function(ref, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    onMoveContainer: function(msg) {
        this.node.style.width = `${msg.radius}px`;
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.onMoveContainer(msg); break;
            case Channels.SET_MODE: this.setMode(msg); break;
        }
    },

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        const bounds = this.node.parentNode.getBoundingClientRect();

        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        let phi = Math.abs(Math.atan((evt.clientY - centerY) / (evt.clientX - centerX)));

        // Bottom left quadrant
        if (evt.clientX < centerX && evt.clientY > centerY) {
            phi = Math.PI - phi;
        } 
        // Top left quadrant
        else if (evt.clientX < centerX) {
            phi = Math.PI + phi;
        } 
        // Top right quadrant
        else if (evt.clientY < centerY) {
            phi = Math.PI * 2 - phi;
        }

        if (this.settings.markerSnap === true) {
            const interval = this.settings.markerInterval;
            const delta = phi % interval;
            const boundA = 0.03;
            const boundB = interval - 0.03;

            if (delta < boundA) {
                phi -= delta;
            } else if (delta > boundB) {
                phi += (interval - delta);
            }
        }

        this.node.style.transform = `rotate(${phi}rad)`;

        // Always emit angles CW between 0 and Φ ➝ lim(2π)
        PubSub.emit(Channels.MOVE_HANDLE_ROTATE, { phi });

       this.debouncedSave({ phi });
    },

    setMode: function(msg) {
        this.node.style.display = (msg.mode === "rotate" ? "block" : "none");
    },
};
