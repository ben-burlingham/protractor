Guide = function({ settings, i }) {
    this.node = document.createElement('div');

    this.settings = settings;
    this.index = i;
    this.locked = false;

    this.theta = settings[`theta${i}`];
    this.phi = settings.phi;
    this.centerX = 0;
    this.centerY = 0;

    this.debouncedSave = Guide.debouncedStorageSet(500);

    this.knob = document.createElement('div');
    this.knob.title = "Double click to lock/unlock";
    this.knob.className = 'protractor-extension-guide-knob';
    this.node.appendChild(this.knob);

    this.node.className = 'protractor-extension-guide';

    if (i === 0) {
        this.node.style.backgroundColor = settings.guide0Fill;
        this.node.style.borderRightColor = settings.guide0Fill;
        this.knob.style.borderColor = settings.guide0Fill;
    } else {
        this.node.style.backgroundColor = settings.guide1Fill;
        this.node.style.borderRightColor = settings.guide1Fill;
        this.knob.style.borderColor = settings.guide1Fill;
    }

    var move = this.move.bind(this);
    var onMousedown = this.onMousedown.bind(this, move);
    var onMouseup = this.onMouseup.bind(this, move);

    this.node.addEventListener('mousedown', onMousedown);
    this.node.addEventListener('click', this.click.bind(this));

    document.body.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseenter', onMouseup);

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);
    PubSub.subscribe(Channels.MOVE_HANDLE_ROTATE, this);
    PubSub.subscribe(Channels.SET_MODE, this);

    return this.node;
};

Guide.debouncedStorageSet = function (ms) { 
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

Guide.prototype = {
    click: function() {
        function resetDoubleClick() {
            clearTimeout(this.doubleClickTimer);
            this.doubleClickTimer = null;
        }

        if (this.doubleClickTimer) {
            resetDoubleClick.call(this);
            this.doubleClick();
        } else {
            this.doubleClickTimer = setTimeout(resetDoubleClick.bind(this), 500)
        }
    },

    doubleClick: function() {
        if (this.locked) {
            const classes = this.node.className.split(' ');
            const index = classes.indexOf('protractor-extension-guide-locked');

            classes.splice(index, 1);
            this.node.className = classes.join(' ');
            this.locked = false;
        } else {
            this.node.className = this.node.className.split(' ')
                .concat('protractor-extension-guide-locked').join(' ');
            this.locked = true;
        }
    },

    onMousedown: function(ref, evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    onMouseup: function(ref, evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    move: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        if (this.locked || this.mode === "lock") {
            return;
        }

        const bounds = this.node.parentNode.getBoundingClientRect();

        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        let evtTheta = Math.abs(Math.atan((evt.clientY - centerY) / (evt.clientX - centerX)));

        // Bottom left quadrant
        if (evt.clientX < centerX && evt.clientY > centerY) {
            evtTheta = Math.PI - evtTheta;
        } 
        // Top left quadrant
        else if (evt.clientX < centerX) {
            evtTheta = Math.PI + evtTheta;
        } 
        // Top right quadrant
        else if (evt.clientY < centerY) {
            evtTheta = Math.PI * 2 - evtTheta;
        }

        // Must account for global rotation. Base formula: Θevt - Φ = Θguide
        let theta = ((2 * Math.PI) + (evtTheta - this.phi)) % (2 * Math.PI);

        if (this.settings.markerSnap === true) {
            const interval = this.settings.markerInterval;
            const delta = theta % interval;
            const boundA = 0.03;
            const boundB = interval - 0.03;

            if (delta < boundA) {
                theta -= delta;
            } else if (delta > boundB) {
                theta += (interval - delta);
            }
        }

        this.theta = theta;
        this.transform();

        // Always emit angles CW between 0 and Θ ➝ lim(2π)
        PubSub.emit(Channels.MOVE_GUIDE, { index: this.index, theta });

        const obj = {};
        obj[`theta${this.index}`] = theta;

        this.debouncedSave(obj);
    },

    moveContainer: function(msg) {
        this.node.style.width = `${msg.radius}px`;
        this.centerX = msg.centerViewportX;
        this.centerY = msg.centerViewportY;
        this.transform();
    },

    moveHandleRotate: function(msg) {
        this.phi = msg.phi;
        this.transform();
    },

    transform: function() {
        const rot = (this.phi + this.theta) % (Math.PI * 2);
        this.node.style.transform = `rotate(${rot}rad)`;
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.moveContainer(msg); break;
            case Channels.MOVE_HANDLE_ROTATE: this.moveHandleRotate(msg); break;
            case Channels.SET_MODE: this.setMode(msg); break;
        }
    },

    setMode: function(msg) {
        this.mode = msg.mode;
        this.node.className = (msg.mode === "lock" ? 'protractor-extension-guide protractor-extension-guide-locked' : 'protractor-extension-guide');
    },
};
